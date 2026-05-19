from sqlalchemy.orm import Session
from app.models.sale import Sale
from app.models.products import Product
from fastapi import HTTPException
from app.schemas.sale_schemas import SaleCreate

def get_all_sales(db: Session):
    return db.query(Sale).all()

def create_sale(db: Session, sale: SaleCreate):
    db_product = db.query(Product).filter(Product.id == sale.product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
        
    if db_product.stock < sale.quantity:
        raise HTTPException(status_code=400, detail="Stock insuficiente")

    db_product.stock -= sale.quantity
    db_sale = Sale(
        product_id=sale.product_id,
        quantity=sale.quantity,
        total_price=db_product.price * sale.quantity
        #status="completed"
    )
    
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

def update_sale_status(db: Session, sale_id: int, new_status: str):
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        return None
    
    sale.status = new_status
    db.commit()
    db.refresh(sale)
    return sale


def delete_sale(db: Session, sale_id: int):
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    
    if not sale:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    
    
    if sale.status == "vendido":
        raise HTTPException(status_code=400, detail="No se pueden eliminar ventas ya completadas")
    
    db.delete(sale)
    db.commit()
    return True