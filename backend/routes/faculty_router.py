from database.update import update_faculty_by_id
from database.create import add_faculty_by_id
from services.media_service import delete_image, save_image
from schemas.update_university_schema import BaseFacultyModel, FacultyPOSTModel
from database.read import get_faculties_by_department_id, get_faculties_by_id
from security.token import auth_required
from db import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException, Path, Request


faculty_router = APIRouter(prefix='/faculty', tags=['Faculties'])

@faculty_router.post('/create')
@auth_required
async def create_faculty(    
    request: Request,
    data: FacultyPOSTModel,
    session: AsyncSession = Depends(get_async_session)
):
    token_payload = request.state.token_payload
    u_id = token_payload['university_id']
    
    try:
        icon_path = None
        if data.icon:
            icon_path = await save_image(
                b64=data.icon.base64,
                folder="icons",
                filename=f"icon_{u_id}"
            )
        else:
            await delete_image(
                folder="icons",
                filename=f"icon_{u_id}"
                )
            
        db_data=BaseFacultyModel(
            name=data.name,
            tag=data.tag,
            icon_path=icon_path
        )

        faculty = await add_faculty_by_id(id=u_id, data=db_data, session=session)
        if faculty:
            return {'status': 'success'}
        else:
            raise HTTPException(status_code=400)
        
    except Exception as e:
        print(f"Error in create_spec: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@faculty_router.get('/get/all')
@auth_required
async def get_faculties(
    request: Request,
    session: AsyncSession = Depends(get_async_session)):
    try:
        token_payload = request.state.token_payload
        u_id = token_payload['university_id']
        
        faculties = await get_faculties_by_id(id=u_id, session=session)
        return {'data': faculties[::-1]}
    except Exception as e:
        raise HTTPException(status_code=500)
    

@faculty_router.put("/update/base/{faculty_id}")
@auth_required
async def update_department(
    request: Request,
    data: FacultyPOSTModel,
    session: AsyncSession = Depends(get_async_session),
    faculty_id: int = Path(...)
):
    token_payload = request.state.token_payload
    u_id = token_payload['university_id']

    icon_path = None

    if data.icon:
        icon_path = await save_image(
            b64=data.icon.base64,
            folder="icons",
            filename=f"icon_{u_id}"
        )
    else:
        await delete_image(
            folder="icons",
            filename=f"icon_{u_id}"
        )
            
    db_data=BaseFacultyModel(
        name=data.name,
        tag=data.tag,
        icon_path=icon_path
        )

    data = await update_faculty_by_id(faculty_id=faculty_id ,session=session, university_id=u_id, update_data=db_data)
    if data:
        return {'status': 'ok'}


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






