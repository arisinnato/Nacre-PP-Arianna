from sqlalchemy.orm import Session
from app.models.sale import Sale
from app.models.products import Product
from fastapi import HTTPException

def get_all_sales(db: Session):
    return db.query(Sale).all()

#crear venta. Esta sirve tanto para el dashboard como para whatsapp
def create_sale(db: Session, sale_data, status: str = "pedido"):
    product = db.query(Product).filter(Product.id == sale_data.product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    if product.stock < sale_data.quantity:
        raise HTTPException(status_code=400, detail="Stock insuficiente")
    
    total = product.price * sale_data.quantity

    new_sale = Sale(
        product_id=sale_data.product_id,
        quantity=sale_data.quantity,
        total_price=total,
        status=status 
    )

    product.stock -= sale_data.quantity

    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)
    return new_sale


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