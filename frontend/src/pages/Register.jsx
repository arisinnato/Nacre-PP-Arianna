import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/Logotipo.png';
import { API_BASE_URL } from '../apiConfig';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const data = await response.json();
        setError(data.detail || 'Error al registrar el usuario');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans py-12">
      <div className="bg-white p-10 shadow-2xl w-full max-w-md border border-gray-100">
        
        <div className="flex flex-col items-center mb-10">
          <img 
            src={logo} 
            alt="Nacre Logo" 
            className="h-20 w-auto mb-4 object-contain" 
          />
          <p className="text-gray-400 font-light tracking-widest text-[10px] uppercase">
            Crear Cuenta Admin
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs rounded-sm border border-red-100 text-center uppercase tracking-widest">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-3 bg-green-50 text-[#598B2C] text-xs rounded-sm border border-green-100 text-center font-medium uppercase tracking-widest">
            ¡Registro exitoso! Redirigiendo...
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">Usuario</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border-b border-gray-200 focus:border-[#a87e0c] transition-all outline-none bg-transparent text-sm"
              required 
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-b border-gray-200 focus:border-[#a87e0c] transition-all outline-none bg-transparent text-sm"
              required 
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border-b border-gray-200 focus:border-[#a87e0c] transition-all outline-none bg-transparent text-sm"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-[#a87e0c] text-white py-4 text-[10px] uppercase tracking-[0.3em] hover:bg-[#8e6a0a] transition-all shadow-lg mt-8"
          >
            Registrarse
          </button>
        </form>
        
        <div className="mt-10 text-center">
          <Link 
            to="/login" 
            className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-[#a87e0c] transition-all"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}