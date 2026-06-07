from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.orm import Session
import asyncio

from app.db.session import get_db
from app.schemas.crowd_report import CrowdReportCreate, CrowdReportResponse
from app.services.crowd_report import create_crowd_report
from app.services.scoring import recompute_score, score_to_label
from app.services.auth import get_current_contributor
from app.services.websocket import manager
from app.models.user import User

router = APIRouter(prefix="/crowd-reports", tags=["reports"])

@router.post(
    "/",
    response_model=CrowdReportResponse,
    status_code=status.HTTP_201_CREATED
)
async def submit_crowd_report(
    report_data: CrowdReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_contributor)
):
    report = create_crowd_report(
        db=db,
        report_data=report_data,
        user_id=str(current_user.id)
    )

    new_score = recompute_score(db=db, location_id=str(report_data.location_id))

    await manager.broadcast_to_location(
        location_id=str(report_data.location_id),
        message={
            "location_id": str(report_data.location_id),
            "score": new_score,
            "label": score_to_label(new_score)
        }
    )

    return report