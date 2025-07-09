from fastapi import APIRouter, Depends, HTTPException
from database.create import create_university
from models.request import UniversityRequest
from db import get_async_session
from schemas.university_schema import UniversityModel
from sqlalchemy.ext.asyncio import AsyncSession
from models.university import University

bot_router = APIRouter(prefix='/bot', tags=['Bot'])


@bot_router.post("/bot/approve/{request_id}")
async def approve_request(
    request_id: int,
    university,
    session: AsyncSession = Depends(get_async_session)
):
    # 1. Достаём заявку
    request = await session.get(UniversityRequest, request_id)
    if not request:
        raise HTTPException(404, "Заявка не найдена")

    await create_university(data=university, session=session)

    # 3. Удаляем заявку
    await session.delete(request)
    await session.commit()

    return {"message": "ВУЗ создан!"}


@bot_router.post("/bot/reject/{request_id}")
async def reject_request(
    request_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    request = await session.get(UniversityRequest, request_id)
    if not request:
        raise HTTPException(404, "Заявка не найдена")

    # Просто удаляем заявку
    await session.delete(request)
    await session.commit()

    return {"message": "Заявка отклонена"}