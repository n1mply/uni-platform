from database.read import get_departents_by_id, get_departments_by_faculty_id
from security.token import auth_required
from db import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException, Path, Request


department_router = APIRouter(prefix='/department', tags=['Departments'])


@department_router.get('/get/all')
@auth_required
async def get_departments(    
    request: Request,
    session: AsyncSession = Depends(get_async_session)):
    try:
        token_payload = request.state.token_payload
        u_id = token_payload['university_id']
        
        departments = await get_departents_by_id(id=u_id, session=session)
        return {'data': departments}
    except Exception as e:
        raise HTTPException(status_code=500)
    
    
@department_router.get("/get/relations/faculty/{faculty_id}")
@auth_required
async def get_departments_for_faculty(
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    faculty_id: int = Path(...)
):
    """Возвращает все кафедры по id факультета. Вернёт первый факультет, если их несколько"""
    departments = await get_departments_by_faculty_id(session, faculty_id)
    if not departments:
        raise HTTPException(status_code=404, detail="Факультет не найден или не имеет кафедр")
    return {"data": departments[0]}
    
