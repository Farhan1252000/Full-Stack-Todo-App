# REST API Endpoints Specification

## Overview
This document defines the RESTful API endpoints for the Todo Full-Stack Web Application backend. All endpoints require JWT authentication and enforce user isolation.

## Base URL
All API endpoints are prefixed with `/api/v1`

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## Endpoints

### Task Management

#### GET /api/v1/tasks
**Purpose**: Retrieve all tasks for the authenticated user

**Headers**:
- `Authorization: Bearer <jwt_token>` (required)

**Query Parameters**:
- `limit` (optional): Number of tasks to return (default: 50, max: 100)
- `offset` (optional): Number of tasks to skip (for pagination)
- `status` (optional): Filter by task status ('all', 'active', 'completed')

**Response**:
- Status: 200 OK
- Body:
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "uuid-string",
        "title": "Task title",
        "description": "Task description (optional)",
        "completed": false,
        "created_at": "2023-01-01T00:00:00Z",
        "updated_at": "2023-01-01T00:00:00Z"
      }
    ],
    "total_count": 10,
    "limit": 50,
    "offset": 0
  }
}
```

**Error Cases**:
- 401 Unauthorized: Invalid or missing JWT token
- 422 Unprocessable Entity: Invalid query parameters

#### POST /api/v1/tasks
**Purpose**: Create a new task for the authenticated user

**Headers**:
- `Authorization: Bearer <jwt_token>` (required)

**Request Body**:
```json
{
  "title": "Task title (required)",
  "description": "Task description (optional)",
  "completed": false
}
```

**Validation**:
- `title` must be 1-255 characters
- `description` must be 0-1000 characters if provided
- `completed` defaults to false if not provided

**Response**:
- Status: 201 Created
- Body:
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "title": "Task title",
    "description": "Task description (optional)",
    "completed": false,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  },
  "message": "Task created successfully"
}
```

**Error Cases**:
- 400 Bad Request: Invalid request body format
- 401 Unauthorized: Invalid or missing JWT token
- 422 Unprocessable Entity: Validation errors

#### GET /api/v1/tasks/{task_id}
**Purpose**: Retrieve a specific task for the authenticated user

**Headers**:
- `Authorization: Bearer <jwt_token>` (required)

**Path Parameters**:
- `task_id`: UUID string of the task to retrieve

**Response**:
- Status: 200 OK
- Body:
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "title": "Task title",
    "description": "Task description (optional)",
    "completed": false,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}
```

**Error Cases**:
- 401 Unauthorized: Invalid or missing JWT token
- 403 Forbidden: Task does not belong to authenticated user
- 404 Not Found: Task with given ID does not exist
- 422 Unprocessable Entity: Invalid task_id format

#### PUT /api/v1/tasks/{task_id}
**Purpose**: Update a specific task for the authenticated user

**Headers**:
- `Authorization: Bearer <jwt_token>` (required)

**Path Parameters**:
- `task_id`: UUID string of the task to update

**Request Body**:
```json
{
  "title": "Updated task title (optional)",
  "description": "Updated task description (optional)",
  "completed": true
}
```

**Validation**:
- At least one field must be provided
- `title` must be 1-255 characters if provided
- `description` must be 0-1000 characters if provided

**Response**:
- Status: 200 OK
- Body:
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "title": "Updated task title",
    "description": "Updated task description",
    "completed": true,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-02T00:00:00Z"
  },
  "message": "Task updated successfully"
}
```

**Error Cases**:
- 400 Bad Request: Invalid request body format
- 401 Unauthorized: Invalid or missing JWT token
- 403 Forbidden: Task does not belong to authenticated user
- 404 Not Found: Task with given ID does not exist
- 422 Unprocessable Entity: Validation errors or invalid task_id format

#### DELETE /api/v1/tasks/{task_id}
**Purpose**: Delete a specific task for the authenticated user

**Headers**:
- `Authorization: Bearer <jwt_token>` (required)

**Path Parameters**:
- `task_id`: UUID string of the task to delete

**Response**:
- Status: 200 OK
- Body:
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Cases**:
- 401 Unauthorized: Invalid or missing JWT token
- 403 Forbidden: Task does not belong to authenticated user
- 404 Not Found: Task with given ID does not exist
- 422 Unprocessable Entity: Invalid task_id format

#### PATCH /api/v1/tasks/{task_id}/toggle-completion
**Purpose**: Toggle the completion status of a specific task for the authenticated user

**Headers**:
- `Authorization: Bearer <jwt_token>` (required)

**Path Parameters**:
- `task_id`: UUID string of the task to update

**Request Body**: Empty

**Response**:
- Status: 200 OK
- Body:
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "title": "Task title",
    "description": "Task description (optional)",
    "completed": true,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-02T00:00:00Z"
  },
  "message": "Task completion status updated"
}
```

**Error Cases**:
- 401 Unauthorized: Invalid or missing JWT token
- 403 Forbidden: Task does not belong to authenticated user
- 404 Not Found: Task with given ID does not exist
- 422 Unprocessable Entity: Invalid task_id format

### Health Check

#### GET /api/v1/health
**Purpose**: Check the health status of the API

**Headers**: None required

**Response**:
- Status: 200 OK
- Body:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2023-01-01T00:00:00Z"
  }
}
```

**Error Cases**:
- 503 Service Unavailable: API is unhealthy