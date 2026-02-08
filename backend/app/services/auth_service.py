from sqlmodel import Session, select
from app.models.user import User, UserCreate, UserUpdate
from passlib.context import CryptContext
import uuid
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @classmethod
    def authenticate_user(cls, db: Session, email: str, password: str) -> User | None:
        # Find user by email
        user = db.exec(select(User).where(User.email == email)).first()

        if not user or not cls.verify_password(password, user.password):
            return None

        return user

    @classmethod
    def create_user(cls, db: Session, user_create: UserCreate) -> User:
        # Hash the password
        hashed_password = cls.hash_password(user_create.password)

        # Create new user
        user = User(
            email=user_create.email,
            password=hashed_password,
            first_name=user_create.first_name,
            last_name=user_create.last_name
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    @classmethod
    def update_user(cls, db: Session, user_id: uuid.UUID, user_update: UserUpdate) -> User:
        # Get the user by ID
        user = db.get(User, user_id)
        if not user:
            return None

        # Update only the fields that are provided
        update_data = user_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)

        # Update the updated_at timestamp
        user.updated_at = datetime.utcnow()

        db.add(user)
        db.commit()
        db.refresh(user)

        return user