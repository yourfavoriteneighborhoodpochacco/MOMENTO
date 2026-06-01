from pydantic import BaseModel, Field, UUID4
from typing import Optional

class LocationCreate(BaseModel):
    name: str
    category: str
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    capacity_estimate: int = Field(..., ge=0)
    parent_id: Optional[UUID4] = None
    admin_tag: Optional[str] = None

class LocationResponse(BaseModel):
    id: UUID4
    name: str
    category: str
    latitude: float
    longitude: float
    capacity_estimate: int
    parent_id: Optional[UUID4] = None
    admin_tag: Optional[str] = None

    class Config:
        from_attributes = True