import React, { useState, useEffect } from 'react';

const Storefront = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState('Todos');

  // Traer productos desde el backend de Nacre
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error cargando productos:", err));
  }, []);

  // Lógica del Catálogo Interactivo: Filtra los productos según la categoría seleccionada
  const filteredProducts = category === 'Todos' 
    ? products 
    : products.filter(p => p.category?.name === category);

  return (
    <div className="min-h-screen bg-white">
      {/* NAV BAR ESTILO NACRE */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          {/* LOGO */}
          <h1 
            onClick={() => setCategory('Todos')} 
            className="text-2xl font-serif tracking-[0.3em] font-bold uppercase cursor-pointer"
          >
            Nacre
          </h1>

          {/* CATEGORÍAS CENTRALES DINÁMICAS */}
          <div className="hidden md:flex space-x-12 text-[11px] uppercase tracking-[0.2em] font-medium">
            {['Todos', 'Collares', 'Pulseras', 'Zarcillos'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setCategory(cat)}
                className={`transition-all duration-300 pb-1 ${
                  category === cat 
                  ? 'text-black border-b border-black' 
                  : 'text-gray-400 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* CARRITO */}
          <div className="relative cursor-pointer group">
            <span className="text-[10px] uppercase tracking-widest font-bold">Carrito</span>
            <span className="ml-2 bg-black text-white text-[9px] px-2 py-0.5 rounded-full">
              {cart.length}
            </span>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - El toque elegante de tu marca */}
      <header className="py-20 text-center">
        <h2 className="text-5xl font-light italic font-serif mb-4">Elegancia en cada detalle</h2>
        <p className="text-gray-400 uppercase text-[10px] tracking-[0.3em]">Joyas artesanales hechas para ti</p>
      </header>

      {/* GRID DE PRODUCTOS INTERACTIVO */}
      <main className="max-w-7xl mx-auto px-8 pb-20">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {filteredProducts.map(product => (
              <div key={product.id} className="group cursor-pointer">
                {/* Contenedor de Imagen con Efecto Hover */}
                <div className="aspect-[3/4] bg-gray-50 mb-6 flex items-center justify-center overflow-hidden relative border border-transparent group-hover:border-gray-100 transition-all">
                  <div className="text-[10px] uppercase tracking-widest text-gray-300 italic font-serif">
                    Nacre Piece
                  </div>
                  
                  {/* Botón de añadir rápido */}
                  <button 
                    onClick={() => setCart([...cart, product])}
                    className="absolute bottom-0 w-full bg-black text-white py-4 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0"
                  >
                    Añadir al Carrito
                  </button>
                </div>
                
                {/* Información del Producto */}
                <h3 className="text-sm font-medium uppercase tracking-tight mb-1">
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
          /* Estado vacío si no hay productos en la categoría */
          <div className="text-center py-32">
            <p className="text-gray-400 italic text-sm font-serif">
              Próximamente más piezas de esta colección...
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Storefront;