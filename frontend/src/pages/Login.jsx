import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        // navigate('/dashboard'); // Por implementar
        alert('Login exitoso. Bienvenido a Nacre.');
      } else {
        const data = await response.json();
        setError(data.detail || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-nacre-light font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-nacre-gold/20 backdrop-blur-sm bg-white/90">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif text-nacre-dark tracking-wide">Nacre</h1>
          <p className="text-nacre-gold mt-3 font-light tracking-widest text-sm uppercase">Panel de Administración</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-nacre-gold focus:border-transparent transition-all outline-none bg-gray-50/50"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-nacre-gold focus:border-transparent transition-all outline-none bg-gray-50/50"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-nacre-dark text-white py-3.5 rounded-lg font-medium hover:bg-black transition-all shadow-md hover:shadow-lg mt-8"
          >
            Ingresar
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          ¿No tienes cuenta? <Link to="/register" className="text-nacre-gold font-medium hover:underline transition-all">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}
