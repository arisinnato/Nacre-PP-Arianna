from pydantic import BaseModel
from typing import Optional

class CategoryOut(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True


class ProductOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    stock: int
    image_url: Optional[str] = None
    category_id: Optional[int] 
    category: Optional[CategoryOut] = None
    class Config:
        from_attributes = True

