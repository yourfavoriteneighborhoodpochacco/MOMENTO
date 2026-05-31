from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime, timezone, timedelta

from apps.models.user import User
from apps.schemas.user import UserCreate