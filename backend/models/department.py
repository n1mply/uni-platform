from typing import Optional
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db import Base

class Department(Base):
    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str] = mapped_column(String(30))
    email: Mapped[str] = mapped_column(String(100))
    address: Mapped[str] = mapped_column(String(255))

    university_id: Mapped[int] = mapped_column(ForeignKey("universities.id", ondelete="CASCADE"))
    university: Mapped["University"] = relationship("University", back_populates="departments")

    head_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("employees.id", ondelete="SET NULL"), 
        nullable=True
    )
    head: Mapped["Employee"] = relationship("Employee", foreign_keys=[head_id])
    
    employees: Mapped[list["Employee"]] = relationship(
        "Employee", 
        back_populates="department",
        foreign_keys="[Employee.department_id]"
    )
    
    faculties: Mapped[list["Faculty"]] = relationship(
        "Faculty",
        secondary="faculty_departments",
        back_populates="departments"
    )