from pydantic import BaseModel, UUID4
from datetime import datetime

class SavedLocationCreate(BaseModel):
    location_id: UUID4
    
class SavedLocationResponse(BaseModel):
    user_id: UUID4
    location_id: UUID4
    saved_at: datetime
    
    class Config:
        from_attributes = True