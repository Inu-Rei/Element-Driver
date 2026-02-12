import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/Header.module.css";
import logo from "../assets/elementdriver.png";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isAuth = localStorage.getItem("auth") === "true";

  // ✅ NEW: nombre del usuario logueado
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  // ✅ NEW: refrescar username si cambia el storage (por si abre otra pestaña)
  useEffect(() => {
    const sync = () => {
      setUsername(localStorage.getItem("username") || "");
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("userId");     // ✅ NEW
    localStorage.removeItem("username");   // ✅ NEW
    setUsername("");                       // ✅ NEW
    setOpen(false);
    navigate("/login");
  };

  // ✅ cerrar menú al cambiar de ruta
  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <header className={styles.header}>
      <Link
        to="/"
        className={styles.logoLink}
        aria-label="Ir al inicio"
        onClick={() => setOpen(false)}
      >
        <img src={logo} alt="Element Driver" className={styles.logoImage} />
      </Link>

      {/* ✅ Botón hamburguesa solo en móvil */}
      <button
        className={styles.burger}
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir menú"
        aria-expanded={open}
      >
        ☰
      </button>

      <nav className={`${styles.navbar} ${open ? styles.navOpen : ""}`}>
        <Link to="/" onClick={() => setOpen(false)}>Inicio</Link>

        {isAuth && (
          <>
            <Link to="/vehiculos" onClick={() => setOpen(false)}>Vehículos</Link>
            <Link to="/mantenimientos" onClick={() => setOpen(false)}>Mantenimientos</Link>
            <Link to="/documentos" onClick={() => setOpen(false)}>Documentos</Link>
          </>
        )}

        <Link to="/contacto" onClick={() => setOpen(false)}>Contacto</Link>

        {/* ✅ NEW: Mostrar usuario logueado */}
        {isAuth && (
  <div className={styles.userChip} title={username || "Usuario"}>
    <div className={styles.avatar}>
      {(username || "U").slice(0, 1).toUpperCase()}
    </div>
    <div className={styles.userText}>
      <span className={styles.userHello}>Hola,</span>
      <span className={styles.userNameStrong}>{username || "Usuario"}</span>
    </div>
  </div>
)}


        {isAuth ? (
          <button className={styles.loginBtn} onClick={handleLogout}>
            Cerrar sesión
          </button>
        ) : (
          <button className={styles.loginBtn} onClick={() => go("/login")}>
            Iniciar sesión
          </button>
        )}
      </nav>
    </header>
  );
}
