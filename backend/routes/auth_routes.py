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
    db_user = db.query(models.User).filter(models.User.username == user['username']).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    
    raw_password = str(user['password'])[:72]
    hashed_password = auth.get_password_hash(raw_password)
    
    new_user = models.User(
        username=user['username'], 
        email=user.get('email'), 
        password=hashed_password
    )
    db.add(new_user)
    db.commit()
    return {"message": "Usuario registrado"}

@router.post("/login")
def login(user: dict, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user['username']).first()
    
    raw_password = str(user['password'])[:72]
    
    if not db_user or not auth.verify_password(raw_password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Datos incorrectos"
        )
    
    access_token = auth.create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}