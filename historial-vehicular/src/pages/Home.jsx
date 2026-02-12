// ✅ src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import VehicleCard from "../components/VehicleCard";
import FeatureCard from "../components/FeatureCard";
import styles from "../styles/Home.module.css";

const API = "https://backend-element-driver.onrender.com/api";

export default function Home() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId") || "";
  const isAuth = localStorage.getItem("auth") === "true";
  const headersAuth = { "x-user-id": userId };

  const [vehiculos, setVehiculos] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const handleRegistration = () => {
    if (!isAuth) return navigate("/login");
    navigate("/vehiculos");
  };

  useEffect(() => {
    const cargarTodo = async () => {
      if (!isAuth || !userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [rVeh, rM, rD] = await Promise.all([
          fetch(`${API}/vehiculos`, { headers: headersAuth }),
          fetch(`${API}/mantenimientos`, { headers: headersAuth }),
          fetch(`${API}/documentos`, { headers: headersAuth }),
        ]);

        const veh = await rVeh.json().catch(() => []);
        const mant = await rM.json().catch(() => []);
        const docs = await rD.json().catch(() => []);

        if (!rVeh.ok || !rM.ok || !rD.ok) {
          setError("No se pudo cargar el resumen. Inicia sesión de nuevo.");
          setLoading(false);
          return;
        }

        setVehiculos(Array.isArray(veh) ? veh : []);
        setMantenimientos(Array.isArray(mant) ? mant : []);
        setDocumentos(Array.isArray(docs) ? docs : []);
      } catch (e) {
        setError("No se pudo conectar con el backend (puede estar despertando en Render).");
      } finally {
        setLoading(false);
      }
    };

    cargarTodo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hoy = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const diasEntre = (a, b) => Math.ceil((a - b) / (1000 * 60 * 60 * 24));

  const estadoDoc = (vencimientoStr) => {
    const fecha = new Date((vencimientoStr || "") + "T00:00:00");
    if (!vencimientoStr) return { texto: "Sin fecha", dias: 999999 };
    const diffDias = diasEntre(fecha, hoy);
    if (diffDias < 0) return { texto: "Vencido", dias: diffDias };
    if (diffDias <= 30) return { texto: "Por vencer", dias: diffDias };
    return { texto: "Vigente", dias: diffDias };
  };

  const alertas = useMemo(() => {
    const vencidos = [];
    const porVencer = [];

    documentos.forEach((d) => {
      const e = estadoDoc(d.fechaVencimiento);
      if (e.texto === "Vencido") vencidos.push({ ...d, dias: e.dias });
      if (e.texto === "Por vencer") porVencer.push({ ...d, dias: e.dias });
    });

    porVencer.sort((a, b) => a.dias - b.dias);
    return { vencidos, porVencer };
  }, [documentos]);

  const ultimosMantenimientos = useMemo(() => {
    const copia = [...mantenimientos];
    copia.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
    return copia.slice(0, 3);
  }, [mantenimientos]);

  const totalGastado = useMemo(() => {
    return mantenimientos.reduce((acc, m) => acc + (Number(m.costo) || 0), 0);
  }, [mantenimientos]);

  const motorcycleSvg =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 140' style='background:%23f8f9fa'%3E%3Crect x='60' y='75' width='80' height='15' rx='8' fill='%234169E1'/%3E%3Ccircle cx='40' cy='100' r='15' fill='%23333' stroke='%23666' stroke-width='2'/%3E%3Ccircle cx='160' cy='100' r='15' fill='%23333' stroke='%23666' stroke-width='2'/%3E%3Crect x='55' y='70' width='20' height='6' rx='3' fill='%23666'/%3E%3Crect x='120' y='85' width='25' height='5' rx='2' fill='%23666'/%3E%3Crect x='70' y='65' width='25' height='8' rx='4' fill='%23222'/%3E%3Crect x='85' y='60' width='20' height='12' rx='6' fill='%234169E1'/%3E%3Ctext x='100' y='130' text-anchor='middle' fill='%23666' font-family='Arial' font-size='12'%3EMotocicleta%3C/text%3E%3C/svg%3E";

  const carSvg =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 140' style='background:%23f8f9fa'%3E%3Crect x='30' y='80' width='140' height='25' rx='12' fill='%23DC143C'/%3E%3Crect x='50' y='65' width='100' height='18' rx='9' fill='%23DC143C'/%3E%3Crect x='60' y='70' width='25' height='12' rx='6' fill='%23ADD8E6' opacity='0.8'/%3E%3Crect x='115' y='70' width='25' height='12' rx='6' fill='%23ADD8E6' opacity='0.8'/%3E%3Ccircle cx='55' cy='110' r='12' fill='%23333' stroke='%23666' stroke-width='2'/%3E%3Ccircle cx='145' cy='110' r='12' fill='%23333' stroke='%23666' stroke-width='2'/%3E%3Ccircle cx='175' cy='90' r='5' fill='%23FFFF99'/%3E%3Ccircle cx='25' cy='90' r='4' fill='%23FF6B6B'/%3E%3Ctext x='100' y='130' text-anchor='middle' fill='%23666' font-family='Arial' font-size='12'%3EAutomóvil%3C/text%3E%3C/svg%3E";

  const features = [
    { icon: "🔧", title: "Control de Mantenimientos", description: "Programa y rastrea todos los servicios de mantenimiento de tus vehículos." },
    { icon: "💰", title: "Gestión de Gastos", description: "Registra tus gastos y mira el total invertido." },
    { icon: "📄", title: "Documentos Organizados", description: "SOAT, Tecno, Seguros, todo en un solo lugar." },
    { icon: "⏰", title: "Recordatorios", description: "Alertas de vencimientos y mantenimientos." },
  ];

  return (
    <div className={styles.homePage}>
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>ELEMENT DRIVER</h1>
          <p className={styles.heroSubtitle}>Tu historial de moto y carro en un solo lugar</p>

          <div className={styles.vehiclesSection}>
            <VehicleCard title="Motocicleta" description="Historial completo de tu moto" imageSvg={motorcycleSvg} />
            <VehicleCard title="Automóvil" description="Gastos, documentos y mantenimientos" imageSvg={carSvg} />
          </div>

          <div className={styles.ctaSection}>
            <button className={styles.ctaButton} onClick={handleRegistration}>
              Registrar mi vehículo
            </button>
          </div>
        </div>
      </section>

      <section className={styles.dashboardSection}>
        <div className={styles.heroContainer}>
          <h2 className={styles.dashboardTitle}>Resumen rápido</h2>

          {!isAuth ? (
            <div className={styles.dashboardBox}>
              <p className={styles.muted}>Inicia sesión para ver tu resumen ✅</p>
              <button className={styles.primaryBtn} onClick={() => navigate("/login")}>
                Ir a Login
              </button>
            </div>
          ) : loading ? (
            <div className={styles.dashboardBox}>
              <p className={styles.muted}>Cargando datos...</p>
            </div>
          ) : error ? (
            <div className={styles.dashboardBox}>
              <p className={styles.muted}>{error}</p>
              <button className={styles.primaryBtn} onClick={() => window.location.reload()}>
                Reintentar
              </button>
            </div>
          ) : (
            <>
              <div className={styles.dashboardStats}>
                <div className={styles.dashboardCard}>
                  <span className={styles.dashboardLabel}>Vehículos</span>
                  <span className={styles.dashboardValue}>{vehiculos.length}</span>
                </div>

                <div className={styles.dashboardCard}>
                  <span className={styles.dashboardLabel}>Mantenimientos</span>
                  <span className={styles.dashboardValue}>{mantenimientos.length}</span>
                </div>

                <div className={styles.dashboardCard}>
                  <span className={styles.dashboardLabel}>Total gastado</span>
                  <span className={styles.dashboardValue}>${totalGastado.toLocaleString("es-CO")}</span>
                </div>

                <div className={styles.dashboardCard}>
                  <span className={styles.dashboardLabel}>Alertas documentos</span>
                  <span className={styles.dashboardValue}>
                    {alertas.vencidos.length + alertas.porVencer.length}
                  </span>
                </div>
              </div>

              <div className={styles.dashboardGrid}>
                <div className={styles.dashboardBox}>
                  <h3 className={styles.boxTitle}>Alertas de documentos</h3>

                  {alertas.vencidos.length === 0 && alertas.porVencer.length === 0 ? (
                    <p className={styles.muted}>No tienes alertas por ahora ✅</p>
                  ) : (
                    <div className={styles.alertList}>
                      {alertas.vencidos.map((d) => (
                        <div key={d.id} className={`${styles.alertItem} ${styles.alertDanger}`}>
                          <div>
                            <strong>{d.tipo}</strong>
                            <div className={styles.muted}>
                              Venció hace {Math.abs(d.dias)} día(s) • {d.fechaVencimiento || "-"}
                            </div>
                          </div>
                          <button className={styles.linkBtn} onClick={() => navigate("/documentos")}>
                            Ver
                          </button>
                        </div>
                      ))}

                      {alertas.porVencer.map((d) => (
                        <div key={d.id} className={`${styles.alertItem} ${styles.alertWarn}`}>
                          <div>
                            <strong>{d.tipo}</strong>
                            <div className={styles.muted}>
                              Vence en {d.dias} día(s) • {d.fechaVencimiento || "-"}
                            </div>
                          </div>
                          <button className={styles.linkBtn} onClick={() => navigate("/documentos")}>
                            Ver
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.dashboardBox}>
                  <h3 className={styles.boxTitle}>Últimos mantenimientos</h3>

                  {ultimosMantenimientos.length === 0 ? (
                    <p className={styles.muted}>Aún no tienes mantenimientos ✅</p>
                  ) : (
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Tipo</th>
                            <th>Km</th>
                            <th>Costo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ultimosMantenimientos.map((m) => (
                            <tr key={m.id}>
                              <td>{m.fecha}</td>
                              <td>{m.tipo}</td>
                              <td>{(Number(m.km) || 0).toLocaleString("es-CO")}</td>
                              <td>${(Number(m.costo) || 0).toLocaleString("es-CO")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className={styles.quickActions}>
                    <button className={styles.primaryBtn} onClick={() => navigate("/mantenimientos")}>
                      Ir a Mantenimientos
                    </button>
                    <button className={styles.linkBtn} onClick={() => navigate("/vehiculos")}>
                      Ver Vehículos
                    </button>
                    <button className={styles.linkBtn} onClick={() => navigate("/documentos")}>
                      Ver Documentos
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.featuresTitle}>¿Por qué elegir Element Driver?</h2>

          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
