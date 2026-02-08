# API Authentication Specification

## Overview
This document specifies the authentication mechanism for the Todo Full-Stack Web Application backend API. The system uses JWT (JSON Web Token) tokens issued by Better Auth for secure user authentication and authorization.

## Authentication Flow

### Token Verification
1. Every incoming request to `/api/*` routes must include a valid JWT token
2. The backend verifies the JWT signature using a shared secret from environment variables
3. The backend extracts user identity from the verified token payload
4. Access is granted only if the token is valid and not expired

### Token Extraction
- JWT tokens must be provided in the `Authorization` header using the Bearer scheme
- Format: `Authorization: Bearer <jwt_token>`
- The backend will reject requests without proper Authorization header with 401 status

## Required Environment Variables
- `JWT_SECRET_KEY`: Secret key for verifying JWT signatures
- `JWT_ALGORITHM`: Algorithm used for JWT verification (default: HS256)

## Authentication Enforcement

### Protected Routes
All routes under `/api/*` require valid authentication:
- `/api/v1/tasks/*`
- `/api/v1/health` (public route, no authentication required)

### Authorization Headers
- Header name: `Authorization`
- Expected format: `Bearer <token>`
- Multiple tokens or malformed headers result in 401 Unauthorized

### User Identity Resolution
- User identity is derived exclusively from the JWT token payload
- The backend does not rely on request body or URL parameters for user identification
- User ID is extracted from the `sub` (subject) claim in the JWT

### Cross-User Access Prevention
- All data queries are filtered by the authenticated user's ID
- Requests to access resources belonging to other users result in 403 Forbidden
- URL parameters containing user identifiers must match the authenticated user

## Error Responses

### 401 Unauthorized
Returned when:
- No Authorization header is present
- Authorization header is malformed
- JWT token is invalid, expired, or tampered
- JWT signature verification fails

Response body:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing authentication token"
  }
}
```

### 403 Forbidden
Returned when:
- User attempts to access resources belonging to another user
- User attempts to modify/delete resources they don't own

Response body:
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied: Insufficient permissions"
  }
}
```

## Token Validation Process

### Step 1: Header Parsing
- Extract Authorization header value
- Validate header format (Bearer <token>)
- Return 401 if format is invalid

### Step 2: JWT Decoding
- Decode JWT using the configured algorithm
- Verify signature using `JWT_SECRET_KEY`
- Return 401 if signature verification fails

### Step 3: Expiration Check
- Validate `exp` claim in JWT payload
- Return 401 if token is expired

### Step 4: User Identity Extraction
- Extract user ID from `sub` claim
- Optionally validate other claims as needed
- Attach user identity to request context

## Integration with Better Auth
- The backend expects JWT tokens issued by Better Auth
- Token structure follows Better Auth standards
- Claims include user identity information as provided by Better Auth
- The backend does not issue or refresh tokens - this is handled by Better Auth

## Security Considerations
- JWT tokens must be transmitted over HTTPS only
- Tokens should be stored securely on the client side
- Short expiration times recommended for enhanced security
- Proper CORS configuration to prevent unauthorized cross-origin requests