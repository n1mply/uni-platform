from db import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String

class UniversityCredentials(Base):
    __tablename__ = "university_credentials"

    id: Mapped[int] = mapped_column(primary_key=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)

    university_id: Mapped[int] = mapped_column(
        ForeignKey("universities.id", ondelete="CASCADE"),
        unique=True  # гарантируем one-to-one на уровне SQL
    )
    university: Mapped["University"] = relationship( # pyright: ignore[reportUndefinedVariable]
        "University", 
        back_populates="credentials"
    )
