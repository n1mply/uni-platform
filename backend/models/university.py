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
    banner: Mapped[str] = mapped_column(String(255), nullable=True)
    university_tag: Mapped[str] = mapped_column(String(100), nullable=False)

    created_at: Mapped[datetime] = mapped_column(server_default=text("CURRENT_TIMESTAMP"))
    updated_at: Mapped[datetime] = mapped_column(
        server_default=text("CURRENT_TIMESTAMP"),
        onupdate=datetime.utcnow
    )
    contacts: Mapped[list["Contact"]] = relationship("Contact", back_populates="university", cascade="all, delete-orphan") # pyright: ignore[reportUndefinedVariable]
    faculties: Mapped[list["Faculty"]] = relationship("Faculty", back_populates="university", cascade="all, delete-orphan") # pyright: ignore[reportUndefinedVariable]
    departments: Mapped[list["Department"]] = relationship("Department", back_populates="university", cascade="all, delete-orphan") # pyright: ignore[reportUndefinedVariable]
    employees: Mapped[list["Employee"]] = relationship("Employee", back_populates="university", cascade="all, delete-orphan") # pyright: ignore[reportUndefinedVariable]
    specialties: Mapped[list["Specialty"]] = relationship("Specialty",back_populates="university",cascade="all, delete-orphan") # pyright: ignore[reportUndefinedVariable]

    
    credentials: Mapped["UniversityCredentials"] = relationship( # pyright: ignore[reportUndefinedVariable]
        "UniversityCredentials",
        back_populates="university",
        uselist=False,
        cascade="all, delete-orphan"
)
