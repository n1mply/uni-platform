from fastapi import APIRouter, Depends, HTTPException, Response, Request
from bot import send_university_request
from models.request import UniversityRequest
from db import get_async_session
from database.read import get_credentials_by_tag
from security.jwt import create_access_token, decode_access_token
from schemas.university_schema import UniversityModel
from schemas.university_signin_schema import UniSignIn
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.university import University

auth_router = APIRouter()

@auth_router.post('/auth/signup/university')
async def sign_up_university(
    university: UniversityModel,
    session: AsyncSession = Depends(get_async_session)
):
    request = UniversityRequest(data=university.baseInfo.model_dump())
    session.add(request)
    await session.commit()
    await send_university_request(university_data=university, request_id=request.id)
    return {"request_id": request.id}
    
    
@auth_router.post('/auth/signin/university')
async def sign_in_university(
    data: UniSignIn,
    response: Response,
    session: AsyncSession = Depends(get_async_session)
):
    try:
        creds = await get_credentials_by_tag(data.tag, data.password, session)

        token = create_access_token({
            "university_id": creds["university_id"],
            "university_tag": creds["university_tag"]
        })

        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            max_age=3600,
            samesite="lax",
            secure=False  # поставь True, если у тебя HTTPS
        )


        return {"message": "Авторизация успешна", "tag": creds["university_tag"]}
    except Exception as e:
        raise HTTPException(status_code=403, detail=str(e))
    
    


@auth_router.get("/auth/me")
async def get_current_university(
    request: Request,
    session: AsyncSession = Depends(get_async_session)
):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Нет токена")

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Неверный токен")

    university_id = payload.get("university_id")
    if not university_id:
        raise HTTPException(status_code=401, detail="Недопустимый payload")

    result = await session.execute(
        select(University).where(University.id == university_id)
    )
    university = result.scalar_one_or_none()

    if not university:
        raise HTTPException(status_code=404, detail="Университет не найден")

    return {
        "id": university.id,
        "tag": university.university_tag,
        "fullName": university.full_name,
        "shortName": university.short_name,
        "address": university.address,
        "image": university.image,
        "description": university.description
    }