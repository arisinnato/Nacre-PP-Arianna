import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Storefront from "./pages/Storefront";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Esta es la cara pública: nacre.com */}
        <Route path="/" element={<Storefront />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/" element={<Navigate to= "/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;