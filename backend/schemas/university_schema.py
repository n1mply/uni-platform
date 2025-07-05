from pydantic import BaseModel, EmailStr
from typing import Annotated
from annotated_types import MinLen, MaxLen

from pydantic import BaseModel, EmailStr, Field
from typing import List, Literal, Optional
from datetime import datetime


# 🔹 1. Контакт
class ContactModel(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    type: Literal["phone", "email"]
    value: str = Field(..., min_length=3, max_length=100)

# 🔹 2. Изображение
class ImageStateModel(BaseModel):
    name: str
    url: str

# 🔹 3. Факультет
class FacultyModel(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    tag: str = Field(..., min_length=2, max_length=50)
    iconURL: Optional[ImageStateModel]

# 🔹 4. Сотрудник
class EmployeeModel(BaseModel):
    position: str
    academicDegree: str
    fullName: str
    isDepHead: Optional[bool] = False
    photoURL: Optional[ImageStateModel]

# 🔹 5. Кафедра
class DepartmentModel(BaseModel):
    name: str
    phone: str
    email: EmailStr
    address: str
    depHead: Optional[EmployeeModel]

# 🔹 6. Данные доступа
class CredentialsModel(BaseModel):
    generatedPassword: str = Field(..., min_length=6)

# 🔹 7. Метаданные (опционально)
class MetaModel(BaseModel):
    createdAt: Optional[datetime]
    updatedAt: Optional[datetime]

# 🔹 8. Основная информация о ВУЗе
class BaseInfoModel(BaseModel):
    fullName: str = Field(..., min_length=2, max_length=255)
    shortName: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    address: Optional[str] = Field(None, max_length=255)
    image: Optional[ImageStateModel]
    universityTag: str = Field(..., min_length=2, max_length=100)
    contacts: List[ContactModel]

# 🔹 9. Структура: факультеты и кафедры
class StructureModel(BaseModel):
    faculties: List[FacultyModel]
    departments: List[DepartmentModel]

# 🔹 10. Итоговая модель
class UniversityModel(BaseModel):
    baseInfo: BaseInfoModel
    structure: StructureModel
    employees: List[EmployeeModel]
    credentials: CredentialsModel
    meta: Optional[MetaModel] = None

    