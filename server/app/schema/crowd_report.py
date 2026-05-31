from pydantic import BaseModel, Field, UUID4
from datetime import datetime

class CrowdReportCreate(BaseModel):
    location_id: UUID4
    seated_count: int = Field(..., ge=0, le=500)
    line_count: int = Field(..., ge=0, le=500)
    
class CrowdReportResponse(BaseModel):
    id: UUID4
    location_id: UUID4
    submitted_by: UUID4
    seated_count: int
    line_count: int
    created_at: datetime
    
    class Config:
        from_attributes = True