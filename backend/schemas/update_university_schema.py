from pydantic import BaseModel, EmailStr, Field
from typing import Annotated, Optional, Literal, List
from annotated_types import MinLen, MaxLen


class ImageBase64Model(BaseModel):
    name: Annotated[str, MinLen(3), MaxLen(100)]
    base64: Annotated[str, MinLen(1)]
    type: Literal["avatar", "banner", "icon"]


class BasePutModel(BaseModel):
    fullName: Annotated[str, MinLen(3), MaxLen(255)]
    shortName: Annotated[str, MinLen(2), MaxLen(100)]
    address: Annotated[str, MinLen(10), MaxLen(255)]
    description: Annotated[str, MinLen(60), MaxLen(300)]
    image: Optional[ImageBase64Model]
    banner: Optional[ImageBase64Model]
    
    
class BaseResponseModel(BaseModel):
    fullName: str
    shortName: str
    address: str
    description: str
    image: Optional[str] = None
    banner: Optional[str] = None
    
    
class DepartmentUpdateModel(BaseModel):
    name: Annotated[str, MinLen(3), MaxLen(100)]
    phone: Annotated[str, MinLen(8), MaxLen(100)]
    email: EmailStr
    address: Annotated[str, MinLen(60), MaxLen(255)]
    head_id: Optional[int] = None
    

class DepartmentPOSTModel(BaseModel):
    name: Annotated[str, MinLen(3), MaxLen(100)]
    phone: Annotated[str, MinLen(8), MaxLen(100)]
    email: EmailStr
    address: Annotated[str, MinLen(60), MaxLen(255)]
    head_id: Optional[int] = None


class DescriptionItem(BaseModel):
    title: Annotated[str, MinLen(3), MaxLen(100)]
    content: str

class SpecialtyPOSTModel(BaseModel):
    name: Annotated[str, MinLen(3), MaxLen(100)]
    qualification: Annotated[str, MinLen(3), MaxLen(100)]
    duration: int = Field(..., ge=1)
    type_of_education: Literal['Дневной', 'Заочный', 'Вечерний']
    department_id: Optional[int] = None
    faculty_id: Optional[int] = None
    description_data: Optional[List[DescriptionItem]] = None


class FacultyPOSTModel(BaseModel):
    name: Annotated[str, MinLen(6), MaxLen(100)]
    tag: Annotated[str, MinLen(3), MaxLen(100)]
    icon: Optional[ImageBase64Model]

class BaseFacultyModel(BaseModel):
    name: Annotated[str, MinLen(6), MaxLen(100)]
    tag: Annotated[str, MinLen(3), MaxLen(100)]
    icon_path: Annotated[str, MinLen(1), MaxLen(400)]