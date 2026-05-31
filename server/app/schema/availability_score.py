from pydantic import BaseModel, Field, UUID4
from datetime import datetime

class AvailabilityScoreCreate(BaseModel):
    location_id: UUID4
    score: float = Field(ge=0, le=100)
    
class AvailabilityScoreResponse(BaseModel):
    id: UUID4
    location_id: UUID4
    score: float
    label: str
    computed_at: datetime
    
    class Config:
        from_attributes = True