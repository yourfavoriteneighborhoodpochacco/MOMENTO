from pydantic import BaseModel, Field, UUID4

class AvailabilityPatternCreate(BaseModel):
    day_of_week: int = Field(ge=0, le=6)
    hour: int = Field(ge=0, le=23)
    
class AvailabilityPatternResponse(BaseModel):
    id: UUID4
    location_id: UUID4
    day_of_week: int
    hour: int
    base_score: float = Field(ge=0, le=1)
    
    class Config:
        from_atributes: True
    
    