from fastapi import HTTPException
from sqlalchemy import select, update
from sqlalchemy.exc import NoResultFound
from models.specialty import Specialty
from models.department import Department
from models.university import University
from models.employee import Employee
from schemas.update_university_schema import BaseResponseModel, DepartmentUpdateModel, SpecialtyPOSTModel
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
        
        
    
async def update_department_by_id(
    department_id: int,
    university_id: int,
    session: AsyncSession,
    update_data: DepartmentUpdateModel
) -> Department:
    try:
        stmt = select(Department).where(
            (Department.id == department_id) &
            (Department.university_id == university_id)
        )
        result = await session.execute(stmt)
        department = result.scalar_one()
        
        department.name = update_data.name
        department.phone = update_data.phone
        department.address = update_data.address
        department.email = update_data.email
        department.head_id = update_data.head_id
        

        if update_data.head_id:
            result = await session.execute(
                select(Employee).where(
                    (Employee.id == update_data.head_id) &
                    (Employee.university_id == university_id)
                )
            )
            dep_head = result.scalar_one()

            dep_head.is_dep_head = True
            dep_head.department_id = department_id

            department.head_id = update_data.head_id

            await session.commit()
            await session.refresh(department)
            await session.refresh(dep_head)

        elif update_data.head_id == 0 or update_data.head_id == None:
            result = await session.execute(
                select(Employee).where(
                    (Employee.department_id == department.id) &
                    (Employee.university_id == university_id)
                )
            )
            employee = result.scalar_one_or_none()
            employee.is_dep_head = False
            employee.department_id = None


            await session.commit()
            await session.refresh(employee)

        return department
    
    except NoResultFound:
        await session.rollback()
        raise HTTPException(
            status_code=404,
            detail=f"Кафедра в университете с id: {id} не найдена."
        )
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при обновлении кафедры: {str(e)}"
        )
        

async def update_specialty_by_id(specialty_id: int, session: AsyncSession, university_id: int, update_data: SpecialtyPOSTModel)->Specialty:
    try:
        stmt = select(Specialty).where(
            (Specialty.id == specialty_id) &
            (Specialty.university_id == university_id)
        )
        result = await session.execute(stmt)
        spec = result.scalar_one()

        description_data = (
            [item.dict() for item in update_data.description_data]
            if update_data.description_data
            else None
        )
        
        spec.name = update_data.name
        spec.qualification = update_data.qualification
        spec.duration = update_data.duration
        spec.department_id = update_data.department_id
        spec.faculty_id = update_data.faculty_id
        spec.type_of_education = update_data.type_of_education
        spec.description_data = description_data
        
        await session.commit()
        await session.refresh(spec)
        return spec
    
    except NoResultFound:
        await session.rollback()
        raise HTTPException(
            status_code=404,
            detail=f"Специальность в университете с id: {id} не найдена."
        )
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при обновлении специальности: {str(e)}"
        )