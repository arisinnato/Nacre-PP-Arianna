from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import timedelta
import models
from database import engine, get_db
import auth

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
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/productos")
def obtener_productos(db: Session = Depends(get_db)):
    productos = db.query(models.Product).all()
    return productos

#ruta para ver producto por categoria (aun en prueba)
@app.get("/productos/categoria/{cat_id}")
def productos_por_categoria(cat_id: int, db: Session = Depends(get_db)):
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