from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.session import get_db
from app.services.user import get_user_by_email, verify_password
from app.services.auth import create_access_token, get_current_user
from app.schemas.user import UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])

# Response schema for the token

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Login

@router.post("/login", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = get_user_by_email(db=db, email=form_data.username)

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    token = create_access_token(user_id=str(user.id))
    return TokenResponse(access_token=token)

# Get the currently logged-in user

@router.get("/me", response_model=UserResponse)
def get_me(
    current_user=Depends(get_current_user)
):
    return current_user