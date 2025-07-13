from fastapi import APIRouter, Depends, HTTPException, Response, Request
from database.read import get_university_data_by_id
from models.university import University
from security.token import auth_required
from db import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession


uni_router = APIRouter(prefix='/university' ,tags=['University'])

@uni_router.get('/info')
@auth_required
async def get_full_university_info(
    request: Request,
    session: AsyncSession = Depends(get_async_session)
    ):
    token_payload = request.state.token_payload
    u_id = token_payload['university_id']
    
    data = await get_university_data_by_id(id=u_id, session=session)
    
    return {'data' : data}