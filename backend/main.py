
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# Setup logging
from app.utils.logging_config import setup_logging
setup_logging()

# Get settings
from app.utils.settings import get_settings
settings = get_settings()

# Import API routers
from app.api.v1.api import api_router

# Import and register exception handlers
from app.utils.exception_handlers import register_exception_handlers

# Create FastAPI app instance
app = FastAPI(
    title="Todo API",
    description="REST API for the Todo Full-Stack Web Application",
    version="1.0.0"
)

# Register exception handlers
register_exception_handlers(app)

# Configure CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_origin.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # Expose authorization header for JWT
    expose_headers=["Authorization"]
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to the Todo API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}