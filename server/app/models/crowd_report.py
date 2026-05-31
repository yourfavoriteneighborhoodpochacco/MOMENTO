from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from app.db.base import Base

class CrowdReport(Base):
    __tablename__ = "crowd_reports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location_id = Column(UUID(as_uuid=True), ForeignKey("location.id"), nullable=False)
    submitted_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    seated_count = Column(Integer, nullable=False)
    line_count = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), default = lambda: datetime.now(timezone.utc), nullable=False)
    
    location = relationship("Location", back_populates="crowd_reports")
    user = relationship("User", back_populates="crowd_reports")