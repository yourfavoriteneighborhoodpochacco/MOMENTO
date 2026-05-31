from sqlalchemy.orm import Session
from app.models.availability_pattern import AvailabilityPattern
from app.schemas.availability_pattern import AvailabilityPatternCreate

def create_availability_pattern(
    db: Session,
    pattern_data: AvailabilityPatternCreate,
    location_id: str
) -> AvailabilityPattern:
    pattern = AvailabilityPattern(
        location_id=location_id,
        day_of_week=pattern_data.day_of_week,
        hour=pattern_data.hour,
        base_score=pattern_data.base_score
    )
    db.add(pattern)
    db.commit()
    db.refresh(pattern)
    return pattern

def get_patterns_for_location(
    db: Session,
    location_id: str
) -> list[AvailabilityPattern]:
    return (
        db.query(AvailabilityPattern)
        .filter(AvailabilityPattern.location_id == location_id)
        .all()
    )

def get_pattern_for_time(
    db: Session,
    location_id: str,
    day_of_week: int,
    hour: int
) -> AvailabilityPattern | None:
    return (
        db.query(AvailabilityPattern)
        .filter(
            AvailabilityPattern.location_id == location_id,
            AvailabilityPattern.day_of_week == day_of_week,
            AvailabilityPattern.hour == hour
        )
        .first()
    )