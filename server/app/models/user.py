from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String, nullable=False)
    username = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    password_hash = Column(String, nullable=True)
    profile_photo_url = Column(String, nullable=True)
    account_type = Column(String, nullable=False)
    status = Column(String, nullable=True)
    
    location = Column(String, nullable=True)
    sms_notifications = Column(Boolean, nullable=False)
    availability_alerts = Column(Boolean, nullable=False)
    member_since = Column(DateTime(timezone=True), default = lambda: datetime.now(timezone.utc), nullable=False)
    
    crowd_reports = relationship("CrowdReport", back_populates="users")
    saved_locations = relationship("SavedLocation", back_populates="users")