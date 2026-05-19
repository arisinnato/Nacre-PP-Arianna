from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, DateTime
from app.database import Base
from datetime import datetime
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users_v2"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    password = Column(String)
