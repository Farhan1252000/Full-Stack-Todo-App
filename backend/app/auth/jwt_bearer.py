from fastapi import HTTPException, status, Request, Depends
from app.auth.jwt_handler import verify_token


class JWTBearer:
    def __init__(self, auto_error: bool = True):
        self.auto_error = auto_error

    async def __call__(self, request: Request):
        # Extract the token from the Authorization header
        authorization_header = request.headers.get("Authorization")
        
        if not authorization_header:
            if self.auto_error:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authorization header is missing"
                )
            else:
                return None
        
        # Check if the header follows the Bearer scheme
        try:
            scheme, token = authorization_header.split(" ")
            if scheme.lower() != "bearer":
                if self.auto_error:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Authorization scheme must be Bearer"
                    )
                else:
                    return None
        except ValueError:
            if self.auto_error:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authorization header must follow 'Bearer' scheme"
                )
            else:
                return None
        
        # Verify the token
        try:
            payload = verify_token(token)
            # Add the user info to the request state for later use
            request.state.user = payload
            return token
        except HTTPException:
            # Re-raise the HTTPException if verification fails
            raise
        except Exception as e:
            if self.auto_error:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Could not validate credentials: {str(e)}"
                )
            else:
                return None