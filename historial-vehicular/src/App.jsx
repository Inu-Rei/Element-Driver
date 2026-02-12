import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";

import Header from "./components/Header";
import Home from "./pages/Home";
import Vehiculos from "./pages/Vehiculos";
import Mantenimientos from "./pages/Mantenimientos";
import Documentos from "./pages/Documentos";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

export default function App() {
  const location = useLocation();
  const isAuth = localStorage.getItem("auth") === "true";

  const hideHeader = location.pathname === "/login" || location.pathname === "/registro";

  const protectedPaths = ["/vehiculos", "/mantenimientos", "/documentos"];

  useEffect(() => {
    if (!isAuth) return;

    const current = location.pathname + location.search + location.hash;
    if (protectedPaths.includes(location.pathname)) {
      localStorage.setItem("lastPath", current);
    }
  }, [location.pathname, location.search, location.hash, isAuth]);

  const lastPath = localStorage.getItem("lastPath") || "/vehiculos";

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/contacto" element={<Contacto />} />

        <Route path="/login" element={isAuth ? <Navigate to={lastPath} replace /> : <Login />} />
        <Route path="/registro" element={isAuth ? <Navigate to={lastPath} replace /> : <Registro />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/mantenimientos" element={<Mantenimientos />} />
          <Route path="/documentos" element={<Documentos />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
