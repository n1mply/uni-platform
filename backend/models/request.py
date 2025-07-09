from datetime import datetime
from sqlalchemy import Column, DateTime, Integer
from db import Base
from sqlalchemy.dialects.postgresql import JSONB

class UniversityRequest(Base):
    __tablename__ = "university_requests"

    id = Column(Integer, primary_key=True)
    data = Column(JSONB)  # Все данные из UniversityModel
    created_at = Column(DateTime, default=datetime.utcnow)