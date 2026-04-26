import React, { useState, useEffect } from 'react';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar el historial de ventas desde el backend
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/sales')
      .then((response) => response.json())
      .then((data) => {
        setSales(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error cargando ventas:', error);
        setLoading(false);
      });
  }, []);

const totalRevenue = Array.isArray(sales) ? sales.reduce((acc, sale) => acc + sale.total_price, 0) : 0;

  return (
    <>
      <header className="mb-12">
        <h2 className="text-4xl font-light mb-2 italic">Ventas</h2>
        <p className="text-gray-400 text-sm tracking-wide">Historial de transacciones y flujo de ingresos de Nacre.</p>
      </header>
      
      {/* Resumen de ingresos rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Ingresos Totales</p>
          <p className="text-3xl font-serif">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Piezas Vendidas</p>
          <p className="text-3xl font-serif">{sales.length} <span className="text-sm font-sans text-gray-400 uppercase">uds.</span></p>
        </div>
      </div>

      {/* Tabla de Historial */}
      <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden text-sm">
        {loading ? (
          <p className="p-8 text-center text-gray-400 italic">Cargando historial...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-medium text-xs uppercase tracking-widest text-gray-400">Fecha</th>
                <th className="p-4 font-medium text-xs uppercase tracking-widest text-gray-400">ID Venta</th>
                <th className="p-4 font-medium text-xs uppercase tracking-widest text-gray-400">Cant.</th>
                <th className="p-4 font-medium text-xs uppercase tracking-widest text-gray-400 text-right">Monto Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.length > 0 ? (
                sales.map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-gray-600">
                      {new Date(sale.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-mono text-xs text-gray-400">#00{sale.id}</td>
                    <td className="p-4">{sale.quantity} und.</td>
                    <td className="p-4 text-right font-medium">${sale.total_price.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-gray-400 italic">
                    Aún no se han registrado ventas en el sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Sales;