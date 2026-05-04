import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/Logotipo.png';
import { API_BASE_URL } from '../apiConfig';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        
       const text = await response.text(); 
       const data = text ? JSON.parse(text) : {};

        if (response.ok) {
          localStorage.setItem('token', data.access_token);
          navigate('/dashboard');
          window.location.reload(); 
        } else {
          setError(data.detail || 'Credenciales inválidas');
        }
      } catch (err) {
        console.error("Fallo de red:", err);
        setError('Error al conectar con el servidor');
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <div className="bg-white p-10 shadow-2xl w-full max-w-md border border-gray-100">
        
        <div className="flex flex-col items-center mb-10">
          <img 
            src={logo} 
            alt="Nacre Logo" 
            className="h-20 w-auto mb-4 object-contain" 
          />
          <p className="text-gray-400 font-light tracking-widest text-[10px] uppercase">
            Administración
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs rounded-sm border border-red-100 text-center uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Usuario</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-b border-gray-200 focus:border-[#a87e0c] transition-all outline-none bg-transparent text-sm"
              required 
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-b border-gray-200 focus:border-[#a87e0c] transition-all outline-none bg-transparent text-sm"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-[#a87e0c] text-white py-4 text-[10px] uppercase tracking-[0.3em] hover:bg-[#8e6a0a] transition-all shadow-lg mt-8"
          >
            Entrar
          </button>
        </form>
        
        <div className="mt-12 flex justify-between items-center">
             <Link to="/" className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-black transition-all">← Volver a la tienda</Link>
             <Link to="/register" className="text-[9px] uppercase tracking-widest text-[#a87e0c] hover:underline">Registro</Link>
        </div>
      </div>
    </div>
  );
}