from sqlmodel import SQLModel, Field
from typing import Optional
import uuid
from datetime import datetime


class UserBase(SQLModel):
    email: str = Field(unique=True, nullable=False)
    first_name: Optional[str] = Field(default=None)
    last_name: Optional[str] = Field(default=None)


class User(UserBase, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    password: str = Field(nullable=False)  # hashed password
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UserRead(UserBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class UserCreate(UserBase):
    password: str
    email: str


class UserUpdate(SQLModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None