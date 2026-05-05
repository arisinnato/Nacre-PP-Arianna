from fastapi import APIRouter, Depends, HTTPException, status 
from sqlalchemy.orm import Session
from database import get_db
import models, auth, schemas

router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"]  
)

@router.post("/register")
def register_user(user: dict, db: Session = Depends(get_db)):
    # 1. Verificar si el usuario ya existe
    db_user = db.query(models.User).filter(models.User.username == user.get('username')).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    
    # 2. Procesar la contraseña
    # Usamos .strip() por si acaso se coló un espacio en blanco al final
    raw_password = str(user.get('password', '')).strip()
    
    # IMPORTANTE: Aquí es donde auth.get_password_hash hará su magia 
    # Asegúrate de haber actualizado auth.py como te dije antes
    try:
        hashed_password = auth.get_password_hash(raw_password)
        
        new_user = models.User(
            username=user.get('username'), 
            email=user.get('email'), 
            password=hashed_password
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "Usuario registrado exitosamente"}
        
    except Exception as e:
        db.rollback()
        # Si esto falla, el log de Render nos dirá exactamente por qué
        print(f"Error detallado en registro: {e}")
        raise HTTPException(status_code=500, detail="Error interno al procesar el registro")

@router.post("/login")
def login(user: dict, db: Session = Depends(get_db)):
    # 1. Buscar al usuario
    db_user = db.query(models.User).filter(models.User.username == user.get('username')).first()
    
    # 2. Verificar credenciales
    raw_password = str(user.get('password', '')).strip()
    
    # Verificamos si existe el usuario y si la contraseña coincide
    if not db_user or not auth.verify_password(raw_password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Datos incorrectos"
        )
    
    # 3. Generar token de acceso para Nacre
    access_token = auth.create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}