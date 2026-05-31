from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.db.session import get_db
from app.models.user import User
from app.services.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/applications", tags=["applications"])

# Request / response schemas

class ApplicationSubmit(BaseModel):
    note: str

class ApplicationResponse(BaseModel):
    id: str
    username: str
    email: str
    status: str
    note: Optional[str] = None

    class Config:
        from_attributes = True

# Submit a contributor application
# Any logged-in non-contributor can apply

@router.post("/", status_code=status.HTTP_200_OK)
def submit_application(
    body: ApplicationSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.account_type == "contributor":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already a contributor"
        )

    if current_user.status == "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have a pending application"
        )

    if current_user.status == "suspended":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been suspended"
        )

    current_user.status = "pending"
    current_user.application_note = body.note
    db.commit()
    db.refresh(current_user)

    return {"detail": "Application submitted. You will be notified by SMS when reviewed."}

# Admin list all applicants

@router.get(
    "/pending",
    response_model=list[ApplicationResponse]
)
def list_pending_applications(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    return (
        db.query(User)
        .filter(User.status == "pending")
        .all()
    )

# Admin approve an application

@router.patch("/{user_id}/approve", status_code=status.HTTP_200_OK)
def approve_application(
    user_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if user.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No pending application for this user"
        )

    user.account_type = "contributor"
    user.status = "approved"
    db.commit()

    # SMS notification goes here once Twilio is wired up
    # send_sms(user.phone_number, "Your Momento contributor application has been approved!")

    return {"detail": f"{user.username} is now a contributor"}

# Admin suspend a user

@router.patch("/{user_id}/suspend", status_code=status.HTTP_200_OK)
def suspend_user(
    user_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if user.status == "suspended":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already suspended"
        )

    user.status = "suspended"
    db.commit()

    return {"detail": f"{user.username} has been suspended"}