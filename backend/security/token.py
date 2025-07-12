from fastapi import HTTPException, Request
from functools import wraps
from jose import JWTError, jwt

from core.config import settings

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

def auth_required(func):
    @wraps(func)
    async def wrapper(request: Request, *args, **kwargs):
        token = request.cookies.get("access_token")
        
        if not token:
            raise HTTPException(
                status_code=401,
                detail="Токен отсутствует в куках",
            )
        
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            if 'university_id' not in payload or 'university_tag' not in payload:
                raise JWTError("Missing required fields")
            
            request.state.token_payload = payload
            
        except Exception as e:
            raise HTTPException(
                status_code=403,
                detail=f"Невалидный токен",
            )
        
        return await func(request, *args, **kwargs)
    
    return wrapper