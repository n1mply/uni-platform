from pydantic import BaseModel, EmailStr
from typing import Annotated
from annotated_types import MinLen, MaxLen

class UniversityModel(BaseModel):
    ...