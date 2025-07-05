from sqlalchemy import Boolean, String, ForeignKey
from db import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship

class Employee(Base):
    __tablename__ = 'employees'

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    position: Mapped[str] = mapped_column(String(100), nullable=False)
    academic_degree: Mapped[str] = mapped_column(String(100), nullable=False)
    is_dep_head: Mapped[bool] = mapped_column(Boolean, nullable=True)
    photo_path: Mapped[str] = mapped_column(String(255), nullable=True)

    # Связь с Department (явно указываем foreign_keys)
    department_id: Mapped[int] = mapped_column(
        ForeignKey("departments.id", ondelete="CASCADE"), 
        nullable=True
    )
    department: Mapped["Department"] = relationship(
        "Department", 
        back_populates="employees",
        foreign_keys=[department_id]  # Явно указываем, какой ключ использовать
    )

    # Связь с University
    university_id: Mapped[int] = mapped_column(
        ForeignKey("universities.id", ondelete="CASCADE"), 
        nullable=False
    )
    university: Mapped["University"] = relationship("University", back_populates="employees")