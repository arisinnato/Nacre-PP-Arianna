import React, { useState, useEffect } from 'react';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    stock: '', 
    category_id: '' 
  });  
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  //Carga las categorías al montar el componente
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error cargando categorías:", err));
  }, []);

  //Carga los productos
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos de Nacre recibidos:", data)
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error cargando productos:', error);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      name: newProduct.name,
      description: newProduct.description || "",
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      category_id: parseInt(newProduct.category_id), //Enviamos la categoría
      is_active: true
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit)
      });
      if (response.ok) {
        closeModal();
        window.location.reload();
      }
    } catch (err) { console.error("Error de red:", err); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const dataToUpdate = {
      name: newProduct.name,
      description: newProduct.description || "",
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      category_id: parseInt(newProduct.category_id), //También al actualizar
      is_active: true
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUpdate)
      });
      if (response.ok) {
        closeModal();
        window.location.reload();
      }
    } catch (err) { console.error("Error al actualizar:", err); }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    //cargamos los datos incluyendo el id de la categoría actual
    setNewProduct({
      ...product,
      category_id: product.category_id || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setNewProduct({ name: '', description: '', price: '', stock: '', category_id: '' });
  };

  const handleSale = async (product) => {
    if (product.stock <= 0) {
      alert("No hay stock disponible.");
      return;
    }

    const response = await fetch('http://127.0.0.1:8000/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: product.id,
        quantity: 1
      })
    });

    if (response.ok) {
      alert(`¡Venta de ${product.name} registrada!`);
      window.location.reload();
    }
  };

  return (
    <>
      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-light mb-2 italic">Inventario</h2>
          <p className="text-gray-400 text-sm tracking-wide">Gestión de piezas de Nacre.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-6 py-2 rounded-sm hover:bg-gray-800 transition-all uppercase text-[10px] tracking-widest"
        >
          + Añadir Pieza
        </button>
      </header>

      <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden text-sm">
        {loading ? (
          <p className="p-8 text-center text-gray-400 italic">Cargando tus joyas...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-medium text-xs uppercase tracking-widest">Producto</th>
                <th className="p-4 font-medium text-xs uppercase tracking-widest text-right">Precio</th>
                <th className="p-4 font-medium text-xs uppercase tracking-widest text-right">Stock</th>
                <th className="p-4 font-medium text-xs uppercase tracking-widest text-center">Estado</th>
                <th className="p-4 font-medium text-xs uppercase tracking-widest text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products && products.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-tighter italic">
                      {product.category?.name || 'Sin Categoría'}
                    </div>
                  </td>
                  <td className="p-4 text-right">${product.price.toFixed(2)}</td>
                  <td className="p-4 text-right font-mono">{product.stock}</td>
                  <td className="p-4 text-center">
                    {product.stock <= 0 ? (
                      <span className="px-2 py-1 text-[9px] uppercase tracking-tighter rounded-full bg-red-50 text-red-600 font-bold">Agotado</span>
                    ) : (
                      <span className="px-2 py-1 text-[9px] uppercase tracking-tighter rounded-full bg-green-50 text-green-600">Disponible</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-6">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="text-gray-400 hover:text-black transition-colors text-[10px] uppercase tracking-widest underline decoration-gray-200 underline-offset-4"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleSale(product)}
                        className="text-green-600 hover:text-green-900 transition-colors text-[10px] uppercase tracking-widest underline decoration-green-100 underline-offset-4 font-medium"
                      >
                        Vender
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-10 rounded-sm shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-serif mb-8 uppercase tracking-[0.2em]">{editingProduct ? 'Editar Pieza' : 'Nueva Pieza'}</h3>
            <form onSubmit={editingProduct ? handleUpdate : handleSubmit} className="space-y-6">
              
              {/* SELECTOR DE CATEGORÍA */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Categoría</label>
                <select 
                  className="w-full border-b border-gray-200 p-2 outline-none focus:border-black transition-colors bg-transparent text-sm"
                  value={newProduct.category_id}
                  onChange={(e) => setNewProduct({...newProduct, category_id: e.target.value})}
                  required
                >
                  <option value="">Seleccionar colección...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <input placeholder="Nombre de la pieza" value={newProduct.name} className="w-full border-b border-gray-200 p-2 outline-none focus:border-black transition-colors text-sm" onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} required />
              
              <textarea placeholder="Descripción (Materiales, detalles...)" value={newProduct.description} className="w-full border-b border-gray-200 p-2 outline-none focus:border-black transition-colors h-16 resize-none text-sm" onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} />
              
              <div className="flex gap-8">
                <div className="w-1/2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Precio ($)</label>
                  <input type="number" step="0.01" placeholder="0.00" value={newProduct.price} className="w-full border-b border-gray-200 p-2 outline-none focus:border-black transition-colors font-mono text-sm" onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} required />
                </div>
                <div className="w-1/2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Stock</label>
                  <input type="number" placeholder="0" value={newProduct.stock} className="w-full border-b border-gray-200 p-2 outline-none focus:border-black transition-colors font-mono text-sm" onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} required />
                </div>
              </div>

              <div className="flex justify-end gap-6 mt-12 pt-4">
                <button type="button" onClick={closeModal} className="text-gray-400 text-[10px] uppercase tracking-widest hover:text-black transition-colors">Cancelar</button>
                <button type="submit" className="bg-black text-white px-8 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-gray-800 shadow-lg transition-all">{editingProduct ? 'Actualizar' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Inventory;