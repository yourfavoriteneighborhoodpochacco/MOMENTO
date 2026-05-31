from pydantic import BaseModel, Field, UUID4
from datetime import datetime

class UserCreate(BaseModel):
    first_name: str
    username: str
    email: str
    phone_number: str
    password_hash: str
    profile_photo_url: str
    
    location: str
    sms_notifications: bool
    availability_alerts: bool
    
class UserResponse(BaseModel):
    id: UUID4
    first_name: str
    username: str
    email: str
    phone_number: str
    password_hash: str
    profile_photo_url: str 
    account_type: str
    status: str
    
    location: str
    sms_notifications: bool
    availability_alerts: bool
    member_since: datetime
    
    class Config:
        from_attributes: True