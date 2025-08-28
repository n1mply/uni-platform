from sqlite3 import IntegrityError
from fastapi import HTTPException
from sqlalchemy import select
from schemas.update_university_schema import DepartmentPOSTModel, SpecialtyPOSTModel
from security.password import hash_password
from db import init_db, check_tables_exist

from models.university import University
from models.contact import Contact, ContactTypeEnum
from models.faculty import Faculty
from models.department import Department
from models.employee import Employee
from models.credentials import UniversityCredentials
from models.specialty import Specialty

from schemas.university_schema import UniversityModel
from sqlalchemy.ext.asyncio import AsyncSession



async def create_university(data: dict, session):
    
    university_data = UniversityModel(**data)
    
    if not await check_tables_exist():
        await init_db()
        
    try:
        # 🔍 Проверка: university_tag должен быть уникален
        existing = await session.execute(
                select(University).where(University.university_tag == university_data.baseInfo.universityTag)
            )
        if existing.scalar():
            raise ValueError(f"Университет с тегом '{university_data.baseInfo.universityTag}' уже существует")

        # 🔹 Университет
        print(university_data)
        uni = University(
                full_name=university_data.baseInfo.fullName,
                short_name=university_data.baseInfo.shortName,
                description=university_data.baseInfo.description,
                address=university_data.baseInfo.address,
                image=university_data.baseInfo.universityImage.url if university_data.baseInfo.universityImage else None,
                banner=university_data.baseInfo.universityBanner.url if university_data.baseInfo.universityBanner else None,
                university_tag=university_data.baseInfo.universityTag
            )
        session.add(uni)
        await session.flush()

        # 🔹 Контакты
        contacts = [
            Contact(
                    name=c.name,
                    type=ContactTypeEnum(c.type),
                    value=c.value,
                    university_id=uni.id
                ) for c in university_data.baseInfo.contacts
            ]
        session.add_all(contacts)

        # 🔹 Факультеты
        faculties = [
                Faculty(
                    name=f.name,
                    tag=f.tag,
                    icon_path=f.iconURL.url if f.iconURL else None,
                    university_id=uni.id
                ) for f in university_data.structure.faculties
            ]
        session.add_all(faculties)
        await session.flush()

        # 🔹 Кафедры
        departments = [
                Department(
                    name=d.name,
                    phone=d.phone,
                    email=d.email,
                    address=d.address,
                    university_id=uni.id
                ) for d in university_data.structure.departments
            ]
        session.add_all(departments)
        await session.flush()

        # 🔹 Сотрудники
        employees = [
                Employee(
                    full_name=e.fullName,
                    position=e.position,
                    academic_degree=e.academicDegree,
                    is_dep_head=e.isDepHead or False,
                    photo_path=e.photoURL.url if e.photoURL else None,
                    department_id=None,
                    university_id=uni.id
                ) for e in university_data.employees
            ]
        session.add_all(employees)
        await session.flush()

        # 🔹 Связываем зав. кафедрой
        for dep_data in university_data.structure.departments:
                if dep_data.depHead:
                    head = next((e for e in employees if e.full_name == dep_data.depHead.fullName), None)
                    dep = next((d for d in departments if d.name == dep_data.name), None)
                    if head and dep:
                        dep.head_id = head.id

        await session.flush()

        # 🔹 Учётные данные
        cred = UniversityCredentials(
                hashed_password=hash_password(university_data.credentials.generatedPassword),
                university_id=uni.id
            )
        session.add(cred)

        await session.commit()
        print("✅ Университет создан успешно")
        return uni

    except ValueError as ve:
        print(f"⚠️ Валидационная ошибка: {ve}")
        raise
    except IntegrityError as ie:
        print("❌ Ошибка целостности данных:", str(ie))
        await session.rollback()
        raise
    except Exception as e:
        await session.rollback()
        print(f"❌ Общая ошибка: {str(e)}")
        raise


async def add_contact_by_id(id: int, data: Contact, session):
    try:
        contact = Contact(
            name=data.name,
            type=data.type,
            value=data.value,
            university_id=id
        )
        session.add(contact)
        await session.commit()
        
        return True
    except Exception as e:
        await session.rollback()
        print(f"❌ Ошибка при добавлении контакта: {str(e)}")
        raise
    
    
async def add_department_by_id(id: int, data: DepartmentPOSTModel, session: AsyncSession):
    try:
        department = Department(
            name=data.name,
            phone=data.phone,
            email=data.email,
            address=data.address,
            head_id=data.head_id,
            university_id=id
        )
        
        session.add(department)
        await session.flush()

        if data.head_id:
            employee = await session.get(Employee, data.head_id)
            if not employee:
                await session.rollback()
                raise HTTPException(status_code=404, detail="Сотрудник не найден")
            
            if employee.is_dep_head and employee.department_id != department.id:
                await session.rollback()
                raise HTTPException(
                    status_code=400,
                    detail="Этот сотрудник уже является заведующим другой кафедры"
                )

            employee.is_dep_head = True
            employee.department_id = department.id
        
        await session.commit()
        
        return True
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        print(f"❌ Ошибка при добавлении кафедры: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Произошла ошибка при создании кафедры"
        )
    



async def add_specialty_by_id(id: int, data: SpecialtyPOSTModel, session: AsyncSession):
    try:
        description_data = (
            [item.dict() for item in data.description_data]
            if data.description_data
            else None
        )

        spec = Specialty(
            name=data.name,
            qualification=data.qualification,
            duration=data.duration,
            type_of_education=data.type_of_education,
            department_id=data.department_id,
            faculty_id=data.faculty_id,
            description_data=description_data,
            university_id=id
        )
        
        session.add(spec)
        await session.commit()
        
        return True
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        print(f"❌ Ошибка при добавлении специальности: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Произошла ошибка при создании специальности"
        )