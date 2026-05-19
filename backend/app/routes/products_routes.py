from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.services import product_service

router = APIRouter(prefix="/products", tags=["Productos"])

@router.get("/")
def read_products(db: Session = Depends(get_db)):
    return product_service.get_all_products(db)

@router.post("/")
async def create_new_product(
    name: str = Form(...), price: float = Form(...), stock: int = Form(...),
    category_id: int = Form(...), description: str = Form(""),
    image: UploadFile = File(...), db: Session = Depends(get_db)
):
    product_data = {
        "name": name, "price": price, "stock": stock,
        "category_id": category_id, "description": description
    }
    return await product_service.create_product(db, product_data, image)

@router.put("/{product_id}")
async def update_existing_product(
    product_id: int, name: str = Form(...), price: float = Form(...),
    stock: int = Form(...), category_id: int = Form(...),
    description: str = Form(""), image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    update_data = {
        "name": name, "price": price, "stock": stock,
        "category_id": category_id, "description": description
    }
    updated = await product_service.update_product(db, product_id, update_data, image)
    if not updated:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return updated