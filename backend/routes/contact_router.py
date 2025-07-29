from fastapi import APIRouter, Depends, HTTPException, Path, Request
from database.create import add_contact_by_id
from schemas.university_schema import ContactModel
from database.read import get_contact_by_ids, get_contacts_by_id
from database.delete import delete_contact_by_ids
from security.token import auth_required
from db import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession


contact_router = APIRouter(prefix='/contact' ,tags=['Contacts'])

@contact_router.post('/create')
@auth_required
async def create_contact(    
    request: Request,
    data: ContactModel,
    session: AsyncSession = Depends(get_async_session)
):
    token_payload = request.state.token_payload
    u_id = token_payload['university_id']
    
    try:
        contact = await add_contact_by_id(id=u_id, data=data,session=session)
        
        if contact:
            return {'status':'success'}
        else:
            raise HTTPException(status_code=400)
    except Exception as e:
        raise HTTPException(status_code=500)
    
    
@contact_router.get('/get/all', tags=['Contacts'])
@auth_required
async def get_contacts(
    request: Request,
    session: AsyncSession = Depends(get_async_session)
    ):
    token_payload = request.state.token_payload
    u_id = token_payload['university_id']
    
    contacts = await get_contacts_by_id(id=u_id, session=session)
    
    return {'data' : contacts}


@contact_router.get('/get/{id}', tags=['Contacts'])
@auth_required
async def get_contact(
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    id: int  = Path(...),
):
    token_payload = request.state.token_payload
    university_id = token_payload['university_id']
    
    contact = await get_contact_by_ids(
        contact_id=id,
        university_id=university_id, 
        session=session
    )
    
    return {'data': contact}



@contact_router.get('/delete/{id}')
@auth_required
async def delete_contact(
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    id: int  = Path(...),
):
    token_payload = request.state.token_payload
    u_id = token_payload['university_id']
    
    try:
        deletion = await delete_contact_by_ids(u_id=u_id, c_id=id, session=session)
        if deletion:
            return {'status':'success'}
        else:
            raise HTTPException(status_code=400)
        
    except Exception as e:
        raise HTTPException(status_code=500)