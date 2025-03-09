import React from "react";
import "../styles/ErrorPage.css"; // Asegúrate de que este archivo existe

const ErrorPage = () => {
  return (
    <div className="error-container">
     <video autoPlay loop muted className="error-video">
  <source src="/videos/explosion.mp4" type="video/mp4" />
  Tu navegador no soporta videos.
</video>
      <div className="error-content">
        <h1>Error 404</h1>
        <p>Parece que esta página explotó 💥</p>
        <button onClick={() => (window.location.href = "/")}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
