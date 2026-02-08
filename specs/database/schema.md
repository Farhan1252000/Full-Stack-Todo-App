# Database Schema Specification

## Overview
This document defines the database schema for the Todo Full-Stack Web Application using Neon Serverless PostgreSQL. The schema is designed to work with SQLModel as the ORM layer.

## Database Configuration
- Database Provider: Neon Serverless PostgreSQL
- ORM: SQLModel (SQLAlchemy + Pydantic)
- Connection: Environment variable `DATABASE_URL`

## Required Environment Variables
- `DATABASE_URL`: Connection string for Neon PostgreSQL database

## Schema Definition

### Users Table (External Reference)
**Note**: User management is handled externally by Better Auth. The backend stores only user ID references.

- Table Name: `users` (managed by Better Auth)
- Reference Field in Backend Tables: `user_id` (UUID)

### Tasks Table
**Table Name**: `tasks`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid() | Unique identifier for the task |
| `user_id` | UUID | NOT NULL, FOREIGN KEY(users.id) | Reference to the user who owns the task |
| `title` | VARCHAR(255) | NOT NULL | Title of the task |
| `description` | TEXT | NULL | Optional description of the task |
| `completed` | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status of the task |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp when the task was created |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp when the task was last updated |

**Indexes**:
- Primary Key: `id`
- Foreign Key: `user_id` (to optimize user-based queries)
- Composite Index: `(user_id, created_at)` for efficient chronological retrieval per user
- Index on `completed` for filtering by completion status

**Foreign Key Constraints**:
- `user_id` references `users.id` in the Better Auth managed table
- ON DELETE CASCADE: When a user is deleted, all their tasks are automatically removed

### SQL Schema Definition

```sql
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint (references external Better Auth users table)
    CONSTRAINT fk_tasks_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_user_created_at ON tasks(user_id, created_at);
CREATE INDEX idx_tasks_completed ON tasks(completed);

-- Trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## SQLModel Class Definitions

### Task Model
```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
import uuid
from datetime import datetime

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)

class Task(TaskBase, table=True):
    id: Optional[uuid.UUID] = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="auth.users.id", nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationship to user (if needed)
    # user: Optional["User"] = Relationship(back_populates="tasks")

class TaskRead(TaskBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

class TaskCreate(TaskBase):
    pass

class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = None
```

## Data Access Patterns

### User Isolation
- All queries must filter by `user_id` to enforce user isolation
- No cross-user data access is permitted
- Queries should use parameterized statements to prevent SQL injection

### Common Query Patterns
1. **Get all tasks for a user**:
   ```sql
   SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3
   ```

2. **Get specific task for a user**:
   ```sql
   SELECT * FROM tasks WHERE id = $1 AND user_id = $2
   ```

3. **Create a new task**:
   ```sql
   INSERT INTO tasks (user_id, title, description, completed) 
   VALUES ($1, $2, $3, $4) 
   RETURNING *
   ```

4. **Update a task**:
   ```sql
   UPDATE tasks 
   SET title = $1, description = $2, completed = $3, updated_at = CURRENT_TIMESTAMP
   WHERE id = $4 AND user_id = $5 
   RETURNING *
   ```

5. **Delete a task**:
   ```sql
   DELETE FROM tasks WHERE id = $1 AND user_id = $2
   ```

## Migration Strategy
- Use Alembic for database migrations
- Maintain backward compatibility when possible
- Test migrations on staging before applying to production
- Backup database before running migrations in production