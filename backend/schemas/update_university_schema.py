from pydantic import BaseModel, EmailStr
from typing import Annotated, Optional, Literal
from annotated_types import MinLen, MaxLen


class ImageBase64Model(BaseModel):
    name: Annotated[str, MinLen(3), MaxLen(100)]
    base64: Annotated[str, MinLen(1)]
    type: Literal["avatar", "banner"]


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