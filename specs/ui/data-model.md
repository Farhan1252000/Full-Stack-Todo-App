# Data Model: Todo App Frontend

## Task Entity

**Fields**:
- `id: string` - Unique identifier for the task
- `title: string` - Title of the task (required, max 255 characters)
- `description: string` - Detailed description of the task (optional, max 1000 characters)
- `completed: boolean` - Completion status of the task (default: false)
- `createdAt: Date` - Timestamp when the task was created
- `updatedAt: Date` - Timestamp when the task was last updated
- `dueDate?: Date` - Optional due date for the task

**Validation Rules**:
- Title must be 1-255 characters
- Description, if provided, must be 1-1000 characters
- Completed defaults to false when creating new tasks
- createdAt and updatedAt are automatically managed

**State Transitions**:
- Pending → Completed (when user marks task as complete)
- Completed → Pending (when user unmarks task as complete)

## User Entity

**Fields**:
- `id: string` - Unique identifier for the user
- `email: string` - User's email address (required, unique)
- `firstName: string` - User's first name (required, max 100 characters)
- `lastName: string` - User's last name (required, max 100 characters)
- `createdAt: Date` - Timestamp when the account was created
- `lastLoginAt?: Date` - Timestamp of last login (optional)

**Validation Rules**:
- Email must be valid email format and unique
- firstName and lastName must be 1-100 characters
- Combined fullName (firstName + lastName) should be searchable

## Authentication State

**Fields**:
- `user: User | null` - Current authenticated user, null if not logged in
- `token: string | null` - Authentication token for API calls
- `isLoggedIn: boolean` - Computed property indicating authentication status
- `isLoading: boolean` - Whether auth status is currently being determined

**State Transitions**:
- Logged out → Authenticating (when login process starts)
- Authenticating → Logged in (when authentication succeeds)
- Authenticating → Error (when authentication fails)
- Logged in → Logging out (when logout process starts)
- Logging out → Logged out (when logout completes)

## Task Filter State

**Fields**:
- `status: 'all' | 'completed' | 'pending'` - Filter by completion status (default: 'all')
- `searchQuery: string` - Text search query for filtering (default: '')
- `sortBy: 'createdAt' | 'updatedAt' | 'dueDate' | 'title'` - Sort order for tasks (default: 'createdAt')
- `sortDirection: 'asc' | 'desc'` - Sort direction (default: 'desc')

## UI Loading States

**Types**:
- `GlobalLoading`: Boolean - Shows full-page loading spinner
- `TaskOperationLoading`: Object with task ID and operation type - Shows inline loading for specific task operations
- `FormLoading`: Boolean - Shows loading state for form submissions
- `InitialDataLoading`: Boolean - Shows skeleton loaders while initial data loads

## Error State

**Fields**:
- `message: string` - Human-readable error message
- `type: 'validation' | 'network' | 'server' | 'auth' | 'unknown'` - Category of error
- `field?: string` - Specific field that caused validation error (optional)
- `timestamp: Date` - When the error occurred