from fastapi import HTTPException
from sqlalchemy import select, update
from sqlalchemy.exc import NoResultFound
from models.university import University
from schemas.update_university_schema import BaseResponseModel
from sqlalchemy.ext.asyncio import AsyncSession


async def update_base_by_id(
    session: AsyncSession,
    university_id: int,
    update_data: BaseResponseModel
) -> University:
    """
    Обновляет базовую информацию университета по ID.
    
    Args:
        id: ID университета.
        update_data: Данные для обновления (Pydantic модель).
        session: AsyncSession SQLAlchemy.
        
    Returns:
        Обновлённый объект University.
        
    Raises:
        HTTPException 404: Если университет не найден.
        HTTPException 500: При ошибках БД.
    """
    try:
        """Обновляет основную информацию университета в БД."""
        stmt = select(University).where(University.id == university_id)
        result = await session.execute(stmt)
        university = result.scalar_one()

        university.full_name = update_data.fullName
        university.short_name = update_data.shortName
        university.address = update_data.address
        university.description = update_data.description
        university.image = update_data.image
        university.banner = update_data.banner

        await session.commit()
        await session.refresh(university)
        return university
        
    except NoResultFound:
        await session.rollback()
        raise HTTPException(
            status_code=404,
            detail=f"Университет с ID {id} не найден."
        )
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при обновлении университета: {str(e)}"
        )