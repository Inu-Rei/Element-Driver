import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";

import Header from "./components/Header";
import Home from "./pages/Home";
import Vehiculos from "./pages/Vehiculos";
import Mantenimientos from "./pages/Mantenimientos";
import Documentos from "./pages/Documentos";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

export default function App() {
  const location = useLocation();
  const isAuth = localStorage.getItem("auth") === "true";

  // Oculta header en login (puedes agregar más rutas si quieres)
  const hideHeaderRoutes = ["/login"];
  const hideHeader = hideHeaderRoutes.includes(location.pathname);

  // ✅ Guarda la última ruta visitada (solo si está logueado y es una ruta protegida)
  useEffect(() => {
    if (!isAuth) return;

    const protectedPaths = ["/vehiculos", "/mantenimientos", "/documentos"];
    const current = location.pathname + location.search + location.hash;

    if (protectedPaths.includes(location.pathname)) {
      localStorage.setItem("lastPath", current);
    }
  }, [location, isAuth]);

  const lastPath = localStorage.getItem("lastPath") || "/vehiculos";

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contacto" element={<Contacto />} />

        {/* ✅ Si ya está logueado, /login lo manda a la última ruta */}
        <Route
          path="/login"
          element={isAuth ? <Navigate to={lastPath} replace /> : <Login />}
        />

        {/* ✅ Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/mantenimientos" element={<Mantenimientos />} />
          <Route path="/documentos" element={<Documentos />} />
        </Route>

        {/* ✅ Ruta no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
