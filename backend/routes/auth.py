from fastapi import APIRouter, Depends, HTTPException, Response, Request
from db import get_async_session
from database.read import get_credentials_by_tag
from security.jwt import create_access_token, decode_access_token
from schemas.university_schema import UniversityModel
from schemas.university_signin_schema import UniSignIn
from database.create import create_university
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.university import University
from bot import notify_about_university
import datetime

auth = APIRouter()

@auth.post('/auth/signup/university')
async def sign_up_university(
    university: UniversityModel, 
    request: Request,
):
    try:
        # Создаем университет
        uni = await create_university(university)
        
        # Формируем данные для уведомления
        university_data = {
            "full_name": university.baseInfo.fullName,
            "tag": university.baseInfo.universityTag,
            "email": next((c.value for c in university.baseInfo.contacts if c.type == "email"), ""),
            "address": university.baseInfo.address,
            "created_at": datetime.datetime.now().isoformat()
        }
        
        # Отправляем уведомление через бота
        bot = request.app.state.bot
        await notify_about_university(university_data)
        
        return {"status": "ok", "message": "Университет создан"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
@auth.post('/auth/signin/university')
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
    
    


@auth.get("/auth/me")
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