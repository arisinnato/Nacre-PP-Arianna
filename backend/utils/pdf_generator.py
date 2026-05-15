from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from io import BytesIO

def generate_inventory_pdf(products):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width / 2, height - 50, "NACRE - REPORTE DE INVENTARIO")
    
    c.setFont("Helvetica-Bold", 12)
    y = height - 100
    
    c.drawString(50, y, "Producto")
    c.drawString(300, y, "Precio")
    c.drawString(450, y, "Stock")
    
    c.line(50, y - 5, 550, y - 5)
    
    y -= 25
    c.setFont("Helvetica", 11)
    
    for prod in products:
        c.drawString(50, y, prod.name)
        c.drawString(300, y, f"${prod.price}")
        c.drawString(450, y, str(prod.stock))
        
        y -= 20
        if y < 50:
            c.showPage()
            y = height - 50
            c.setFont("Helvetica", 11)

    c.showPage()
    c.save()
    
    pdf_out = buffer.getvalue()
    buffer.close()
    return pdf_out