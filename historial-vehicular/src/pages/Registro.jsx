// ✅ src/pages/Registro.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

const API = "https://backend-element-driver.onrender.com/api";

export default function Registro() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const u = usuario.trim();
    const p = clave.trim();

    if (u.length < 3) return setError("El usuario debe tener mínimo 3 caracteres.");
    if (p.length < 4) return setError("La contraseña debe tener mínimo 4 caracteres.");

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "No se pudo registrar.");
        return;
      }

      // ✅ Loguear de una
      localStorage.setItem("auth", "true");
      localStorage.setItem("userId", String(data.userId));
      localStorage.setItem("username", data.username || u);

      navigate("/vehiculos", { replace: true });
    } catch {
      setError("No se pudo conectar con el backend.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Crear usuario</h2>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario (min 3)"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username"
            required
          />

          <input
            type="password"
            placeholder="Contraseña (min 4)"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            autoComplete="new-password"
            required
          />

          <button type="submit">Crear cuenta</button>

          <Link to="/login" style={{ display: "block", marginTop: 12, fontWeight: "bold" }}>
            Ya tengo cuenta
          </Link>
        </form>
      </div>
    </div>
  );
}
