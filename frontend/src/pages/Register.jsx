import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
      const response = await fetch('http://localhost:8000/register', {
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
    <div className="min-h-screen flex items-center justify-center bg-nacre-light font-sans py-12">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-nacre-gold/20 backdrop-blur-sm bg-white/90">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif text-nacre-dark tracking-wide">Nacre</h1>
          <p className="text-nacre-gold mt-3 font-light tracking-widest text-sm uppercase">Crear Cuenta Admin</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100 text-center font-medium">
            ¡Registro exitoso! Redirigiendo al login...
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Registrarse
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta? <Link to="/login" className="text-nacre-gold font-medium hover:underline transition-all">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
