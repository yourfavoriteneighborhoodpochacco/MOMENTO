from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime, timezone, timedelta

from app.models.location import Location
from app.schemas.location import LocationCreate