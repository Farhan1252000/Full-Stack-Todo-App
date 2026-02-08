# Authentication Feature Specification

## Overview
This document specifies the authentication feature for the Todo Full-Stack Web Application backend. The feature implements JWT-based authentication using tokens issued by Better Auth to secure API endpoints and enforce user isolation.

## Feature Scope
The Authentication feature encompasses:
- JWT token verification
- User identity extraction from tokens
- Authorization enforcement on protected endpoints
- Cross-user access prevention
- Secure API access control

## Authentication Mechanism

### JWT-Based Authentication
- Uses JSON Web Tokens (JWT) for stateless authentication
- Tokens are issued by Better Auth service
- Backend verifies tokens using shared secret key
- No server-side session storage required

### Token Format
- Algorithm: HS256 (configurable via environment)
- Payload includes user identity claims
- Includes expiration time (exp) claim
- Signed with shared secret for integrity

## Authentication Enforcement

### Protected Endpoints
All endpoints under `/api/*` require valid authentication:
- `/api/v1/tasks/*` - Task management endpoints
- Any future `/api/*` endpoints

### Public Endpoints
Endpoints that do not require authentication:
- `/api/v1/health` - Health check endpoint
- Future public API endpoints (if any)

## User Identity Management

### Identity Source
- User identity derived solely from JWT token payload
- Extracted from `sub` (subject) claim in JWT
- No reliance on request body or URL parameters for user identification

### User Isolation
- All data access filtered by authenticated user ID
- Users cannot access resources belonging to other users
- Database queries always include user ID filter
- Authorization checks performed before data access

## Security Controls

### Token Validation
1. **Format Check**: Verify Authorization header format (Bearer <token>)
2. **Signature Verification**: Validate JWT signature using shared secret
3. **Expiration Check**: Ensure token hasn't expired
4. **Claim Validation**: Verify required claims exist

### Access Control
- **Authentication Check**: Verify valid JWT present
- **Authorization Check**: Ensure resource belongs to authenticated user
- **Permission Validation**: Confirm user has rights to perform action

## Error Handling

### Authentication Errors
- **Invalid Token Format**: Return 401 Unauthorized
- **Invalid Signature**: Return 401 Unauthorized
- **Expired Token**: Return 401 Unauthorized
- **Missing Token**: Return 401 Unauthorized

### Authorization Errors
- **Insufficient Permissions**: Return 403 Forbidden
- **Cross-User Access Attempt**: Return 403 Forbidden
- **Resource Not Owned**: Return 403 Forbidden

## Integration with Better Auth

### Token Compatibility
- Backend expects JWT tokens in Better Auth format
- Supports Better Auth's token structure and claims
- Compatible with Better Auth's signing mechanism
- Works with Better Auth's token refresh cycle

### User Data Mapping
- Maps Better Auth user IDs to backend operations
- Maintains consistency with Better Auth user identities
- Supports Better Auth's user management features

## Required Environment Variables
- `JWT_SECRET_KEY`: Secret key for JWT signature verification
- `JWT_ALGORITHM`: Algorithm used for JWT verification (default: HS256)
- `AUTH_JWT_SUBJECT_KEY`: JWT claim key for user ID (default: sub)

## Security Best Practices

### Token Transmission
- All JWT tokens transmitted over HTTPS only
- Client stores tokens securely (preferably in httpOnly cookies or secure storage)
- No tokens logged in server logs

### Token Storage
- Backend does not store JWT tokens (stateless authentication)
- Relies on token signature verification for authenticity
- No server-side token revocation mechanism (design limitation of JWT)

### Rate Limiting
- Implement rate limiting on authentication endpoints
- Prevent brute force attacks on token verification
- Consider account lockout mechanisms if needed

## Performance Considerations
- JWT verification should complete within 50ms
- Minimal impact on API response times
- Efficient token parsing and validation
- Caching of public keys if using asymmetric algorithms

## Compliance Requirements
- Follows industry-standard JWT authentication practices
- Compatible with OAuth 2.0 and OpenID Connect concepts
- Supports secure API access patterns
- Enables audit logging of authenticated actions