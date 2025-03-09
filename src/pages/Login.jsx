import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "ronaldramossierra@hotmail.com" && password === "1234") {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/");
    } else {
      alert("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="login-page">
      {/* Video de fondo */}
      <video autoPlay loop muted playsInline className="background-video">
        <source src="/videos/inicio_de_sesion.mp4" type="video/mp4" />
        Tu navegador no soporta el video.
      </video>
      <div className="branding">
          <h1 className="app-name">Element Driver</h1>
        </div>
      {/* Contenedor del login */}
      <div className="login-container">
        {/* Sección izquierda: Branding */}
        

        {/* Sección derecha: Formulario */}
        <div className="login-form">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Iniciar Sesión</button>
          </form>
          <a href="#">¿Olvidaste tu contraseña?</a>
          <a href="/register">Crear cuenta nueva</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
