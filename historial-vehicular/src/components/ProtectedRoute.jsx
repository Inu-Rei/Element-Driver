import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const location = useLocation();
  const isAuth = localStorage.getItem("auth") === "true";

  if (!isAuth) {
    // ✅ Guarda la ruta completa (pathname + search + hash)
    const from = location.pathname + location.search + location.hash;

    return <Navigate to="/login" replace state={{ from }} />;
  }

  return <Outlet />;
}
