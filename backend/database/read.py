from sqlalchemy import select
from models.university import University
from models.credentials import UniversityCredentials
from security.password import verify_password
from fastapi import HTTPException


async def get_credentials_by_tag(tag: str, password: str, session):
    # Получаем университет по тегу
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
