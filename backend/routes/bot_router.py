from fastapi import APIRouter, Depends, HTTPException
from db import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from services.request_service import approve_request_service, reject_request_service

bot_router = APIRouter(prefix='/bot', tags=['Bot'])

@bot_router.post("/approve/{request_id}")
async def approve_request_route(
    request_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    try:
        request = await approve_request_service(request_id, session)
        return {"message": f"ВУЗ {request.data['baseInfo']['shortName']} создан!"}
    except Exception as e:
        raise HTTPException(400, str(e))

@bot_router.post("/reject/{request_id}")
async def reject_request_route(
    request_id: int,
    session: AsyncSession = Depends(get_async_session)
):
    try:
        request = await reject_request_service(request_id, session)
        return {"message": f"Заявка {request_id} отклонена"}
    except Exception as e:
        raise HTTPException(400, str(e))