import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import logo from '../assets/Logotipo.png';

const Storefront = ({ onAddToCart, openCart, cart }) => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('Todos');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
      })
      .catch(err => console.error("Error cargando productos:", err));
  }, []);

  const filteredProducts = category === 'Todos' 
    ? products 
    : products.filter(p => p.category?.name === category);

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div 
            onClick={() => setCategory('Todos')} 
            className="cursor-pointer"
          >
            <img 
                src={logo} 
                alt="Nacre Logo" 
                className="h-16 w-auto transition-transform hover:scale-105" 
            />
          </div>

          <div className="hidden md:flex space-x-12 text-[11px] uppercase tracking-[0.2em] font-medium">
            {['Todos', 'Collares', 'Pulseras', 'Zarcillos'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setCategory(cat)}
                className={`transition-all duration-300 pb-1 ${
                  category === cat 
                  ? 'text-[#a87e0c] border-b-2 border-[#a87e0c]'
                  : 'text-gray-400 hover:text-[#a87e0c]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div 
            onClick={openCart} 
            className="relative cursor-pointer group flex items-center"
          >
            <span className="text-[#a87e0c] text-[10px] uppercase tracking-widest font-bold hover:text-gray-500 transition-colors">
              Carrito
            </span>
            <span className="ml-2 bg-[#a87e0c] text-white text-[9px] px-2 py-0.5 rounded-full min-w-[20px] text-center">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </div>
        </div>
      </nav>

      <header className="py-20 text-center">
        <h2 className="text-5xl font-light italic font-serif mb-4 text-[#a87e0c]">Elegancia en cada detalle</h2>
        <p className="text-gray-400 uppercase text-[10px] tracking-[0.3em]">Joyas artesanales hechas para ti</p>
      </header>

      <main className="max-w-7xl mx-auto px-8 pb-20">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {filteredProducts.map(product => (
              <div key={product.id} className="group">
                <div className="aspect-[3/4] bg-gray-50 mb-6 flex items-center justify-center overflow-hidden relative border border-transparent group-hover:border-gray-100 transition-all">
                  
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="text-[10px] uppercase tracking-widest text-gray-300 italic font-serif">
                      Nacre Piece
                    </div>
                  )}
                  
                  <button 
                    onClick={() => onAddToCart(product)}
                    className="absolute bottom-0 w-full bg-[#a87e0c] text-white py-4 text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 z-10"
                  >
                    AÑADIR AL CARRITO
                  </button>
                </div>
                
                <h3 className="text-sm font-medium uppercase tracking-tight mb-1 text-zinc-800">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-[11px] mb-3 italic font-serif">
                  {product.category?.name || 'Colección Nacre'}
                </p>
                <p className="text-sm font-mono text-black">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <p className="text-gray-400 italic text-sm font-serif">
              Próximamente más piezas de esta colección...
            </p>
          </div>
        )}
      </main>

      <footer className="mt-20 py-10 border-t border-gray-50 flex justify-center items-center">
        <Link 
          to="/login" 
          className="text-[8px] text-gray-200 hover:text-[#a87e0c] transition-colors tracking-[0.3em] uppercase"
        >
          © 2026 NACRE
        </Link>
      </footer>
    </div>
  );
};

export default Storefront;