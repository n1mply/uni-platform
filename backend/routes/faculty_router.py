from database.read import get_faculties_by_department_id
from security.token import auth_required
from db import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException, Path, Request


faculty_router = APIRouter(prefix='/faculty', tags=['Faculties'])


@faculty_router.get("/get/relations/department/{department_id}")
@auth_required
async def get_faculties_for_department(
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    department_id: int = Path(...)
):
    """Возвращает все факультеты по id кафедры."""
    faculties = await get_faculties_by_department_id(session, department_id)
    if not faculties:
        raise HTTPException(status_code=404, detail="Кафедра не найдена или не привязана к факультетам")
    return faculties

