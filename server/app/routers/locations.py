from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.location import LocationCreate, LocationResponse
from app.services.location import create_location
# GET/locations
# POST/locations