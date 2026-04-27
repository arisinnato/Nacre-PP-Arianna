from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(
    prefix="/api/sales",
    tags=["Ventas"]
)

@router.get("")
def get_sales(db: Session = Depends(get_db)):
    return db.query(models.Sale).all()

@router.post("")
def create_sale(sale_data: dict, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == sale_data['product_id']).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    if product.stock < sale_data['quantity']:
        raise HTTPException(status_code=400, detail="Stock insuficiente para esta venta")
    product.stock -= sale_data['quantity']

    new_sale = models.Sale(
        product_id=sale_data['product_id'],
        quantity=sale_data['quantity'],
        total_price=product.price * sale_data['quantity']
    )
    
    db.add(new_sale)
    db.commit()
    # db.refresh(new_sale)
    
    return {"message": "¡Venta registrada con éxito!"}