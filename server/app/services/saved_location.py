from sqlalchemy.orm import Session
from app.models.saved_location import SavedLocation

def save_location(
    db: Session,
    user_id: str,
    location_id: str
) -> SavedLocation:
    saved = SavedLocation(
        user_id=user_id,
        location_id=location_id
    )
    db.add(saved)
    db.commit()
    db.refresh(saved)
    return saved

def unsave_location(
    db: Session,
    user_id: str,
    location_id: str
) -> bool:
    saved = (
        db.query(SavedLocation)
        .filter(
            SavedLocation.user_id == user_id,
            SavedLocation.location_id == location_id
        )
        .first()
    )
    if not saved:
        return False
    db.delete(saved)
    db.commit()
    return True

def get_saved_locations(
    db: Session,
    user_id: str
) -> list[SavedLocation]:
    return (
        db.query(SavedLocation)
        .filter(SavedLocation.user_id == user_id)
        .all()
    )