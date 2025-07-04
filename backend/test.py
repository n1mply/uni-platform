import asyncio
from database import init_db, AsyncSessionLocal
from models.university import University
from models.contact import Contact, ContactTypeEnum
from models.faculty import Faculty
from models.department import Department
from models.employee import Employee
from models.credentials import UniversityCredentials

async def create_university():
    await init_db()
    async with AsyncSessionLocal() as session:
        # 1. Создаём университет
        uni = University(
            full_name="Государственный Университет Тестирования",
            short_name="ГУТ",
            description="Тестовый вуз",
            address="г. Минск, ул. Тестовая, д.1",
            image="/static/uploads/universities/test.png",
            university_tag="gut"
        )

        # 2. Добавим контакты
        uni.contacts = [
            Contact(name="Приёмная комиссия", type=ContactTypeEnum.phone, value="+375291112233"),
            Contact(name="Email справочная", type=ContactTypeEnum.email, value="info@gut.by")
        ]

        # 3. Добавим факультет
        faculty = Faculty(name="Факультет информационных технологий", tag="fit", icon_path="/static/uploads/icons/fit.png")
        uni.faculties.append(faculty)

        # 4. Добавим кафедру
        dep = Department(
            name="Кафедра программной инженерии",
            phone="+375292223344",
            email="dep@gut.by",
            address="ул. Программная, д.5"
        )
        uni.departments.append(dep)

        # 5. Добавим сотрудника
        emp = Employee(
            full_name="Иванов Иван Иванович",
            position="Заведующий кафедрой",
            academic_degree="Кандидат технических наук",
            is_dep_head=True,
            photo_path="/static/uploads/employees/ivanov.png"
        )
        uni.employees.append(emp)

        # Назначим заведующего кафедрой
        dep.head = emp

        # 6. Добавим учётные данные
        cred = UniversityCredentials(
            hashed_password="hashed_123456"  # представим, что это bcrypt-хеш
        )
        uni.credentials = cred

        # 7. Добавим в сессию и коммит
        session.add(uni)
        await session.commit()
        print("Университет успешно создан.")

asyncio.run(create_university())
