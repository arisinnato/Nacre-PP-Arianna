import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Storefront from "./pages/Storefront";
import { CartModal } from './pages/CartModal';

function App() {

  const isAuthenticated = !!localStorage.getItem('token');  

  const [cart, setCart] = useState([]); 
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  return (
    <BrowserRouter>
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
      />

      <Routes>
        <Route 
          path="/" 
          element={
            <Storefront 
              onAddToCart={addToCart} 
              openCart={() => setIsCartOpen(true)} 
              cart={cart}
            /> 
          } 
        />

        {/* si ya hay logueo, manda directo al dashboard */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        
        <Route path="/register" element={<Register />} />

        {/* si no hay token, manda al Login */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;