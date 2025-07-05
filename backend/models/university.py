from datetime import datetime
from db import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, text

class University(Base):
    __tablename__ = "universities"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    short_name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
    address: Mapped[str] = mapped_column(String(255), nullable=True)
    image: Mapped[str] = mapped_column(String(255), nullable=True)
    university_tag: Mapped[str] = mapped_column(String(100), nullable=False)

    created_at: Mapped[datetime] = mapped_column(server_default=text("CURRENT_TIMESTAMP"))
    updated_at: Mapped[datetime] = mapped_column(
        server_default=text("CURRENT_TIMESTAMP"),
        onupdate=datetime.utcnow
    )

    # Используем строки вместо прямых импортов
    contacts: Mapped[list["Contact"]] = relationship("Contact", back_populates="university", cascade="all, delete-orphan")
    faculties: Mapped[list["Faculty"]] = relationship("Faculty", back_populates="university", cascade="all, delete-orphan")
    departments: Mapped[list["Department"]] = relationship("Department", back_populates="university", cascade="all, delete-orphan")
    employees: Mapped[list["Employee"]] = relationship("Employee", back_populates="university", cascade="all, delete-orphan")
    
    credentials: Mapped["UniversityCredentials"] = relationship(
        "UniversityCredentials",
        back_populates="university",
        uselist=False,
        cascade="all, delete-orphan"
)
