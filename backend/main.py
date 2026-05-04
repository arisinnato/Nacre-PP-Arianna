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
        print(f"Error en el seeder: {e}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    models.Base.metadata.create_all(bind=engine)
    seed_categories()
    yield

app = FastAPI(title="Nacre API", lifespan=lifespan)

origins = [
    "https://nacre.onrender.com",
    "https://nacre-pp-arianna.onrender.com",
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

#registro de rutas
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