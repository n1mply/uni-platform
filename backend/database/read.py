from sqlalchemy import select
from models.university import University
from models.credentials import UniversityCredentials
from security.password import verify_password


async def get_credentials_by_tag(tag: str, password: str, session):
    # Получаем университет по тегу
    result = await session.execute(
        select(University).where(University.university_tag == tag)
    )
    university = result.scalar_one_or_none()

    if not university:
        raise ValueError("Университет с таким тегом не найден")

    # Получаем его учетные данные
    result = await session.execute(
        select(UniversityCredentials).where(UniversityCredentials.university_id == university.id)
    )
    credentials = result.scalar_one_or_none()

    if not credentials:
        raise ValueError("Учетные данные не найдены")

    if not verify_password(password, credentials.hashed_password):
        raise ValueError("Неверный пароль")

    return {
        "university_id": university.id,
        "university_tag": university.university_tag
    }
