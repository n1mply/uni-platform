from pydantic import BaseModel
from typing import Annotated
from annotated_types import MinLen, MaxLen


class UniSignIn(BaseModel):
    tag: Annotated[str, MinLen(2), MaxLen(10)]
    password: Annotated[str, MinLen(8), MaxLen(100)]