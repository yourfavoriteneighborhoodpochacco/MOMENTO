from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.models.availability_score import AvailabilityScore

def upsert_availability_score(
    db: Session,
    location_id: str,
    score: float,
    label: str
) -> AvailabilityScore:
    existing = (
        db.query(AvailabilityScore)
        .filter(AvailabilityScore.location_id == location_id)
        .first()
    )

    if existing:
        existing.score = score
        existing.label = label
        existing.computed_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(existing)
        return existing

    new_score = AvailabilityScore(
        location_id=location_id,
        score=score,
        label=label
    )
    db.add(new_score)
    db.commit()
    db.refresh(new_score)
    return new_score

def get_score_for_location(
    db: Session,
    location_id: str
) -> AvailabilityScore | None:
    return (
        db.query(AvailabilityScore)
        .filter(AvailabilityScore.location_id == location_id)
        .first()
    )