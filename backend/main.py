from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine, SessionLocal
from routes import auth_routes, products_routes, sales_routes
from contextlib import asynccontextmanager

def seed_categories():
    db = SessionLocal()
    try:
        if db.query(models.Category).count() == 0:
            print("Sembrando categorías iniciales para Nacre...")
            for name in ["Collares", "Pulseras", "Zarcillos"]:
                db.add(models.Category(name=name))
            db.commit()
    except Exception as e:
        print(f"Error en el seeder de categorías: {e}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):

    models.Base.metadata.drop_all(bind=engine)

    models.Base.metadata.create_all(bind=engine)
    seed_categories()
    yield

app = FastAPI(
    title="Nacre API", 
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(products_routes.router)
app.include_router(sales_routes.router)

@app.get("/")
def read_root():
    return {
        "message": "Bienvenida a la API de Nacre",
        "status": "Online",
        "version": "2.1"
    }