from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine, SessionLocal
from routes import auth_routes, products_routes, sales_routes
from contextlib import asynccontextmanager

# 1. Configuración de Sembrado (Categories Seeder)
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

# 2. Manejo del Ciclo de Vida (Lifespan)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Esto asegura que las tablas existan en Render antes de iniciar
    models.Base.metadata.create_all(bind=engine)
    seed_categories()
    yield

app = FastAPI(
    title="Nacre API", 
    lifespan=lifespan
)

# 3. CONFIGURACIÓN DE CORS (El "Desbloqueador")
# He añadido "*" para pruebas y asegurado que no falten las barras diagonales
origins = [
    "https://nacre.onrender.com",
    "https://nacre.onrender.com/",
    "http://localhost:5173",
    "*" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           
    allow_credentials=True,
    allow_methods=["*"],             
    allow_headers=["*"],              
)

# 4. Inclusión de Rutas (Después del Middleware)
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