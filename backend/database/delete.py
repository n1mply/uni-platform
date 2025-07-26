from sqlalchemy.ext.asyncio import AsyncSession
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