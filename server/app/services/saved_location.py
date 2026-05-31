from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime, timezone, timedelta

from app.models.saved_location import SavedLocation
from app.schemas.saved_location import SavedLocationCreate