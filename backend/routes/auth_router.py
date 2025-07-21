from fastapi_cache.decorator import cache
from fastapi import APIRouter, Depends, HTTPException, Response, Request
from security.token import auth_required
from bot import send_university_request
from models.request import UniversityRequest
from db import get_async_session
from database.read import get_credentials_by_tag
from security.jwt import create_access_token
from schemas.university_schema import UniversityModel
from schemas.university_signin_schema import UniSignIn
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.university import University
from models.contact import Contact

auth_router = APIRouter(prefix='/auth' ,tags=['Auth'])

@auth_router.post('/signup/university')
async def sign_up_university(
    university: UniversityModel,
    session: AsyncSession = Depends(get_async_session)
):
    data = university.model_dump()
    if data:
        if data.get('createdAt'):
            data['createdAt'] = data['createdAt'].isoformat()
        if data.get('updatedAt'):
            data['updatedAt'] = data['updatedAt'].isoformat()
    
    request = UniversityRequest(data=data)
    session.add(request)
    await session.commit()
    await send_university_request(request_id=request.id)
    return {"request_id": request.id}
    
    
@auth_router.post('/signin/university')
async def sign_in_university(
    data: UniSignIn,
    response: Response,
    session: AsyncSession = Depends(get_async_session)
):
    try:
        creds = await get_credentials_by_tag(data.tag, data.password, session)

        token = create_access_token({
            "university_id": creds["university_id"],
            "university_tag": creds["university_tag"]
        })

        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            max_age=3600,
            samesite="lax",
            secure=False  # True
        )


        return {"message": "Авторизация успешна", "tag": creds["university_tag"]}
    except Exception as e:
        raise HTTPException(status_code=403, detail=str(e))
    
    


@auth_router.get("/me")
@auth_required
@cache(expire=300)
async def get_current_university(
    request: Request,
    session: AsyncSession = Depends(get_async_session)
):
    token_payload = request.state.token_payload

    # Получаем университет
    result = await session.execute(
        select(University).where(University.id == token_payload["university_id"])
    )
    university = result.scalar_one_or_none()
    
    if not university:
        raise HTTPException(status_code=404, detail="Университет не найден")

    # Получаем контакты университета
    result = await session.execute(
        select(Contact).where(Contact.university_id == token_payload["university_id"])
    )
    contacts = result.scalars().all()
    
    # Подготавливаем список контактов для ответа
    contacts_list = [
        {
            "name": c.name,
            "type": c.type.value,
            "value": c.value
        } for c in contacts
    ]

    return {
        "id": university.id,
        "tag": university.university_tag,
        "fullName": university.full_name,
        "shortName": university.short_name,
        "address": university.address,
        "image": university.image,
        "banner": university.banner,
        "description": university.description,
        'contacts': contacts_list
    }