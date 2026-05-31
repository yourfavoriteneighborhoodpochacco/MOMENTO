from pydantic import BaseModel, UUID4
from datetime import datetime

class SavedLocaitonCreate(BaseModel):
    saved_at: datetime
    
class SavedLocationResponse(BaseModel):
    user_id: UUID4
    location_id: UUID4
    saved_at: datetime
    
    class Config:
        from_attributes: True