from sqlalchemy import ForeignKey
from db import Base
from sqlalchemy.orm import Mapped, mapped_column

class FacultyDepartment(Base):
    __tablename__ = "faculty_departments"
    
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculties.id", ondelete="CASCADE"), primary_key=True)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id", ondelete="CASCADE"), primary_key=True)