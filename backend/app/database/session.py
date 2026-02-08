from sqlmodel import create_engine, Session
from sqlalchemy.orm import sessionmaker
from app.utils.settings import get_settings

# Get database URL from settings
settings = get_settings()

# Create the database engine
engine = create_engine(
    settings.database_url,
    echo=settings.db_echo,  # Set to True for debugging SQL queries
    pool_pre_ping=True,  # Verify connections before use
    pool_size=settings.db_pool_size,
    max_overflow=settings.db_max_overflow
)

# Create a configured "SessionLocal" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """
    Dependency to get database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()