from sqlalchemy import ForeignKey, String
from database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from university import University 


class Faculty(Base):
    __tablename__ = "faculties"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    tag: Mapped[str] = mapped_column(String(100), nullable=False)
    icon_path: Mapped[str] = mapped_column(String(255), nullable=True)

    university_id: Mapped[int] = mapped_column(ForeignKey("universities.id", ondelete="CASCADE"))
    university: Mapped["University"] = relationship("University", back_populates="faculties")
