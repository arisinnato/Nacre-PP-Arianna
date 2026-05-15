from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, DateTime
from backend.app.database import Base
from datetime import datetime
from sqlalchemy.orm import relationship


class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String)
    description = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    price = Column(Float)
    stock = Column(Integer)
    is_active = Column(Boolean, default=True)
    category_id = Column(Integer, ForeignKey("categories.id"))

    category = relationship("Category", back_populates="products")
