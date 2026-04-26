import React, { useState } from 'react';
import Inventory from './Inventory';
import Sales from './Sales';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('inventario');

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 relative">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-8 flex flex-col">
        <h1 className="text-2xl font-serif tracking-widest font-bold mb-12 uppercase">Nacre</h1>
        <nav className="flex-1 space-y-6 text-sm">
          <button 
            onClick={() => setActiveTab('inventario')}
            className={`flex items-center w-full uppercase tracking-tighter transition-all ${activeTab === 'inventario' ? 'text-black font-medium border-b border-black pb-1' : 'text-gray-400 hover:text-black'}`}
          >
            Inventario
          </button>
          <button 
            onClick={() => setActiveTab('ventas')}
            className={`flex items-center w-full uppercase tracking-tighter transition-all ${activeTab === 'ventas' ? 'text-black font-medium border-b border-black pb-1' : 'text-gray-400 hover:text-black'}`}
          >
            Ventas
          </button>
        </nav>
        <button className="text-gray-300 text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors text-left">
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