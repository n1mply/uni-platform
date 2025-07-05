import asyncio
from sqlalchemy import inspect
from database import init_db, AsyncSessionLocal, engine
from models.university import University
from models.contact import Contact, ContactTypeEnum
from models.faculty import Faculty
from models.department import Department
from models.employee import Employee
from models.credentials import UniversityCredentials

async def check_tables_exist():
    """Проверка существования таблиц через асинхронный inspect"""
    async with engine.connect() as conn:
        tables = await conn.run_sync(
            lambda sync_conn: inspect(sync_conn).get_table_names()
        )
        print(f"Существующие таблицы: {tables}")
        return bool(tables)

async def create_university():
    if not await check_tables_exist():
        await init_db()

    async with AsyncSessionLocal() as session:
        try:
            # 1. Создаем университет
            uni = University(
                full_name="Государственный Университет Тестирования",
                short_name="ГУТ",
                description="Тестовый вуз",
                address="г. Минск, ул. Тестовая, д.1",
                image="/static/uploads/universities/test.png",
                university_tag="gut"
            )
            session.add(uni)
            await session.flush()

            # 2. Добавляем контакты
            contacts = [
                Contact(
                    name="Приёмная комиссия",
                    type=ContactTypeEnum.phone,
                    value="+375291112233",
                    university_id=uni.id
                ),
                Contact(
                    name="Email справочная",
                    type=ContactTypeEnum.email,
                    value="info@gut.by",
                    university_id=uni.id
                )
            ]
            session.add_all(contacts)

            # 3. Добавляем факультет
            faculty = Faculty(
                name="Факультет информационных технологий",
                tag="fit",
                icon_path="/static/uploads/icons/fit.png",
                university_id=uni.id
            )
            session.add(faculty)
            await session.flush()

            # 4. Добавляем кафедру
            dep = Department(
                name="Кафедра программной инженерии",
                phone="+375292223344",
                email="dep@gut.by",
                address="ул. Программная, д.5",
                university_id=uni.id
            )
            session.add(dep)
            await session.flush()

            # 5. Добавляем сотрудника
            emp = Employee(
                full_name="Иванов Иван Иванович",
                position="Заведующий кафедрой",
                academic_degree="Кандидат технических наук",
                is_dep_head=True,
                photo_path="/static/uploads/employees/ivanov.png",
                department_id=dep.id,
                university_id=uni.id
            )
            session.add(emp)
            await session.flush()

            # 6. Назначаем заведующего
            dep.head_id = emp.id
            await session.flush()

            # 7. Добавляем учетные данные
            cred = UniversityCredentials(
                hashed_password="hashed_123456",
                university_id=uni.id
            )
            session.add(cred)

            await session.commit()
            print("✅ Университет создан успешно")

        except Exception as e:
            await session.rollback()
            print(f"❌ Ошибка: {str(e)}")
            raise

async def main():
    # await reset_db()
    await create_university()

if __name__ == "__main__":
    asyncio.run(main())