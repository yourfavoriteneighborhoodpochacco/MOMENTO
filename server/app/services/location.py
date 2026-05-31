from sqlalchemy.orm import Session
from app.models.location import Location
from app.schemas.location import LocationCreate

def create_location(
    db: Session,
    location_data: LocationCreate
) -> Location:
    location = Location(
        name=location_data.name,
        category=location_data.category,
        capacity_estimate=location_data.capacity_estimate,
        parent_id=location_data.parent_id,
        admin_tag=location_data.admin_tag
    )
    db.add(location)
    db.commit()
    db.refresh(location)
    return location

def get_all_locations(
    db: Session,
    parent_only: bool = False
) -> list[Location]:
    query = db.query(Location)
    if parent_only:
        query = query.filter(Location.parent_id == None)
    return query.all()

def get_location_by_id(
    db: Session,
    location_id: str
) -> Location | None:
    return (
        db.query(Location)
        .filter(Location.id == location_id)
        .first()
    )

def get_sublocations(
    db: Session,
    parent_id: str
) -> list[Location]:
    return (
        db.query(Location)
        .filter(Location.parent_id == parent_id)
        .all()
    )