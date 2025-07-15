from models.request import UniversityRequest
from database.create import create_university
from sqlalchemy.ext.asyncio import AsyncSession

async def approve_request_service(
    request_id: int, 
    session: AsyncSession
):
    request = await session.get(UniversityRequest, request_id)
    if not request:
        raise Exception("Заявка не найдена")

    await create_university(data=request.data, session=session)
    await session.delete(request)
    await session.commit()
    return request

async def reject_request_service(
    request_id: int, 
    session: AsyncSession
):
    request = await session.get(UniversityRequest, request_id)
    if not request:
        raise Exception("Заявка не найдена")

    await session.delete(request)
    await session.commit()
    return request