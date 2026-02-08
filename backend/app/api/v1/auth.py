from fastapi import APIRouter, Depends, HTTPException, status
from datetime import timedelta
from typing import Dict, Any
from uuid import UUID

from app.models.user import User, UserCreate
from app.services.auth_service import AuthService
from app.database.session import get_db
from app.auth.jwt_handler import create_access_token
from app.auth.jwt_bearer import JWTBearer
from app.utils.response import success_response, error_response
from app.utils.settings import get_settings
from sqlmodel import Session, select

router = APIRouter(prefix="/auth", tags=["auth"])

settings = get_settings()


@router.post("/register")
async def register_user(
    email: str,
    password: str,
    first_name: str = None,
    last_name: str = None,
    db: Session = Depends(get_db)
):
    """
    Register a new user
    """
    # Check if user already exists
    existing_user = db.exec(select(User).where(User.email == email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    # Create user using AuthService
    user_create = UserCreate(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )
    
    user = AuthService.create_user(db, user_create)

    # Create access token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    token_data = {"sub": str(user.id)}
    access_token = create_access_token(
        data=token_data,
        expires_delta=access_token_expires
    )

    return success_response({
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        },
        "token": access_token
    }, message="User registered successfully")


@router.post("/login")
async def login_user(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    """
    Authenticate user and return access token
    """
    user = AuthService.authenticate_user(db, email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    token_data = {"sub": str(user.id)}
    access_token = create_access_token(
        data=token_data,
        expires_delta=access_token_expires
    )

    return success_response({
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        },
        "token": access_token
    }, message="Login successful")


@router.post("/logout")
async def logout_user(token: str = Depends(JWTBearer())):
    """
    Logout user (currently just validates the token)
    """
    # In a real implementation, you might want to blacklist the token
    # or store it in a revoked tokens list
    return success_response({}, message="Logged out successfully")


@router.get("/me")
async def get_current_user(
    token: str = Depends(JWTBearer()),
    db: Session = Depends(get_db)
):
    """
    Get current user info based on the token
    """
    from app.auth.jwt_handler import verify_token

    payload = verify_token(token)
    user_id = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.get(User, UUID(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return success_response({
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name
    })