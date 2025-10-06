from fastapi import APIRouter, Depends, HTTPException, Path, Response, Request
from database.delete import delete_specialty_by_id
from database.create import add_specialty_by_id
from db import get_async_session
from security.token import auth_required
from sqlalchemy.ext.asyncio import AsyncSession
from database.read import get_free_specialties_by_id, get_specs_by_id
from schemas.update_university_schema import SpecialtyPOSTModel
from services.media_service import parse_desc_object
from database.update import update_specialty_by_id

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
        data_dict = data.model_dump()
        if data_dict.get('description_data'):
            data_dict['description_data'] = await parse_desc_object(data_dict['description_data'])
        
        processed_data = SpecialtyPOSTModel(**data_dict)
        spec = await add_specialty_by_id(id=u_id, data=processed_data, session=session)
        
        if spec:
            return {'status': 'success'}
        else:
            raise HTTPException(status_code=400)
    except Exception as e:
        print(f"Error in create_spec: {e}")
        raise HTTPException(status_code=500, detail=str(e))


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
    


@spec_router.put("/update/base/{specialty_id}")
@auth_required
async def update_department(
    request: Request,
    data: SpecialtyPOSTModel,
    session: AsyncSession = Depends(get_async_session),
    specialty_id: int = Path(...)
):
    token_payload = request.state.token_payload
    u_id = token_payload['university_id']
    data = await update_specialty_by_id(specialty_id=specialty_id ,session=session, university_id=u_id, update_data=data)
    if data:
        return {'status': 'ok'}
    

@spec_router.get("/delete/{specialty_id}")
@auth_required
async def delete_spec(
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    specialty_id: int = Path(...)
):
    token_payload = request.state.token_payload
    u_id = token_payload['university_id']
    data = await delete_specialty_by_id(university_id=u_id, specialty_id=specialty_id ,session=session)
    if data:
        return {'status': 'ok'}
    


@spec_router.get("/get/free")
@auth_required
async def get_free_specialties(
    request: Request,
    session: AsyncSession = Depends(get_async_session)):
    try:
        token_payload = request.state.token_payload
        u_id = token_payload['university_id']
        
        free_employees = await get_free_specialties_by_id(id=u_id, session=session)
        return {'data': free_employees}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500)
