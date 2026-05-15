from fpdf import FPDF
from io import BytesIO

class NacreReport(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'NACRE - REPORTE DE INVENTARIO', 0, 1, 'C')
        self.ln(10)

def generate_inventory_pdf(products):
    pdf = NacreReport()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    
    pdf.cell(80, 10, "Producto", 1)
    pdf.cell(40, 10, "Precio", 1)
    pdf.cell(40, 10, "Stock", 1)
    pdf.ln()
    
    for prod in products:
        pdf.cell(80, 10, prod.name, 1)
        pdf.cell(40, 10, f"${prod.price}", 1)
        pdf.cell(40, 10, str(prod.stock), 1)
        pdf.ln()
    
    return pdf.output(dest='S').encode('latin-1')