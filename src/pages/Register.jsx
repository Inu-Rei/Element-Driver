import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [cedula, setCedula] = useState("");
  const [celular, setCelular] = useState("");
  const [direccion, setDireccion] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Guardar datos en localStorage (simulación, luego se usará base de datos)
    localStorage.setItem("user", JSON.stringify({ 
      nombre, 
      apellidos,
      cedula,
      celular,
      direccion,
      fechaNacimiento,
      email, 
      password 
    }));

    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    navigate("/login"); // Redirige a login
  };

  return (
    <div className="register-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleRegister}>
        <label>Nombre:</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

        <label>Apellidos:</label>
        <input type="text" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />

        <label>Cédula:</label>
        <input type="text" value={cedula} onChange={(e) => setCedula(e.target.value)} required />

        <label>Celular:</label>
        <input type="text" value={celular} onChange={(e) => setCelular(e.target.value)} required />

        <label>Dirección:</label>
        <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />

        <label>Fecha de Nacimiento:</label>
        <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Contraseña:</label>
        <div className="password-container">
          <input 
            type={showPassword ? "text" : "password"} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button 
  type="button" 
  className="toggle-password" 
  style={{
    width: "300px",  // Ajusta el ancho
    height: "30px", // Ajusta la altura
    fontSize: "35px", // Reduce el tamaño del icono
    padding: "0",
    border: "none",
    background: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }} 
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword ? "🙈" : "👁️"}
</button>

        </div>

        <button type="submit">Registrarse</button>
      </form>
      <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a></p>
    </div>
  );
}

export default Register;
