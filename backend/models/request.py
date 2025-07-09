from datetime import datetime
from sqlalchemy import Column, Integer
from db import Base
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import text

class UniversityRequest(Base):
    __tablename__ = "university_requests"

    id: Mapped[int] = mapped_column(primary_key=True)
    data = Column(JSONB)
    created_at: Mapped[datetime] = mapped_column(server_default=text("CURRENT_TIMESTAMP"))
    