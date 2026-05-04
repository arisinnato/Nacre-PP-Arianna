from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session, joinedload
from database import get_db
import models, schemas
import requests
import base64

router = APIRouter(
    prefix="",
    tags=["Productos y Categorías"] 
)

# CONFIGURACIÓN IMGBB 
IMGBB_API_KEY = "1f8a9217d69b2e937537ca140ab78c44" 

#PRODUCTOS
@router.get("/products", response_model=list[schemas.ProductOut])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product)\
             .options(joinedload(models.Product.category))\
             .filter(models.Product.is_active == True)\
             .all()

@router.post("/products")
async def create_product(
    name: str = Form(...),
    price: float = Form(...),
    stock: int = Form(...),
    category_id: int = Form(...),
    description: str = Form(""),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    image_url = ""
    if image:
        try:
            image_content = await image.read()
            image_base64 = base64.b64encode(image_content).decode('utf-8')
            
            payload = {
                "key": IMGBB_API_KEY,
                "image": image_base64
            }
            response = requests.post("https://api.imgbb.com/1/upload", payload)
            
            if response.status_code == 200:
                image_url = response.json()['data']['url']
            else:
                print(f"Error ImgBB: {response.text}")
        except Exception as e:
            print(f"Error procesando imagen en el servidor: {e}")

    new_product = models.Product(
        name=name,
        price=price,
        stock=stock,
        category_id=category_id,
        description=description,
        image_url=image_url
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.put("/products/{product_id}")
async def update_product(
    product_id: int,
    name: str = Form(...),
    price: float = Form(...),
    stock: int = Form(...),
    category_id: int = Form(...),
    description: str = Form(""),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    
    if not db_product:
        raise HTTPException(status_code=404, detail="Pieza de Nacre no encontrada")

    if image and image.filename:
        try:
            image_content = await image.read()
            image_base64 = base64.b64encode(image_content).decode('utf-8')
            
            url = "https://api.imgbb.com/1/upload"
            payload = {"key": IMGBB_API_KEY, "image": image_base64}
            response = requests.post(url, payload)
            
            if response.status_code == 200:
                db_product.image_url = response.json()['data']['url']
        except Exception as e:
            print(f"Error actualizando imagen: {e}")

    db_product.name = name
    db_product.description = description
    db_product.price = price
    db_product.stock = stock
    db_product.category_id = category_id
    
    db.commit()
    db.refresh(db_product)
    return db_product

# --- CATEGORÍAS ---

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()