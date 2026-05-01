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
  const [imageFile, setImageFile] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error cargando categorías:", err));
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Por favor selecciona una imagen para la pieza.");
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description || "");
    formData.append('price', newProduct.price);
    formData.append('stock', newProduct.stock);
    formData.append('category_id', newProduct.category_id);
    formData.append('image', imageFile);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/products', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        closeModal();
        window.location.reload();
      }
    } catch (err) { 
      console.error("Error de red:", err); 
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description || "");
    formData.append('price', newProduct.price);
    formData.append('stock', newProduct.stock);
    formData.append('category_id', newProduct.category_id);
    
    // solo se envia la imagen si se seleccionó un archivo nuevo
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/${editingProduct.id}`, {
        method: 'PUT',
        body: formData
      });
      
      if (response.ok) {
        closeModal();
        window.location.reload();
      } else {
        alert("Error al actualizar la pieza.");
      }
    } catch (err) { 
      console.error("Error al actualizar:", err); 
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewProduct({
      ...product,
      category_id: product.category_id || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setImageFile(null);
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
      body: JSON.stringify({ product_id: product.id, quantity: 1 })
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
          <h2 className="text-4xl font-light mb-2 italic text-zinc-800">Inventario</h2>
          <p className="text-gray-400 text-sm tracking-wide uppercase text-[10px] tracking-widest">Gestión de piezas de Nacre</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#a87e0c] text-white px-4 py-2 rounded-sm text-xs uppercase tracking-widest hover:bg-[#8e6a0a] transition-colors"
        >
          + Añadir Pieza
        </button>
      </header>

      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden text-sm">
        {loading ? (
          <p className="p-8 text-center text-gray-400 italic">Cargando tus joyas...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-4 font-medium text-[10px] uppercase tracking-widest text-gray-400">Pieza</th>
                <th className="p-4 font-medium text-[10px] uppercase tracking-widest text-gray-400 text-right">Precio</th>
                <th className="p-4 font-medium text-[10px] uppercase tracking-widest text-gray-400 text-right">Stock</th>
                <th className="p-4 font-medium text-[10px] uppercase tracking-widest text-gray-400 text-center">Estado</th>
                <th className="p-4 font-medium text-[10px] uppercase tracking-widest text-gray-400 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products && products.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                  <td className="p-4 flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 flex-shrink-0 overflow-hidden">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-300 italic">N/A</div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-zinc-900">{product.name}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-widest italic">
                        {product.category?.name || 'Sin Categoría'}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono">${product.price.toFixed(2)}</td>
                  <td className="p-4 text-right font-mono">{product.stock}</td>
                  <td className="p-4 text-center">
                    {product.stock <= 0 ? (
                      <span className="text-[9px] uppercase tracking-tighter text-red-400 font-bold italic">Agotado</span>
                    ) : (
                      <span className="text-[9px] uppercase tracking-tighter text-green-600">En Stock</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-6">
                      <button onClick={() => handleEdit(product)} className="text-gray-400 hover:text-black transition-colors text-[10px] uppercase tracking-widest underline underline-offset-4 decoration-gray-100">Editar</button>
                      <button onClick={() => handleSale(product)} className="text-zinc-400 hover:text-green-600 transition-colors text-[10px] uppercase tracking-widest">Vender</button>
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
          <div className="bg-white p-10 shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-serif mb-8 uppercase tracking-[0.2em] text-[#a87e0c]">
              {editingProduct ? 'Editar Pieza' : 'Nueva Pieza'}
            </h3>
            
            <form onSubmit={editingProduct ? handleUpdate : handleSubmit} className="space-y-6">
              
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-medium">Fotografía</label>
                <div className="border border-dashed border-gray-200 p-4 text-center hover:border-[#a87e0c] transition-all">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="hidden" 
                    id="image-upload" 
                  />
                  <label htmlFor="image-upload" className="cursor-pointer text-[10px] uppercase tracking-widest text-gray-500">
                    {imageFile ? `✓ ${imageFile.name}` : (editingProduct ? 'Cambiar Imagen' : '+ Seleccionar Imagen')}
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Categoría</label>
                <select className="w-full border-b border-gray-200 p-2 outline-none focus:border-[#a87e0c] transition-colors bg-transparent text-sm" value={newProduct.category_id} onChange={(e) => setNewProduct({...newProduct, category_id: e.target.value})} required>
                  <option value="">Seleccionar categoria...</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              <input placeholder="Nombre de la pieza" value={newProduct.name} className="w-full border-b border-gray-200 p-2 outline-none focus:border-[#a87e0c] transition-colors text-sm" onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} required />
              
              <div className="flex gap-8">
                <div className="w-1/2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Precio ($)</label>
                  <input type="number" step="0.01" placeholder="0.00" value={newProduct.price} className="w-full border-b border-gray-200 p-2 outline-none focus:border-[#a87e0c] transition-colors font-mono text-sm" onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} required />
                </div>
                <div className="w-1/2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Stock</label>
                  <input type="number" placeholder="0" value={newProduct.stock} className="w-full border-b border-gray-200 p-2 outline-none focus:border-[#a87e0c] transition-colors font-mono text-sm" onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} required />
                </div>
              </div>

              <div className="flex justify-end gap-6 mt-12 pt-4">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="text-[#a87e0c] text-[10px] uppercase tracking-widest hover:text-black transition-colors"
                >
                  Cancelar
                </button>
                
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="bg-[#a87e0c] text-white px-8 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-[#8e6a0a] shadow-lg transition-all disabled:bg-gray-300"
                >
                  {isUploading ? 'Procesando...' : (editingProduct ? 'Actualizar' : 'Publicar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Inventory;