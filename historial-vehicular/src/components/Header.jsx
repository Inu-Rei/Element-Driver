import React from "react";
import styles from "../styles/Header.module.css";
import LoginModal from "../components/LoginModal";



const Header = () => {
  return (
    <header className={styles.header}>
      <h1>ELEMENT DRIVER</h1>
      <nav className={styles.navbar}>
        <a href="/">Inicio</a>
        <a href="/vehiculos">Vehículos</a>
        <a href="/mantenimientos">Mantenimientos</a>
        <a href="/documentos">Documentos</a>
        <a href="/contacto">Contacto</a>
        <a href="/login">Iniciar sesión</a>
      </nav>
    </header>
  );
};

export default Header;
