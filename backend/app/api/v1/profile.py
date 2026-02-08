from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.auth.jwt_bearer import JWTBearer
from app.services.auth_service import AuthService

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("/", response_model=UserResponse)
async def get_profile(
    current_user: User = Depends(JWTBearer()),
    db: Session = Depends(get_db)
):
    """
    Get current user's profile information
    """
    return current_user

@router.put("/", response_model=UserResponse)
async def update_profile(
    user_update: UserUpdate,
    current_user: User = Depends(JWTBearer()),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile information
    """
    updated_user = AuthService.update_user(db, current_user.id, user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user