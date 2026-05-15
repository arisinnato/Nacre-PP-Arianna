from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import category_schemas 
from app.services import category_services

router = APIRouter(prefix="/api/categories", tags=["Categorías"])

@router.get("/", response_model=list[category_schemas.Category])
def read_categories(db: Session = Depends(get_db)):
    return category_services.get_all_categories(db)

@router.post("/", response_model=category_schemas.Category)
def create_new_category(category: category_schemas.CategoryCreate, db: Session = Depends(get_db)):
    return category_services.create_category(db, category.name)

@router.put("/{category_id}", response_model=category_schemas.Category)
def update_category(category_id: int, category: category_schemas.CategoryCreate, db: Session = Depends(get_db)):
    updated = category_services.update_category(db, category_id, category.name)
    if not updated:
        raise HTTPException(status_code=404, detail="Categoría no encontrada para actualizar")
    return updated

@router.delete("/{category_id}")
def remove_category(category_id: int, db: Session = Depends(get_db)):
    success = category_services.delete_category(db, category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return {"message": "Categoría eliminada con éxito"}