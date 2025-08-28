from fastapi import APIRouter, Depends, HTTPException, Response, Request
from database.create import add_specialty_by_id
from db import get_async_session
from security.token import auth_required
from sqlalchemy.ext.asyncio import AsyncSession
from database.read import get_specs_by_id
from schemas.update_university_schema import SpecialtyPOSTModel

spec_router = APIRouter(prefix='/specialty', tags=['Specialty'])

@spec_router.post('/create')
@auth_required
async def create_spec(    
    request: Request,
    data: SpecialtyPOSTModel,
    session: AsyncSession = Depends(get_async_session)
):
    token_payload = request.state.token_payload
    u_id = token_payload['university_id']
    
    try:
        spec = await add_specialty_by_id(id=u_id, data=data, session=session)
        
        if spec:
            return {'status':'success'}
        else:
            raise HTTPException(status_code=400)
    except Exception as e:
        raise HTTPException(status_code=500)


@spec_router.get('/get/all')
@auth_required
async def get_specs(
    request: Request,
    session: AsyncSession = Depends(get_async_session)):
    try:
        token_payload = request.state.token_payload
        u_id = token_payload['university_id']
        
        specs = await get_specs_by_id(id=u_id, session=session)
        return {'data': specs[::-1]}
    except Exception as e:
        raise HTTPException(status_code=500)
    