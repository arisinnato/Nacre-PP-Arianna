import pandas as pd
from io import BytesIO

def export_sales_to_excel(sales_data):
    # Transformamos la lista de objetos en un formato que Pandas entienda
    data = []
    for sale in sales_data:
        data.append({
            "ID Venta": sale.id,
            "Producto": sale.product.name if sale.product else "N/A",
            "Cantidad": sale.quantity,
            "Total ($)": sale.total_price,
            "Fecha": sale.created_at.strftime("%Y-%m-%d %H:%M"),
            "Estado": sale.status
        })
    
    df = pd.DataFrame(data)
    
    # Creamos un archivo virtual en memoria
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Ventas Nacre')
    
    return output.getvalue()