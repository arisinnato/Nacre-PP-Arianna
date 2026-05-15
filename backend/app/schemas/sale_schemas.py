from pydantic import BaseModel
from datetime import datetime

class SaleBase(BaseModel):
    product_id: int
    quantity: int

class SaleCreate(SaleBase):
    pass

class Sale(SaleBase):
    id: int
    total_price: float
    created_at: datetime
    status: str = "vendido" 
    class Config:
        from_attributes = True