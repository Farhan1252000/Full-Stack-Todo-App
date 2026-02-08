# Todo Full-Stack Web Application - Architecture

## System Architecture Overview
The application follows a classic three-tier architecture:
- **Frontend Layer**: Next.js application serving the user interface
- **Backend Layer**: FastAPI providing REST API endpoints
- **Database Layer**: Neon PostgreSQL storing user and task data

## Frontend-Backend-Database Flow
1. Next.js frontend makes HTTP requests to FastAPI backend
2. FastAPI authenticates requests using JWT tokens from Better Auth
3. Backend queries PostgreSQL database using async drivers
4. Database returns data to backend
5. Backend responds to frontend with JSON data

## JWT Authentication Flow with Better Auth
1. User visits login/signup page
2. Better Auth handles credential validation
3. JWT token issued upon successful authentication
4. Token stored in browser (HTTP-only cookie or localStorage)
5. Subsequent requests include Authorization header with Bearer token
6. FastAPI validates token on protected endpoints
7. Token expiration triggers re-authentication

## Agent Responsibilities Mapping
- **Spec Agent**: Creates all specification documents
- **UI Agent**: Implements Next.js frontend components and pages
- **API Agent**: Develops FastAPI endpoints and business logic
- **Auth Agent**: Integrates Better Auth and manages JWT flows
- **DB Agent**: Sets up PostgreSQL schema and migrations
- **Integration Agent**: Connects all components and handles deployment