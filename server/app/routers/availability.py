from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.availability_pattern import AvailabilityPatternCreate, AvailabilityPatternResponse
from app.services.availability_pattern import create_availability_pattern
from app.schemas.availability_score import AvailabilityScoreCreate, AvailabilityScoreResponse
from app.services.availability_score import create_availability_score
# GET/availability/:id