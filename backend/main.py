from fastapi import FastAPI, Depends
import models
from database import engine, get_db

app = FastAPI(title="Nacre API")

models.Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Bienvenida a la API de Nacre, Ari"}

@app.get("/productos")
def obtener_productos(db: Session = Depends(get_db)):
    productos = db.query(models.Product).all()
    return productos

#ruta para ver producto por categoria (aun en prueba)
@app.get("/productos/categoria/{cat_id}")
def productos_por_categoria(cat_id: int, db: Session = Depends(get_db)):
    return db.query(models.Product).filter(models.Product.category_id == cat_id).all()