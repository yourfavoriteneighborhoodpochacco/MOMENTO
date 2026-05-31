from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
import uuid

from app.db.base import Base

class Location(Base):
    __tablename__ = "locations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    coordinates = Column(Geometry("POINT", srid=4326), nullable=False)
    capacity_estiamte = Column(Integer, nullable=False)
    parent_id = Column(UUID(as_uuid=True), nullable=True)
    admin_tag = Column(String, nullable=True)
    
    coordinate = relationship("Coordinate", back_populates="locations")