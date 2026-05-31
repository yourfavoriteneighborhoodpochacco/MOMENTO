from sqlalchemy import Column, ForeignKey, Float, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from app.db.base import Base

class AvailabilityScore(Base):
    __tablename__ = "availability_patterns"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location_id = Column(UUID(as_uuid=True), ForeignKey("location.id"), nullable=False)
    score = Column(Float, nullable=False)
    label = Column(String, nullable=False)
    computed_at = Column(DateTime(timezone=True), default = lambda: datetime(timezone.utc), nullable=False)
    
    location = relationship("Location", back_populates="availability_patterns")