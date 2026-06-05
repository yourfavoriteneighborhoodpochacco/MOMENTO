from pydantic import BaseModel, Field, UUID4
from typing import Optional
from datetime import datetime
from uuid import UUID

class UserCreate(BaseModel):
    first_name: str
    username: str
    email: str
    password: str
    phone_number: Optional[str] = None
    profile_photo_url: Optional[str] = None
    location: Optional[str] = None
    sms_notifications: bool
    availability_alerts: bool

    
class UserResponse(BaseModel):
    id: UUID
    first_name: str
    username: str
    email: str
    phone_number: Optional[str] = None
    profile_photo_url: Optional[str] = None
    account_type: str
    status: Optional[str] = None
    location: Optional[str] = None
    sms_notifications: bool
    availability_alerts: bool
    member_since: datetime

    class Config:
        from_attributes = True