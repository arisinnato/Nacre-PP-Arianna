from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import sale_schemas
from app.services import sale_service

router = APIRouter(
    prefix="/api/sales", 
    tags=["Ventas"]
)

@router.get("/") 
def get_sales(db: Session = Depends(get_db)):
    return sale_service.get_all_sales(db)

@router.post("/")
def create_sale(sale_data: sale_schemas.SaleCreate, db: Session = Depends(get_db)):
    try:
        # Modificado: Usamos sale_data.status para que acepte tanto "pedido" como "vendido"
        return sale_service.create_sale(db, sale_data, status=sale_data.status)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno al registrar la venta: {e}")

@router.patch("/{sale_id}/status")
def update_status(sale_id: int, new_status: str, db: Session = Depends(get_db)):
    updated_sale = sale_service.update_sale_status(db, sale_id, new_status)
    if not updated_sale:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    return updated_sale

@router.delete("/{sale_id}")
def delete_sale(sale_id: int, db: Session = Depends(get_db)):
    return sale_service.delete_sale(db, sale_id)