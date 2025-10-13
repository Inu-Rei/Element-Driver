import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Vehiculos from "./pages/Vehiculos";
import Mantenimientos from "./pages/Mantenimientos";
import Documentos from "./pages/Documentos";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";

export default function App() {
  const location = useLocation(); // 👈 Esto nos dice en qué página estamos
  const hideHeader = location.pathname === "/login"; // 👈 Si estamos en /login, se oculta el Header

  return (
    <>
      {!hideHeader && <Header />} {/* 👈 Solo muestra el Header si NO estamos en /login */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vehiculos" element={<Vehiculos />} />
        <Route path="/mantenimientos" element={<Mantenimientos />} />
        <Route path="/documentos" element={<Documentos />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}
