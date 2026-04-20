from fastapi import FastAPI
import models
from database import engine

app = FastAPI(title="Nacre API")

# Esta línea crea las tablas en Postgres al iniciar el servidor
models.Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Bienvenida a la API de Nacre, Ari"}
    