from sqlalchemy.orm import Session
from app.models.sale import Sale
from app.models.products import Product
from app.schemas.sale_schemas import SaleCreate
from fastapi import HTTPException

def create_sale(db: Session, sale: SaleCreate):
    db_product = db.query(Product).filter(Product.id == sale.product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="La pieza de joyería no fue encontrada.")
        
    if db_product.stock < sale.quantity:
        raise HTTPException(status_code=400, detail="No hay suficiente stock disponible de esta pieza.")

    db_product.stock -= sale.quantity

    db_sale = Sale(
        product_id=sale.product_id,
        quantity=sale.quantity,
        total_price=db_product.price * sale.quantity
    )
    
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    
    return db_sale