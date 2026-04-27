from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine, SessionLocal
from routes import auth_routes, products_routes, sales_routes # Importamos tus 3 carpetas nuevas

app = FastAPI(title="Nacre API")

models.Base.metadata.create_all(bind=engine)

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
        "message": "Bienvenida a la API de Nacre, Ari",
        "status": "Online",
        "version": "2.0 (Modular)"
    }

def seed_categories():
    db = SessionLocal()
    try:
        if db.query(models.Category).count() == 0:
            print("🌱 Sembrando categorías iniciales para Nacre...")
            for name in ["Collares", "Pulseras", "Zarcillos"]:
                db.add(models.Category(name=name))
            db.commit()
    except Exception as e:
        print(f"Error en el seeder: {e}")
    finally:
        db.close()

seed_categories()