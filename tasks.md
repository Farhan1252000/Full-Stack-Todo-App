# Tasks: Todo Full-Stack Web Application

**Input**: Design documents from `/specs/features/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure with backend and frontend directories
- [x] T002 Initialize Next.js frontend project in frontend/ directory
- [x] T003 Initialize FastAPI backend project in backend/ directory
- [x] T004 [P] Configure linting and formatting tools for both frontend and backend

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Setup PostgreSQL database schema and migrations framework in backend/
- [x] T006 [P] Integrate Better Auth for authentication in frontend/
- [x] T007 [P] Setup database connection and ORM in backend/src/db/
- [x] T008 Create base models/entities that all stories depend on in backend/src/models/
- [x] T009 Configure error handling and logging infrastructure in backend/src/utils/
- [x] T010 Setup environment configuration management in both frontend and backend
- [x] T011 [P] Configure API endpoints structure in backend/src/api/
- [x] T012 [P] Setup JWT authentication middleware in backend/src/middleware/

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 6 - Authentication (Priority: P0) 🎯 Critical Prereq

**Goal**: Implement user registration, login, and logout functionality with Better Auth

**Independent Test**: User can register a new account, log in with credentials, and securely log out

### Tests for User Story 6 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T013 [P] [US6] Contract test for authentication endpoints in backend/tests/contract/test_auth.py
- [ ] T014 [P] [US6] Integration test for registration/login flow in backend/tests/integration/test_auth_flow.py

### Implementation for User Story 6

- [x] T015 [P] [US6] Create User model in backend/src/models/user.py
- [x] T016 [US6] Implement AuthService in backend/src/services/auth_service.py
- [x] T017 [US6] Implement authentication endpoints in backend/src/api/auth.py
- [x] T018 [US6] Create AuthForm component in frontend/src/components/auth-form.tsx
- [x] T019 [US6] Create Login page in frontend/src/pages/login.tsx
- [x] T020 [US6] Create Signup page in frontend/src/pages/signup.tsx
- [x] T021 [US6] Create NavigationHeader component in frontend/src/components/navigation-header.tsx
- [x] T022 [US6] Implement session management with Better Auth in frontend/

**Checkpoint**: Authentication system should be fully functional and integrated

---

## Phase 4: User Story 1 - Create New Tasks (Priority: P1) 🎯 MVP

**Goal**: Enable authenticated users to create new todo tasks with proper validation

**Independent Test**: User can log in, navigate to dashboard, enter task title and description, submit form, and see the new task appear in the task list

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T023 [P] [US1] Contract test for POST /tasks endpoint in backend/tests/contract/test_tasks_crud.py
- [ ] T024 [P] [US1] Integration test for task creation flow in backend/tests/integration/test_task_creation.py

### Implementation for User Story 1

- [x] T025 [P] [US1] Create Task model in backend/src/models/task.py
- [x] T026 [US1] Implement TaskService in backend/src/services/task_service.py (depends on T025)
- [x] T027 [US1] Implement POST /tasks endpoint in backend/src/api/tasks.py
- [x] T028 [US1] Create TaskForm component in frontend/src/components/task-form.tsx
- [x] T029 [US1] Add task creation functionality to Dashboard page in frontend/src/pages/dashboard.tsx
- [x] T030 [US1] Add validation and error handling for task creation
- [x] T031 [US1] Add success feedback for task creation

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 5: User Story 2 - Read Tasks (Priority: P2)

**Goal**: Enable authenticated users to view their own todo tasks with proper filtering and pagination

**Independent Test**: User can log in, navigate to dashboard, and see their list of tasks with proper multi-user isolation

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T032 [P] [US2] Contract test for GET /tasks endpoint in backend/tests/contract/test_tasks_read.py
- [ ] T033 [P] [US2] Integration test for task listing flow in backend/tests/integration/test_task_listing.py

### Implementation for User Story 2

- [x] T034 [P] [US2] Enhance Task model with user relationship in backend/src/models/task.py
- [x] T035 [US2] Implement TaskService methods for reading user tasks in backend/src/services/task_service.py
- [x] T036 [US2] Implement GET /tasks endpoint in backend/src/api/tasks.py
- [x] T037 [US2] Create TaskList component in frontend/src/components/task-list.tsx
- [x] T038 [US2] Create TaskItem component in frontend/src/components/task-item.tsx
- [x] T039 [US2] Integrate task listing with Dashboard page in frontend/src/pages/dashboard.tsx
- [x] T040 [US2] Add filtering and pagination to task list

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 6: User Story 3 - Update Tasks (Priority: P3)

**Goal**: Enable authenticated users to modify their existing todo tasks

**Independent Test**: User can edit an existing task's title or description and see the changes saved and reflected in the UI

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚟️

- [ ] T041 [P] [US3] Contract test for PUT /tasks/{task_id} endpoint in backend/tests/contract/test_tasks_update.py
- [ ] T042 [P] [US3] Integration test for task update flow in backend/tests/integration/test_task_update.py

### Implementation for User Story 3

- [x] T043 [P] [US3] Enhance TaskService with update methods in backend/src/services/task_service.py
- [x] T044 [US3] Implement PUT /tasks/{task_id} endpoint in backend/src/api/tasks.py
- [x] T045 [US3] Add edit functionality to TaskItem component in frontend/src/components/task-item.tsx
- [x] T046 [US3] Update TaskForm component to support editing in frontend/src/components/task-form.tsx
- [x] T047 [US3] Add update task functionality to Dashboard page in frontend/src/pages/dashboard.tsx

**Checkpoint**: User Stories 1, 2, and 3 should now be independently functional

---

## Phase 7: User Story 4 - Delete Tasks (Priority: P4)

**Goal**: Enable authenticated users to remove their todo tasks with confirmation

**Independent Test**: User can select a task for deletion, confirm the action, and see the task removed from the list

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚟️

- [ ] T048 [P] [US4] Contract test for DELETE /tasks/{task_id} endpoint in backend/tests/contract/test_tasks_delete.py
- [ ] T049 [P] [US4] Integration test for task deletion flow in backend/tests/integration/test_task_deletion.py

### Implementation for User Story 4

- [x] T050 [P] [US4] Enhance TaskService with delete methods in backend/src/services/task_service.py
- [x] T051 [US4] Implement DELETE /tasks/{task_id} endpoint in backend/src/api/tasks.py
- [x] T052 [US4] Add delete functionality to TaskItem component in frontend/src/components/task-item.tsx
- [x] T053 [US4] Create Modal component for confirmation dialog in frontend/src/components/modal.tsx
- [x] T054 [US4] Add delete task functionality to Dashboard page in frontend/src/pages/dashboard.tsx

**Checkpoint**: User Stories 1, 2, 3, and 4 should now be independently functional

---

## Phase 8: User Story 5 - Toggle Task Completion (Priority: P5)

**Goal**: Enable authenticated users to mark tasks as completed/incomplete with visual feedback

**Independent Test**: User can toggle a task's completion status and see the visual change reflected immediately

### Tests for User Story 5 (OPTIONAL - only if tests requested) ⚟️

- [ ] T055 [P] [US5] Contract test for PATCH /tasks/{task_id}/toggle endpoint in backend/tests/contract/test_tasks_toggle.py
- [ ] T056 [P] [US5] Integration test for task toggle flow in backend/tests/integration/test_task_toggle.py

### Implementation for User Story 5

- [x] T057 [P] [US5] Enhance TaskService with toggle completion methods in backend/src/services/task_service.py
- [x] T058 [US5] Implement PATCH /tasks/{task_id}/toggle endpoint in backend/src/api/tasks.py
- [x] T059 [US5] Add completion toggle functionality to TaskItem component in frontend/src/components/task-item.tsx
- [x] T060 [US5] Add visual indicators for completed tasks in frontend/src/components/task-item.tsx
- [x] T061 [US5] Update Dashboard page to reflect completion status changes in frontend/src/pages/dashboard.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T062 [P] Documentation updates in docs/
- [ ] T063 Create UI components as specified in specs/ui/components.md
- [ ] T064 Add responsive design to all pages
- [ ] T065 [P] Additional unit tests in backend/tests/unit/ and frontend/tests/
- [ ] T066 Security hardening and validation
- [ ] T067 Performance optimization across all features
- [ ] T068 Final integration testing
- [ ] T069 Deploy and validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 6 (P0)**: Authentication - Prerequisite for all other stories, must be implemented first
- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - May integrate with previous stories but should be independently testable
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - May integrate with previous stories but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for POST /tasks endpoint in backend/tests/contract/test_tasks_crud.py"
Task: "Integration test for task creation flow in backend/tests/integration/test_task_creation.py"

# Launch all models for User Story 1 together:
Task: "Create Task model in backend/src/models/task.py"
```

---

## Implementation Strategy

### MVP First (Authentication + User Story 1)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 6 (Authentication - Priority P0)
4. Complete Phase 4: User Story 1 (Basic task creation)
5. **STOP and VALIDATE**: Test Authentication + Task Creation independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add Authentication → Test independently → Deploy/Demo
3. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
4. Add User Story 2 → Test independently → Deploy/Demo
5. Add User Story 3 → Test independently → Deploy/Demo
6. Add User Story 4 → Test independently → Deploy/Demo
7. Add User Story 5 → Test independently → Deploy/Demo
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: Authentication (US6)
   - Developer B: User Story 1
   - Developer C: User Story 2
   - Developer D: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence