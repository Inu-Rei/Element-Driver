import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Header.module.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink} aria-label="Ir al inicio">
        <h1 style={{ margin: 0, fontSize: "18px", color: "#222" }}>ELEMENT DRIVER</h1>
      </Link>

      <nav className={styles.navbar}>
        <Link to="/">Inicio</Link>
        <Link to="/vehiculos">Vehículos</Link>
        <Link to="/mantenimientos">Mantenimientos</Link>
        <Link to="/documentos">Documentos</Link>
        <Link to="/contacto">Contacto</Link>

        {/* Si quieres que sea botón, usa loginBtn */}
        <button className={styles.loginBtn} onClick={() => navigate("/login")}>
          Iniciar sesión
        </button>
      </nav>
    </header>
  );
};

export default Header;
