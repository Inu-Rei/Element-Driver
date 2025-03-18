import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Ocultar la Navbar si estamos en la página de login
  if (location.pathname === "/login") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li><Link to="/" className="nav-link">Inicio</Link></li>
        <li>
          <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
