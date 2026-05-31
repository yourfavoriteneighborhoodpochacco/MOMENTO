from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime, timezone, timedelta

from app.models.availability_pattern import AvailabilityPattern
from app.schemas.availability_pattern import AvailabilityPatternCreate