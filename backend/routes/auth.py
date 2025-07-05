from fastapi import APIRouter, HTTPException
from schemas.university import UniversityModel
from database.create import create_university

auth = APIRouter()

@auth.post('/auth/signup/university')
async def sign_up_university(university: UniversityModel):
    try:
        await create_university(university)
        return {"status": "ok", "message": "Университет создан"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))