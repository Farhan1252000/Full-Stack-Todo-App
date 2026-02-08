from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from uuid import UUID
from sqlmodel import Session

from app.models.task import Task, TaskCreate, TaskUpdate, TaskRead
from app.database.session import get_db
from app.auth.jwt_bearer import JWTBearer
from app.utils.response import success_response, error_response
from app.services.task_service import TaskService

router = APIRouter()


@router.get("/")
async def get_tasks(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    status_filter: Optional[str] = Query(None, alias="status", regex="^(all|active|completed)$"),
    token: str = Depends(JWTBearer()),
    db: Session = Depends(get_db)
):
    """
    Retrieve all tasks for the authenticated user
    """
    user_id = token  # The token contains the user ID after verification

    # Get tasks using TaskService
    tasks = TaskService.get_tasks_for_user(
        db=db,
        user_id=UUID(user_id),
        limit=limit,
        offset=offset,
        status_filter=status_filter
    )

    # Count total tasks for pagination
    total_count_query = db.query(Task).filter(Task.user_id == UUID(user_id))
    if status_filter:
        if status_filter == "active":
            total_count_query = total_count_query.filter(Task.completed == False)
        elif status_filter == "completed":
            total_count_query = total_count_query.filter(Task.completed == True)
    total_count = total_count_query.count()

    # Convert to response format
    task_list = [TaskRead.from_orm(task) for task in tasks]

    return success_response({
        "tasks": task_list,
        "total_count": total_count,
        "limit": limit,
        "offset": offset
    })


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_task(
    task: TaskCreate,
    token: str = Depends(JWTBearer()),
    db: Session = Depends(get_db)
):
    """
    Create a new task for the authenticated user
    """
    user_id = token  # The token contains the user ID after verification

    # Create task using TaskService
    db_task = TaskService.create_task(
        db=db,
        user_id=UUID(user_id),
        task_create=task
    )

    return success_response(TaskRead.from_orm(db_task), message="Task created successfully")


@router.get("/{task_id}")
async def get_task(
    task_id: UUID,
    token: str = Depends(JWTBearer()),
    db: Session = Depends(get_db)
):
    """
    Retrieve a specific task for the authenticated user
    """
    user_id = token  # The token contains the user ID after verification

    # Get task using TaskService
    task = TaskService.get_task_by_id(
        db=db,
        task_id=task_id,
        user_id=UUID(user_id)
    )

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return success_response(TaskRead.from_orm(task))


@router.put("/{task_id}")
async def update_task(
    task_id: UUID,
    task_update: TaskUpdate,
    token: str = Depends(JWTBearer()),
    db: Session = Depends(get_db)
):
    """
    Update a specific task for the authenticated user
    """
    user_id = token  # The token contains the user ID after verification

    # Update task using TaskService
    updated_task = TaskService.update_task(
        db=db,
        task_id=task_id,
        user_id=UUID(user_id),
        task_update=task_update
    )

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return success_response(TaskRead.from_orm(updated_task), message="Task updated successfully")


@router.delete("/{task_id}")
async def delete_task(
    task_id: UUID,
    token: str = Depends(JWTBearer()),
    db: Session = Depends(get_db)
):
    """
    Delete a specific task for the authenticated user
    """
    user_id = token  # The token contains the user ID after verification

    # Delete task using TaskService
    success = TaskService.delete_task(
        db=db,
        task_id=task_id,
        user_id=UUID(user_id)
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return success_response(message="Task deleted successfully")


@router.patch("/{task_id}/toggle-completion")
async def toggle_task_completion(
    task_id: UUID,
    token: str = Depends(JWTBearer()),
    db: Session = Depends(get_db)
):
    """
    Toggle the completion status of a specific task for the authenticated user
    """
    user_id = token  # The token contains the user ID after verification

    # Toggle task completion using TaskService
    updated_task = TaskService.toggle_task_completion(
        db=db,
        task_id=task_id,
        user_id=UUID(user_id)
    )

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return success_response(TaskRead.from_orm(updated_task), message="Task completion status updated")