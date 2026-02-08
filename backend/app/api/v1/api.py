from fastapi import APIRouter
from app.api.v1 import tasks
from app.api.v1 import auth
from app.api.v1 import profile

api_router = APIRouter()
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(auth.router)
api_router.include_router(profile.router)