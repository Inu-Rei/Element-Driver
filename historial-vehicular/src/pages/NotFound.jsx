import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ margin: 0 }}>404</h2>
      <p style={{ opacity: 0.8 }}>La página que buscas no existe.</p>

      <Link to="/" style={{ color: "#007bff", textDecoration: "none", fontWeight: 700 }}>
        Volver al inicio
      </Link>
    </div>
  );
}
