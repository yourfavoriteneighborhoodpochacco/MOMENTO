from sqlalchemy import Column, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from app.db.base import Base

class SavedLocation(Base):
    __tablename__ = "saved_locations"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), primary_key=True, nullable=False)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"), primary_key=True, nullable=False)
    saved_at = Column(DateTime(timezone=True), default = lambda: datetime.now(timezone.utc), nullable=False)
    
    user = relationship("User", back_populates="saved_locations")
    location = relationship("Location", back_populates="saved_locations")
