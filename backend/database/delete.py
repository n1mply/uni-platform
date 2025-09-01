from sqlalchemy.ext.asyncio import AsyncSession
from models.specialty import Specialty
from models.department import Department
from models.contact import Contact
from sqlalchemy import delete
from fastapi import HTTPException

async def delete_contact_by_ids(u_id: int, c_id: int, session: AsyncSession):
    try:
        result = await session.execute(
            delete(Contact).where(
                (Contact.id == c_id) &
                (Contact.university_id == u_id)
            )
        )
        
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail='Контакта с таким id не существует!')
        
        await session.commit()
        return True
        
    except Exception as e:
        await session.rollback()
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(status_code=500, detail='Ошибка при удалении контакта')
    


async def delete_department_by_id(university_id: int, department_id: int, session: AsyncSession):
    try:
        result = await session.execute(
            delete(Department).where(
                (Department.id == department_id) &
                (Department.university_id == university_id)
            )
        )
        
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail='Кафедры с таким id не существует!')
        
        await session.commit()
        return True
        
    except Exception as e:
        await session.rollback()
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(status_code=500, detail='Ошибка при удалении кафедры')
    



async def delete_specialty_by_id(university_id: int, specialty_id: int, session: AsyncSession):
    try:
        result = await session.execute(
            delete(Specialty).where(
                (Specialty.id == specialty_id) &
                (Specialty.university_id == university_id)
            )
        )
        
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail='Специальности с таким id не существует!')
        
        await session.commit()
        return True
        
    except Exception as e:
        await session.rollback()
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(status_code=500, detail='Ошибка при удалении специальности')