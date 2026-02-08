# Todo Full-Stack Web Application - UI Pages

## Page Structure

### 1. Login Page (/login)
**Purpose**: Allow existing users to authenticate
**Components**:
- Email input field
- Password input field
- Submit button
- Link to signup page
- Forgot password link (future enhancement)

**Navigation Flow**:
- From login page → Dashboard (on successful login)
- From login page → Signup page (via link)

**User Interaction Flows**:
- **Login flow**: User enters email → enters password → clicks submit → validates credentials → redirects to dashboard on success
- **Forgot password flow**: User clicks forgot password link → navigates to password reset page (future enhancement)

**States**:
- **Empty state**: Default form with empty fields and placeholders
- **Loading state**: Loading spinner appears on submit button while authenticating
- **Error state**: Error message displays below form on failed authentication with field-specific errors if validation fails

### 2. Signup Page (/signup)
**Purpose**: Allow new users to create accounts
**Components**:
- First name input field
- Last name input field
- Email input field
- Password input field
- Confirm password input field
- Submit button
- Link to login page

**Navigation Flow**:
- From signup page → Dashboard (on successful registration)
- From signup page → Login page (via link)

**User Interaction Flows**:
- **Registration flow**: User enters name → enters email → creates password → confirms password → clicks submit → validates information → creates account → redirects to dashboard
- **Validation flow**: Real-time validation shows password strength and confirms password matches

**States**:
- **Empty state**: Default form with empty fields and placeholders
- **Loading state**: Loading spinner appears on submit button while registering
- **Error state**: Error messages display below form for validation errors, server errors, or duplicate email

### 3. Dashboard Page (/dashboard)
**Purpose**: Main application page showing user's tasks
**Components**:
- Navigation header with user menu and logout button
- Task creation form (title and description inputs)
- Task list displaying all user's tasks
- Filtering controls (show all/completed/pending)
- Task counter showing total and completed tasks

**Navigation Flow**:
- From dashboard → Login (when session expires)
- From dashboard → Individual task details (future enhancement)

**User Interaction Flows**:
- **Create task flow**: User enters task title → adds description (optional) → clicks submit → task appears in list with pending status
- **Edit task flow**: User clicks edit button → inline editor appears → user modifies content → saves changes
- **Complete task flow**: User clicks completion checkbox → task is marked complete with strikethrough
- **Delete task flow**: User clicks delete button → confirmation modal appears → user confirms deletion → task is removed from list
- **Filter flow**: User clicks filter buttons → task list updates to show filtered results

**States**:
- **Empty state**: Welcome message with instructions and prominent "Add your first task" button when user has no tasks
- **Loading state**: Skeleton loader appears when fetching tasks from server
- **Error state**: Error message displays with retry button if task fetch fails
- **Loading state (actions)**: Small loading indicators appear during task operations (create, update, delete, toggle)

### 4. Task Details Page (/tasks/[id])
**Purpose**: Show detailed view of a specific task
**Components**:
- Back to dashboard link
- Task title and description
- Completion status toggle
- Edit/delete buttons
- Task metadata (created/updated timestamps)

**Navigation Flow**:
- From dashboard → Task details
- From task details → Dashboard (via back button)

**User Interaction Flows**:
- **View details flow**: User navigates from dashboard → task details load → full task information displays
- **Edit flow**: User clicks edit button → navigation to dashboard with task in edit mode
- **Toggle completion**: User clicks completion toggle → status updates in real-time

**States**:
- **Empty state**: Loading state while fetching specific task
- **Loading state**: Skeleton loader appears when fetching task details
- **Error state**: Error message with back to dashboard link if task fetch fails

### 5. 404 Error Page (/404)
**Purpose**: Handle invalid routes
**Components**:
- Error message
- Link back to dashboard
- Link to home page

**States**:
- **Error state**: Clear error message with navigation options to return to valid parts of application

## Navigation Flow

### Authentication Flow
1. User accesses any page
2. If unauthenticated and not on login/signup → redirect to login
3. If on login/signup page → show auth forms
4. On successful auth → redirect to dashboard

### Auth-Protected Routes Behavior
- Unauthenticated users attempting to access protected routes are redirected to login page with return URL stored
- Protected routes show loading state while checking authentication status
- Expired sessions redirect to login with appropriate error message
- Protected routes display access denied error if user lacks permissions

### Main Application Flow
1. User logs in → lands on dashboard
2. User creates tasks via form on dashboard
3. User views tasks in list format
4. User can edit, delete, or toggle completion status
5. User can log out from navigation menu

### Responsive Behavior
- Mobile: Single-column layout with collapsible navigation
- Tablet: Optimized two-column layout
- Desktop: Full-width multi-column layout

## Page Transitions
- Smooth transitions between pages
- Loading states during API calls
- Error states for failed operations
- Success confirmations for completed actions