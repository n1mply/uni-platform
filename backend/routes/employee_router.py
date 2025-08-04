from database.read import get_employees_by_id, get_employee_heads_by_id, get_free_employees_by_id
from security.token import auth_required
from db import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException, Path, Request


employee_router = APIRouter(prefix='/employee', tags=['Employees'])


@employee_router.get('/get/all')
@auth_required
async def get_employees(    
    request: Request,
    session: AsyncSession = Depends(get_async_session)):
    try:
        token_payload = request.state.token_payload
        u_id = token_payload['university_id']
        
        employees = await get_employees_by_id(id=u_id, session=session)
        return {'data': employees}
    except Exception as e:
        raise HTTPException(status_code=500)
    
    
@employee_router.get('/get/heads')
@auth_required
async def get_employee_heads(    
    request: Request,
    session: AsyncSession = Depends(get_async_session)):
    try:
        token_payload = request.state.token_payload
        u_id = token_payload['university_id']
        
        employee_heads = await get_employee_heads_by_id(id=u_id, session=session)
        return {'data': employee_heads}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500)
    
    
@employee_router.get('/get/free')
@auth_required
async def get_free_employees(    
    request: Request,
    session: AsyncSession = Depends(get_async_session)):
    try:
        token_payload = request.state.token_payload
        u_id = token_payload['university_id']
        
        free_employees = await get_free_employees_by_id(id=u_id, session=session)
        return {'data': free_employees}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500)