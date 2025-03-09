import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function User() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verifica si el usuario está autenticado
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login"); // Si no está autenticado, lo manda a login
      return;
    }

    // Carga los datos del usuario desde localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      // Si no hay datos en localStorage, redirigir al login
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user"); // Borra los datos del usuario
    navigate("/login"); // Lo devuelve al login al cerrar sesión
  };

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div className="user-container">
      <h2>Perfil de Usuario</h2>
      <p><strong>Nombre:</strong> {user.nombre}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Cédula:</strong> {user.cedula}</p>
      <p><strong>Fecha de Nacimiento:</strong> {user.fechaNacimiento}</p>
      <p><strong>Dirección:</strong> {user.direccion}</p>

      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}

export default User;
