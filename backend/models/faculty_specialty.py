from sqlalchemy import ForeignKey
from db import Base
from sqlalchemy.orm import Mapped, mapped_column

class FacultySpecialty(Base):
    __tablename__ = "faculty_specialties"
    
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculties.id", ondelete="CASCADE"), primary_key=True)
    specialty_id: Mapped[int] = mapped_column(ForeignKey("specialties.id", ondelete="CASCADE"), primary_key=True)