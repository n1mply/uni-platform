from fastapi import APIRouter, Depends, HTTPException, Path, Response, Request
from fastapi.responses import JSONResponse
from database.create import add_contact_by_id
from database.update import update_base_by_id
from services.media_service import delete_image, save_image
from schemas.update_university_schema import BasePutModel, BaseResponseModel
from schemas.university_schema import ContactModel
from database.read import get_contact_by_ids, get_contacts_by_id, get_university_data_by_id
from security.token import auth_required
from db import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession


uni_router = APIRouter(prefix='/university' ,tags=['University'])

@uni_router.get('/get/info')
@auth_required
async def get_full_university_info(
    request: Request,
    session: AsyncSession = Depends(get_async_session)
    ):
    token_payload = request.state.token_payload
    u_id = token_payload['university_id']
    
    data = await get_university_data_by_id(id=u_id, session=session)
    
    return {'data' : data}


@uni_router.put('/update/base')
@auth_required
async def update_base_info(
    request: Request,
    data: BasePutModel,
    session: AsyncSession = Depends(get_async_session)
):
    token_payload = request.state.token_payload
    u_id = token_payload['university_id']
    
    try:

        image_path = None
        banner_path = None
        
        if data.image:
            image_path = await save_image(
                b64=data.image.base64,
                folder="images",
                filename=f"avatar_{u_id}"
            )
        else:
            await delete_image(
                folder="images",
                filename=f"avatar_{u_id}"
                )
        
        if data.banner:
            banner_path = await save_image(
                b64=data.banner.base64,
                folder="banners",
                filename=f"banner_{u_id}"
            )
        else:
            await delete_image(
                folder="banners",
                filename=f"banner_{u_id}"
                )
        
        db_data = BaseResponseModel(
            fullName=data.fullName,
            shortName=data.shortName,
            address=data.address,
            description=data.description,
            image=image_path,
            banner=banner_path
        )
        
        university = await update_base_by_id(session, u_id, db_data)

        
        return JSONResponse(
            content={"status": "success"},
            headers={
                "Cache-Control": "no-store"
        }
    )
        
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка: {str(e)}"
        )
        
        
