from sqlalchemy import select

from models.faculty_department import FacultyDepartment
from models.university import University
from models.faculty import Faculty
from models.department import Department
from models.contact import Contact
from models.employee import Employee
from models.credentials import UniversityCredentials
from models.request import UniversityRequest
from models.specialty import Specialty

from security.password import verify_password
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession


async def get_credentials_by_tag(tag: str, password: str, session):
    result = await session.execute(
        select(University).where(University.university_tag == tag)
    )
    university = result.scalar_one_or_none()

    if not university:
        raise HTTPException(status_code=404 ,detail="Неправильный тег или пароль")

    result = await session.execute(
        select(UniversityCredentials).where(UniversityCredentials.university_id == university.id)
    )
    credentials = result.scalar_one_or_none()

    if not credentials:
        raise HTTPException(status_code=404 ,detail="Учетные данные не корректны")

    if not verify_password(password, credentials.hashed_password):
        raise HTTPException(status_code=401 ,detail="Неправильный тег или пароль")

    return {
        "university_id": university.id,
        "university_tag": university.university_tag
    }


async def get_university_data_by_id(id: int, session, data='full'):
    university_data = await session.execute(
        select(University).where(University.id == id)
    )
    university = university_data.scalar_one_or_none()
    
    faculty_data = await session.execute(
        select(Faculty).where(Faculty.university_id == id)
    )
    
    faculty = faculty_data.scalar_one_or_none()
    
    return {faculty}



async def get_requests(session):
    result = await session.scalars(select(UniversityRequest))
    requests = result.all()
    requests_list = [
        UniversityRequest(
            id=req.id,
            data=req.data,
            created_at=req.created_at
        ) for req in requests
    ]

    return requests_list

async def get_request_by_id(session, id: int):
    result = await session.execute(
        select(UniversityRequest).where(UniversityRequest.id == id)
    )
    
    request = result.scalar_one_or_none()
    return request



async def get_contacts_by_id(id: int, session):
    result = await session.execute(
        select(Contact).where(Contact.university_id == id)
    )
    contacts = result.scalars().all()
    return contacts


async def get_contact_by_ids(contact_id: int, university_id: int, session: AsyncSession):
    result = await session.execute(
        select(Contact).where(
            (Contact.id == contact_id) &
            (Contact.university_id == university_id)
        )
    )
    contact = result.scalar_one_or_none()
    
    if contact is None:
        raise HTTPException(status_code=404, detail='Контакта с таким университетом не найдено')
    
    return contact



async def get_departents_by_id(id: int, session: AsyncSession):
    result = await session.execute(
        select(Department).where(Department.university_id == id)
    )
    departments = result.scalars().all()
    return departments




async def get_employees_by_id(id: int, session: AsyncSession):
    result = await session.execute(
        select(Employee).where(Employee.university_id == id)
    )
    employees = result.scalars().all()
    return employees

async def get_employee_heads_by_id(id: int, session: AsyncSession):
    result = await session.execute(
        select(Employee).where(
            (Employee.is_dep_head == True) &
            (Employee.university_id == id)
        )
    )
    employees = result.scalars().all()
    
    if not employees:
        raise HTTPException(status_code=404, detail='Заведующего кафедры в этом университете не найдено')
    
    return employees


async def get_departments_by_faculty_id(
    session: AsyncSession,
    faculty_id: int,
) -> list[Department]:
    subquery = (
        select(FacultyDepartment.department_id)
        .where(FacultyDepartment.faculty_id == faculty_id)
        .subquery()
    )
    
    query = select(Department).where(Department.id.in_(subquery))
    result = await session.execute(query)
    return list(result.scalars().all())


async def get_faculties_by_department_id(
    session: AsyncSession,
    department_id: int,
) -> list[Faculty]:
    subquery = (
        select(FacultyDepartment.faculty_id)
        .where(FacultyDepartment.department_id == department_id)
        .subquery()
    )

    query = select(Faculty).where(Faculty.id.in_(subquery))
    result = await session.execute(query)
    return list(result.scalars().all())



async def get_free_employees_by_id(id: int, session: AsyncSession): 
    result = await session.execute(
        select(Employee).where(
            (Employee.university_id == id) &
            (Employee.is_dep_head == False)
        )
    )
    
    free_employees = result.scalars().all()
    if not free_employees:
        raise HTTPException(status_code=404, detail='Не удалось найти свободных сотрудников')
    return free_employees


async def get_specs_by_id(id:int, session: AsyncSession):
    result = await session.execute(
        select(Specialty)
        .where(Specialty.university_id==id)
    )

    specs = result.scalars().all()
    return specs


async def get_faculties_by_id(id:int, session: AsyncSession):
    result = await session.execute(
        select(Faculty)
        .where(Faculty.university_id==id)
    )

    faculties = result.scalars().all()
    return faculties