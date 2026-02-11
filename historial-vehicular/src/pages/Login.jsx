import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Si venías de una ruta protegida, ProtectedRoute la guardó aquí
  const redirectTo = location.state?.from || "/vehiculos";

  const handleSubmit = (e) => {
    e.preventDefault();

    const u = usuario.trim();
    const p = clave.trim();

    if (u === "admin" && p === "1234") {
      localStorage.setItem("auth", "true");
      navigate(redirectTo, { replace: true });
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  const handleUsuario = (e) => {
    setUsuario(e.target.value);
    if (error) setError("");
  };

  const handleClave = (e) => {
    setClave(e.target.value);
    if (error) setError("");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Inicio de Sesión</h2>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={handleUsuario}
            autoComplete="username"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={clave}
            onChange={handleClave}
            autoComplete="current-password"
            required
          />

          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}
