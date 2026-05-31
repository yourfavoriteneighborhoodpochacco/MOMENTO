from sqlalchemy.orm import Session
import bcrypt
from app.models.user import User
from app.schemas.user import UserCreate

def hash_password(plain_password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(plain_password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed.encode("utf-8")
    )

def create_user(
    db: Session,
    user_data: UserCreate
) -> User:
    existing_email = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )
    if existing_email:
        raise ValueError("Email already registered")

    existing_username = (
        db.query(User)
        .filter(User.username == user_data.username)
        .first()
    )
    if existing_username:
        raise ValueError("Username already taken")

    user = User(
        first_name=user_data.first_name,
        username=user_data.username,
        email=user_data.email,
        phone_number=user_data.phone_number,
        password_hash=hash_password(user_data.password),
        profile_photo_url=user_data.profile_photo_url,
        account_type="non-contributor",
        status=None,
        location=user_data.location,
        sms_notifications=user_data.sms_notifications,
        availability_alerts=user_data.availability_alerts
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_email(
    db: Session,
    email: str
) -> User | None:
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(
    db: Session,
    user_id: str
) -> User | None:
    return db.query(User).filter(User.id == user_id).first()