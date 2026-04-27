from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from database import get_db
import models, schemas
from schemas import ProductOut


router = APIRouter(
    prefix="/api",
    tags=["Productos y Categorías"] 
)

#PRODUCTOS

@router.get("/products", response_model=list[ProductOut])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product)\
             .options(joinedload(models.Product.category))\
             .filter(models.Product.is_active == True)\
             .all()

@router.post("/products")
def create_product(product: dict, db: Session = Depends(get_db)):
    new_product = models.Product(
        name=product.get("name"),
        description=product.get("description"),
        price=float(product.get("price")),
        stock=int(product.get("stock")),
        is_active=True,
        category_id=product.get("category_id")
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.put("/products/{product_id}")
def update_product(product_id: int, product_data: dict, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    db_product.name = product_data.get("name", db_product.name)
    db_product.description = product_data.get("description", db_product.description)
    db_product.price = float(product_data.get("price", db_product.price))
    db_product.stock = int(product_data.get("stock", db_product.stock))
    db_product.category_id = product_data.get("category_id", db_product.category_id)
    
    db.commit()
    db.refresh(db_product)
    return db_product

#CATEGORÍAS

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()