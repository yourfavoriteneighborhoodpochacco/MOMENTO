from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.db.base import Base

class AvailabilityPattern(Base):
    __tablename__ = "availability_patterns"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"), nullable=False)
    day_of_week = Column(Integer, nullable=False)
    hour = Column(Integer, nullable=False)
    base_score = Column(Float, nullable=False)
    
    location = relationship("Location", back_populates="availability_patterns")
    