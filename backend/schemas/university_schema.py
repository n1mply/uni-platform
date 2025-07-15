from pydantic import BaseModel, EmailStr
from annotated_types import MinLen, MaxLen
from typing import List, Literal, Optional, Annotated
from datetime import datetime


# 🔹 1. Контакт
class ContactModel(BaseModel):
    name: Annotated[str, MinLen(3), MaxLen(100)]
    type: Literal["phone", "email"]
    value: Annotated[str, MinLen(3), MaxLen(100)]

# 🔹 2. Изображение
class ImageStateModel(BaseModel):
    name: str
    url: str

# 🔹 3. Факультет
class FacultyModel(BaseModel):
    name: Annotated[str, MinLen(3), MaxLen(100)]
    tag: Annotated[str, MinLen(2), MaxLen(50)]
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
    name: Annotated[str, MinLen(3), MaxLen(100)]
    phone: Annotated[str, MinLen(8), MaxLen(100)]
    email: EmailStr
    address: str
    depHead: Optional[EmployeeModel]

# 🔹 6. Данные доступа
class CredentialsModel(BaseModel):
    generatedPassword: Annotated[str, MinLen(8), MaxLen(100)]


# 🔹 7. Основная информация о ВУЗе
class BaseInfoModel(BaseModel):
    fullName: Annotated[str, MinLen(3), MaxLen(255)]
    shortName: Annotated[str, MinLen(2), MaxLen(100)]
    description: Annotated[str, MinLen(60), MaxLen(300)]
    address: Annotated[str, MinLen(10), MaxLen(255)]
    universityImage: Optional[ImageStateModel]
    universityTag: Annotated[str, MinLen(2), MaxLen(8)]
    contacts: List[ContactModel]

# 🔹 8. Структура: факультеты и кафедры
class StructureModel(BaseModel):
    faculties: List[FacultyModel]
    departments: List[DepartmentModel]

# 🔹 9. Итоговая модель
class UniversityModel(BaseModel):
    baseInfo: BaseInfoModel
    structure: StructureModel
    employees: List[EmployeeModel]
    credentials: CredentialsModel
    createdAt: Optional[datetime]
    updatedAt: Optional[datetime]

    