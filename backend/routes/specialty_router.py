from fastapi import APIRouter, Depends, HTTPException, Response, Request
from database.create import add_specialty_by_id
from db import get_async_session
from security.token import auth_required
from sqlalchemy.ext.asyncio import AsyncSession
from database.read import get_specs_by_id
from schemas.update_university_schema import SpecialtyPOSTModel
from services.media_service import parse_desc_object

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
        # Создаем глубокую копию данных
        data_dict = data.model_dump()
        
        # Обрабатываем description_data если он существует
        if data_dict.get('description_data'):
            data_dict['description_data'] = await parse_desc_object(data_dict['description_data'])
        
        # Создаем новую модель с обработанными данными
        processed_data = SpecialtyPOSTModel(**data_dict)
        
        spec = await add_specialty_by_id(id=u_id, data=processed_data, session=session)
        
        if spec:
            return {'status': 'success'}
        else:
            raise HTTPException(status_code=400)
    except Exception as e:
        # Добавим логирование для отладки
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
    