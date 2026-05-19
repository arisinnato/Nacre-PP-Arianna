from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, DateTime
from app.database import Base
from datetime import datetime
from sqlalchemy.orm import relationship


class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)