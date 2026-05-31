from pydantic import BaseModel, Field, UUID4
from typing import Optional

class Point(BaseModel):
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    
class LocationCreate(BaseModel):
    name: str
    category: str
    coordinates: Point
    capacity_estimate: int = Field(..., ge=0, le=500)
    
class LocationResponse(BaseModel):
    id: UUID4
    name: str
    category: str
    coordinates: Point
    capacity_estimate: int
    parent_id: Optional[UUID4] = None
    admin_tag: Optional[str] = None
    
    class Config:
        from_attributes = True