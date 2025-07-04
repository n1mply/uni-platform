import enum
from database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, Enum
from university import University

class ContactTypeEnum(str, enum.Enum):
    phone = "phone"
    email = "email"

class Contact(Base):
    __tablename__ = "contacts"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    type: Mapped[ContactTypeEnum] = mapped_column(Enum(ContactTypeEnum), nullable=False)
    value: Mapped[str] = mapped_column(String(100), nullable=False)

    university_id: Mapped[int] = mapped_column(
        ForeignKey("universities.id", ondelete="CASCADE"), nullable=False
    )
    university: Mapped["University"] = relationship("University", back_populates="contacts")