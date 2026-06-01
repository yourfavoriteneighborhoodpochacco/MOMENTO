from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.services.websocket import manager

from app.db.session import get_db
from app.schemas.crowd_report import CrowdReportCreate, CrowdReportResponse
from app.services.crowd_report import create_crowd_report
from app.services.scoring import recompute_score
from app.services.auth import get_current_contributor

router = APIRouter(prefix="/crowd-reports", tags=["reports"])

@router.post(
    "/",
    response_model=CrowdReportResponse,
    status_code=status.HTTP_201_CREATED
)
def submit_crowd_report(
    report_data: CrowdReportCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_contributor)
):
    if current_user.account_type != "contributor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only contributors can submit crowd reports"
        )

    report = create_crowd_report(
        db=db,
        report_data=report_data,
        user_id=str(current_user.id)
    )

    recompute_score(db=db, location_id=str(report_data.location_id))
    
    new_score = recompute_score(db=db, location_id=str(report_data.location_id))

    import asyncio
    asyncio.create_task(
        manager.broadcast_to_location(
            location_id=str(report_data.location_id),
            message={
                "location_id": str(report_data.location_id),
                "score": new_score,
                "label": score_to_label(new_score)
            }
        )
    )

    return report