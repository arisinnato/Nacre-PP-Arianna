from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
from datetime import timedelta
from typing import List, Optional
import models
import auth
from database import engine, get_db, SessionLocal
from schemas import ProductOut

app = FastAPI(title="Nacre API")
models.Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

#PRODUCTOS 

@app.get("/api/products", response_model=list[ProductOut])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product)\
             .options(joinedload(models.Product.category))\
             .filter(models.Product.is_active == True)\
             .all()

@app.post("/api/products")
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

@app.put("/api/products/{product_id}")
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

@app.get("/api/categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

#VENTA 

@app.get("/api/sales")
def get_sales(db: Session = Depends(get_db)):
    return db.query(models.Sale).all()

@app.post("/api/sales")
def create_sale(sale_data: dict, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == sale_data['product_id']).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    if product.stock < sale_data['quantity']:
        raise HTTPException(status_code=400, detail="Stock insuficiente")

    product.stock -= sale_data['quantity']
    new_sale = models.Sale(
        product_id=sale_data['product_id'],
        quantity=sale_data['quantity'],
        total_price=product.price * sale_data['quantity']
    )
    db.add(new_sale)
    db.commit()
    return {"message": "¡Venta registrada!"}

#LOGIN Y REGISTRO

@app.post("/register")
def register_user(user: dict, db: Session = Depends(get_db)):
    hashed_password = auth.get_password_hash(user['password'])
    new_user = models.User(username=user['username'], email=user.get('email'), password=hashed_password)
    db.add(new_user)
    db.commit()
    return {"message": "Usuario registrado"}

@app.post("/login")
def login(user: dict, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user['username']).first()
    if not db_user or not auth.verify_password(user['password'], db_user.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
    access_token = auth.create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}


def seed_categories():
    db = SessionLocal()
    try:
        if db.query(models.Category).count() == 0:
            for name in ["Collares", "Pulseras", "Zarcillos"]:
                db.add(models.Category(name=name))
            db.commit()
    finally:
        db.close()

seed_categories()