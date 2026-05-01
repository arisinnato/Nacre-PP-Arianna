import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Inventory from './Inventory';
import Sales from './Sales';
import logo from '../assets/Logotipo.png';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('inventario');
  const navigate = useNavigate(); 

  // función para cerrar sesion
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); 
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 relative">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-8 flex flex-col">
        <div className="mb-12">
          <img 
            src={logo} 
            alt="Nacre Logo" 
            className="w-32 h-auto object-contain" 
          />
        </div>
        
        <nav className="flex-1 space-y-6 text-sm">
          <button 
            onClick={() => setActiveTab('inventario')}
            className={`flex items-center w-full uppercase tracking-tighter transition-all ${
              activeTab === 'inventario' 
              ? 'text-[#a87e0c] font-medium border-b border-[#a87e0c] pb-1'
              : 'text-gray-400 hover:text-[#a87e0c]'
            }`}
          >
            Inventario
          </button>
          <button 
            onClick={() => setActiveTab('ventas')}
            className={`flex items-center w-full uppercase tracking-tighter transition-all ${
              activeTab === 'ventas' 
              ? 'text-[#a87e0c] font-medium border-b border-[#a87e0c] pb-1' 
              : 'text-gray-400 hover:text-[#a87e0c]' 
            }`}
          >
            Ventas
          </button>
        </nav>
        
        {/*boton para cerrar sesion*/}
        <button 
          onClick={handleLogout}
          className="text-gray-300 text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors text-left"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12 overflow-y-auto">
        {activeTab === 'inventario' ? <Inventory /> : <Sales />}
      </div>
    </div>
  );
};

export default Dashboard;