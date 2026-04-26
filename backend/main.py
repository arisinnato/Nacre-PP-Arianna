from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
from datetime import timedelta
import models
from database import engine, get_db, SessionLocal
import auth
from fastapi.security import OAuth2PasswordBearer
from schemas import ProductOut
from typing import List


auth_scheme = OAuth2PasswordBearer(tokenUrl="login")
app = FastAPI(title="Nacre API")
models.Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Bienvenida a la API de Nacre, Ari"}

#para que no choquen despues el back y el front
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)


@app.get("/api/products", response_model=List(ProductOut))
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).options(joinedload(models.Product.category)).all()

#ruta para ver producto por categoria (aun en prueba)
@app.get("/products/categories/{cat_id}")
def products_by_category(cat_id: int, db: Session = Depends(get_db)):
    return db.query(models.Product).filter(models.Product.category_id == cat_id).all()


class UserCreate(BaseModel):
    username: str
    email: str | None = None
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

@app.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(username=user.username, email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Usuario registrado exitosamente"}

@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    
    access_token = auth.create_access_token(
        data={"sub": db_user.username}, 
        expires_delta=timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/dashboard-data")
def get_dashboard_stats(token: str = Depends(auth_scheme)):
    return {
        "user": "Arianna",
        "total_sales": 150,
        "total_products": 12,
        "goal_progress": "10%"
    }
# --- RUTAS PARA CATEGORÍAS ---

@app.get("/api/categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@app.post("/api/categories")
def create_category(category: dict, db: Session = Depends(get_db)):
    new_category = models.Category(name=category['name'])
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@app.get("/api/products", response_model=list[ProductOut])
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).filter(models.Product.is_active == True).all()
    return products

@app.post("/api/products")
def create_product(product: dict, db: Session = Depends(get_db)):
    new_product = models.Product(
        name=product.get("name"),
        description=product.get("description"),
        price=float(product.get("price")),
        stock=int(product.get("stock")),
        is_active=True,
        category_id=None 
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@app.put("/api/products/{product_id}")
def update_product_stock(product_id: int, stock_update: dict, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product:
        # Aquí actualizamos el stock sumando lo nuevo o reemplazando
        db_product.stock = stock_update.get("stock")
        db.commit()
        db.refresh(db_product)
        return db_product
    return {"error": "Producto no encontrado"}

@app.get("/api/sales")
def get_sales(db: Session = Depends(get_db)):
    sales = db.query(models.Sale).all()
    return sales

@app.get("/api/sales")
def get_sales():
    return [] 

@app.post("/api/sales")
def create_sale(sale_data: dict, db: Session = Depends(get_db)):
    #busca el producto que se vendio
    product = db.query(models.Product).filter(models.Product.id == sale_data['product_id']).first()
    
    if not product:
        return {"error": "Producto no encontrado"}, 404
        
    if product.stock < sale_data['quantity']:
        return {"error": "No tienes suficiente stock en Nacre"}, 400

    #aqui lo resta del inventario
    product.stock -= sale_data['quantity']

    #y aqui crea el registro de la venta
    new_sale = models.Sale(
        product_id=sale_data['product_id'],
        quantity=sale_data['quantity'],
        total_price=product.price * sale_data['quantity']
    )
    
    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)
    
    return {"message": "¡Venta de Nacre registrada!", "sale_id": new_sale.id}

#@app.get("/api/categories")
#def get_categories(db: Session = Depends(get_db)):
#    return db.query(models.Category).all()

#@app.post("/api/categories")
#def create_category(category: dict, db: Session = Depends(get_db)):
#    new_cat = models.Category(name=category['name'])
#    db.add(new_cat)
 #   db.commit()
  #  db.refresh(new_cat)
   # return new_cat

# Esto lo pones después de tus rutas actuales
def seed_categories():
    db = SessionLocal() # Abrimos una conexión rápida
    try:
        count = db.query(models.Category).count()
        
        if count == 0:
            print("🌱 Sembrando categorías iniciales para Nacre...")
            categories = ["Collares", "Pulseras", "Zarcillos"]
            
            for name in categories:
                cat = models.Category(name=name)
                db.add(cat)
            
            db.commit()
            print("✅ Categorías creadas con éxito.")
    except Exception as e:
        print(f"Error sembrando categorías: {e}")
    finally:
        db.close()

seed_categories()