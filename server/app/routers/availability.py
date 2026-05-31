from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.db.session import get_db
from app.services.location import get_location_by_id
from app.services.scoring import recompute_score
from app.services.availability_score import get_score_for_location
from app.schemas.availability_score import AvailabilityScoreResponse

router = APIRouter(prefix="/locations", tags=["availability"])

@router.get(
    "/{location_id}/availability",
    response_model=AvailabilityScoreResponse
)
def get_availability(
    location_id: str,
    db: Session = Depends(get_db)
):
    location = get_location_by_id(db=db, location_id=location_id)
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found"
        )

    score = get_score_for_location(db=db, location_id=location_id)

    # If there isn't an existing score, then generate a new one
    if not score:
        recompute_score(db=db, location_id=location_id)
        score = get_score_for_location(db=db, location_id=location_id)

    return score