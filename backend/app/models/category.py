from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, DateTime
from app.database import Base
from datetime import datetime
from sqlalchemy.orm import relationship


class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    
    products = relationship("Product", back_populates="category")