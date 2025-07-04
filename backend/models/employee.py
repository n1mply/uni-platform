from sqlalchemy import Boolean, String, Integer, ForeignKey
from database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from department import Department

class Employee(Base):
    __tablename__ = 'employees'

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    position: Mapped[str] = mapped_column(String(100), nullable=False)
    academic_degree: Mapped[str] = mapped_column(String(100), nullable=False)
    is_dep_head: Mapped[bool] = mapped_column(Boolean, nullable=True)
    image: Mapped[str] = mapped_column(String(255), nullable=True)

    department_id: Mapped[int] = mapped_column(
        ForeignKey("departments.id", ondelete="CASCADE"), nullable=False
    )
    department: Mapped["Department"] = relationship(
        "Department",
        back_populates="employees"
    )
