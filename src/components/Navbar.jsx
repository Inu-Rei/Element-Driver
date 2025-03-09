import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login"); // ✅ Se usa navigate en vez de window.location.href
  };

  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li><Link to="/" className="nav-link">Inicio</Link></li>
        <li><Link to="/about" className="nav-link">Acerca de</Link></li>
        <li><Link to="/contact" className="nav-link">Contacto</Link></li>
        <li><Link to="/user" className="nav-link">Usuario</Link></li>
        <li>
          <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
