from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.location import LocationCreate, LocationResponse
from app.services.location import (
    create_location,
    get_all_locations,
    get_location_by_id,
    get_sublocations
)
from app.models.user import User
from app.services.auth import get_current_admin

router = APIRouter(prefix="/locations", tags=["locations"])

@router.get("/", response_model=list[LocationResponse])
def list_locations(
    parent_only: bool = False,
    db: Session = Depends(get_db)
):
    return get_all_locations(db=db, parent_only=parent_only)

@router.get("/{location_id}", response_model=LocationResponse)
def get_location(
    location_id: str,
    db: Session = Depends(get_db)
):
    location = get_location_by_id(db=db, location_id=location_id)
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found"
        )
    return location

@router.get("/{location_id}/sublocations", response_model=list[LocationResponse])
def list_sublocations(
    location_id: str,
    db: Session = Depends(get_db)
):
    return get_sublocations(db=db, parent_id=location_id)

@router.post("/", response_model=LocationResponse, status_code=status.HTTP_201_CREATED)
def add_location(
    location_data: LocationCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    return create_location(db=db, location_data=location_data)

@router.patch("/{location_id}", response_model=LocationResponse)
def update_location(
    location_id: str,
    location_data: LocationCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    location = get_location_by_id(db=db, location_id=location_id)
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found"
        )
    location.name = location_data.name
    location.category = location_data.category
    location.latitude = location_data.latitude
    location.longitude = location_data.longitude
    location.capacity_estimate = location_data.capacity_estimate
    location.parent_id = location_data.parent_id
    location.admin_tag = location_data.admin_tag
    db.commit()
    db.refresh(location)
    return location

@router.delete("/{location_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_location(
    location_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    location = get_location_by_id(db=db, location_id=location_id)
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found"
        )
    db.delete(location)
    db.commit()