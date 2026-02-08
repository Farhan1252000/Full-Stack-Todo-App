from sqlmodel import Session, select
from app.models.task import Task, TaskCreate, TaskUpdate
from app.models.user import User
from typing import List, Optional
from uuid import UUID


class TaskService:
    @classmethod
    def create_task(cls, db: Session, user_id: UUID, task_create: TaskCreate) -> Task:
        """
        Create a new task for a user
        """
        task = Task.from_orm(task_create)
        task.user_id = user_id
        
        db.add(task)
        db.commit()
        db.refresh(task)
        
        return task

    @classmethod
    def get_task_by_id(cls, db: Session, task_id: UUID, user_id: UUID) -> Optional[Task]:
        """
        Get a specific task by ID for a user
        """
        task = db.get(Task, task_id)
        if task and task.user_id == user_id:
            return task
        return None

    @classmethod
    def get_tasks_for_user(
        cls, 
        db: Session, 
        user_id: UUID, 
        limit: int = 50, 
        offset: int = 0,
        status_filter: Optional[str] = None
    ) -> List[Task]:
        """
        Get all tasks for a specific user with optional filtering and pagination
        """
        query = select(Task).where(Task.user_id == user_id)

        # Apply status filter if provided
        if status_filter:
            if status_filter == "active":
                query = query.where(Task.completed == False)
            elif status_filter == "completed":
                query = query.where(Task.completed == True)

        # Apply pagination
        query = query.offset(offset).limit(limit).order_by(Task.created_at.desc())

        return db.exec(query).all()

    @classmethod
    def update_task(cls, db: Session, task_id: UUID, user_id: UUID, task_update: TaskUpdate) -> Optional[Task]:
        """
        Update a task for a user
        """
        task = db.get(Task, task_id)
        if not task or task.user_id != user_id:
            return None

        # Update task with provided fields
        update_data = task_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)

        db.add(task)
        db.commit()
        db.refresh(task)

        return task

    @classmethod
    def delete_task(cls, db: Session, task_id: UUID, user_id: UUID) -> bool:
        """
        Delete a task for a user
        """
        task = db.get(Task, task_id)
        if not task or task.user_id != user_id:
            return False

        db.delete(task)
        db.commit()
        return True

    @classmethod
    def toggle_task_completion(cls, db: Session, task_id: UUID, user_id: UUID) -> Optional[Task]:
        """
        Toggle the completion status of a task for a user
        """
        task = db.get(Task, task_id)
        if not task or task.user_id != user_id:
            return None

        task.completed = not task.completed
        db.add(task)
        db.commit()
        db.refresh(task)

        return task