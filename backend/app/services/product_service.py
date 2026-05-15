import requests
import base64
import os
from sqlalchemy.orm import Session, joinedload
from app.models.products import Product

IMGBB_API_KEY = os.getenv("IMGBB_API_KEY")

def get_all_products(db: Session):
    return db.query(Product).options(joinedload(Product.category))\
             .filter(Product.is_active == True).all()

async def upload_image_to_imgbb(image_file):
    if not image_file: return ""
    try:
        content = await image_file.read()
        image_base64 = base64.b64encode(content).decode('utf-8')
        payload = {"key": IMGBB_API_KEY, "image": image_base64}
        response = requests.post("https://api.imgbb.com/1/upload", payload)
        return response.json()['data']['url'] if response.status_code == 200 else ""
    except:
        return ""

async def create_product(db: Session, product_data: dict, image_file=None):
    image_url = await upload_image_to_imgbb(image_file)
    db_product = Product(**product_data, image_url=image_url)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

async def update_product(db: Session, product_id: int, update_data: dict, image_file=None):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product: return None
    
    if image_file and image_file.filename:
        new_url = await upload_image_to_imgbb(image_file)
        if new_url: db_product.image_url = new_url

    for key, value in update_data.items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product