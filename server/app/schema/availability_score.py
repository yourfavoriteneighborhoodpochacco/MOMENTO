from pydantic import BaseModel, Field, UUID4
from datetime import datetime

class AvailabilityScoreResponse(BaseModel):
    id: UUID4
    location_id: UUID4
    score: float = Field(ge=0, le=100)
    label: str
    computed_at: datetime
    
    class Config:
        from_attributes: True