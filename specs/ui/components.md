# Todo Full-Stack Web Application - UI Components

## Reusable UI Components

### 1. Task List Component
**Location**: components/task-list.tsx
**Purpose**: Display a list of tasks with filtering capabilities
**Props**:
- `tasks`: Array<Task> - list of tasks to display
- `onToggleComplete`: Function - callback for completion toggle
- `onEdit`: Function - callback for edit action
- `onDelete`: Function - callback for delete action
- `filter`: 'all' | 'completed' | 'pending' - filter criteria

**Features**:
- Displays tasks in chronological order (newest first)
- Shows completion status with visual indicator
- Handles empty state with helpful message and call-to-action
- Responsive grid/list layout
- Loading and error states
- Smooth animations for task updates
- Pagination/infinite scroll for large task lists

### 2. Task Form Component
**Location**: components/task-form.tsx
**Purpose**: Create or edit tasks
**Props**:
- `initialData`: Partial<Task> - initial form values (optional)
- `onSubmit`: Function - callback for form submission
- `submitText`: string - text for submit button
- `isLoading`: boolean - loading state indicator

**Features**:
- Title input with character limits and validation
- Description textarea with expandable height
- Form validation and error display with clear messaging
- Loading state during submission with disabled inputs
- Cancel button for edit mode
- Auto-save functionality with visual indicators
- Keyboard shortcuts for form submission (Enter key)

### 3. Task Item Component
**Location**: components/task-item.tsx
**Purpose**: Display individual task with action buttons
**Props**:
- `task`: Task - task data to display
- `onToggleComplete`: Function - toggle completion handler
- `onEdit`: Function - edit handler
- `onDelete`: Function - delete handler

**Features**:
- Title display with strikethrough for completed tasks
- Description preview with truncation and expand option
- Completion checkbox with smooth transition animation
- Action buttons (edit, delete) with hover effects
- Timestamp display with relative time formatting
- Drag-and-drop support for task reordering
- Context menu with additional actions on mobile

### 4. Auth Form Component
**Location**: components/auth-form.tsx
**Purpose**: Handle login and signup forms
**Props**:
- `type`: 'login' | 'signup' - form variant
- `onSubmit`: Function - form submission handler
- `isLoading`: boolean - loading state
- `error`: string - error message to display

**Features**:
- Email input with real-time validation
- Password input with strength indicator and show/hide toggle
- Confirm password for signup with real-time match validation
- Form validation and error display with specific, actionable messages
- Loading state during submission with disabled form
- Social login buttons (future enhancement)
- Password requirements checklist
- Accessible labels and ARIA attributes

### 5. Navigation Header Component
**Location**: components/navigation-header.tsx
**Purpose**: Consistent header across authenticated pages
**Props**:
- `user`: User - current user data
- `onLogout`: Function - logout handler

**Features**:
- App logo/title with link to dashboard
- User profile dropdown with avatar and name
- Logout button with confirmation option
- Responsive hamburger menu for mobile with slide-in animation
- Active page highlighting in navigation
- Notification badge for upcoming features
- Search functionality (future enhancement)

### 6. Button Component
**Location**: components/button.tsx
**Purpose**: Consistent button styling across application
**Props**:
- `variant`: 'primary' | 'secondary' | 'danger' | 'outline' - style variant
- `size`: 'sm' | 'md' | 'lg' - size variant
- `disabled`: boolean - disabled state
- `loading`: boolean - loading state
- `icon`: ReactNode - optional icon to display
- `children`: ReactNode - button content
- `onClick`: Function - click handler

**Features**:
- Consistent styling based on variant
- Loading state with spinner animation
- Disabled state styling with reduced opacity
- Icon support for visual enhancement
- Keyboard accessibility (Tab navigation, Enter/Space activation)
- Focus ring for accessibility compliance
- Smooth hover and active state transitions

### 7. Input Field Component
**Location**: components/input-field.tsx
**Purpose**: Consistent input styling with validation
**Props**:
- `type`: string - input type
- `label`: string - field label
- `placeholder`: string - placeholder text
- `value`: string - current value
- `onChange`: Function - change handler
- `error`: string - error message
- `required`: boolean - required indicator
- `helperText`: string - additional helper text

**Features**:
- Floating label animation
- Error message display below input
- Helper text for additional context
- Required field indicator
- Consistent styling across all input types
- Accessibility attributes (aria-invalid, aria-describedby)
- Auto-focus capability
- Character counter for text areas

### 8. Modal Component
**Location**: components/modal.tsx
**Purpose**: Overlay dialogs for confirmations and forms
**Props**:
- `isOpen`: boolean - visibility state
- `onClose`: Function - close handler
- `title`: string - modal title
- `children`: ReactNode - modal content
- `size`: 'sm' | 'md' | 'lg' - modal size

**Features**:
- Semi-transparent backdrop with blur effect
- Close button and ESC key support
- Click-outside-to-close functionality
- Centered positioning with vertical centering
- Focus trapping for accessibility
- Smooth entrance and exit animations
- Responsive sizing on different screen sizes
- Scrollable content area for long content

### 9. Loading Spinner Component
**Location**: components/loading-spinner.tsx
**Purpose**: Visual indicator for loading states
**Props**:
- `size`: 'sm' | 'md' | 'lg' - size variant
- `fullScreen`: boolean - full screen overlay option
- `message`: string - optional loading message

**Features**:
- Animated circular spinner with smooth rotation
- Multiple size variants for different contexts
- Optional full-screen overlay mode
- Accessible with ARIA live region
- Optional loading message for user feedback
- Color theming to match application palette

### 10. Alert/Toast Component
**Location**: components/alert.tsx
**Purpose**: Display success, error, and info messages
**Props**:
- `type`: 'success' | 'error' | 'info' | 'warning' - alert type
- `message`: string - alert message
- `isVisible`: boolean - visibility state
- `onDismiss`: Function - dismiss handler
- `duration`: number - auto-dismiss duration (0 = no auto-dismiss)

**Features**:
- Color-coded backgrounds and icons based on type
- Auto-dismiss functionality with configurable duration
- Manual dismiss option with close button
- Accessibility attributes for screen readers
- Slide-in/slide-out animations
- Stacking capability for multiple alerts
- Positioning options (top-right, bottom-center, etc.)

### 11. Empty State Component
**Location**: components/empty-state.tsx
**Purpose**: Display meaningful content when data is absent
**Props**:
- `title`: string - main heading
- `message`: string - descriptive message
- `icon`: ReactNode - visual representation
- `actionButtonLabel`: string - optional call-to-action button
- `onActionClick`: Function - optional action handler

**Features**:
- Clear, encouraging messaging for empty scenarios
- Relevant icon or illustration
- Primary call-to-action button for immediate next step
- Consistent styling across the application
- Accessibility considerations for screen readers
- Responsive layout for all screen sizes

### 12. Filter Controls Component
**Location**: components/filter-controls.tsx
**Purpose**: Allow users to filter tasks by various criteria
**Props**:
- `currentFilter`: 'all' | 'completed' | 'pending' - active filter
- `onFilterChange`: Function - filter selection handler

**Features**:
- Tab-style interface for filter selection
- Clear visual indication of active filter
- Responsive layout that adapts to mobile
- Keyboard navigable filter options
- ARIA attributes for accessibility
- Smooth transitions between filter states