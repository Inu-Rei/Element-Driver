import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/login"; // 🔹 Recarga la página para ocultar el Navbar
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/about">Acerca de</Link></li>
        <li><Link to="/contact">Contacto</Link></li>
        <li><Link to="/user">Usuario</Link></li>
        <li><button onClick={handleLogout}>Cerrar Sesión</button></li>
      </ul>
    </nav>
  );
}

export default Navbar;
