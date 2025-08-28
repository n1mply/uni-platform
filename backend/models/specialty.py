import enum
from typing import Optional
from db import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Column, String, ForeignKey, Enum, Integer
from sqlalchemy.dialects.postgresql import JSONB, insert


class SpecialtyTypeEnum(str, enum.Enum):
    daytime = "Дневной"
    correspondence = "Заочный"
    evening = "Вечерний"


class Specialty(Base):
    __tablename__ = "specialties"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    qualification: Mapped[str] = mapped_column(String(100), nullable=False)
    duration: Mapped[int] = mapped_column(Integer, nullable=False)
    type_of_education: Mapped[SpecialtyTypeEnum] = mapped_column(Enum(SpecialtyTypeEnum), nullable=False)
    description_data = Column(JSONB)

    department_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("departments.id", ondelete="SET NULL"), 
        nullable=True
    )

    faculty_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("faculties.id", ondelete="SET NULL"), 
        nullable=True
    )

    university_id: Mapped[int] = mapped_column(ForeignKey("universities.id", ondelete="CASCADE"))
    university: Mapped["University"] = relationship("University", back_populates="specialties") # pyright: ignore[reportUndefinedVariable]
