// ✅ src/pages/Vehiculos.jsx
import { useMemo, useState, useEffect } from "react";
import styles from "../styles/Vehiculos.module.css";

const API = "https://backend-element-driver.onrender.com/api";

export default function Vehiculos() {
  const initialForm = {
    placa: "",
    marca: "",
    modelo: "",
    anio: "",
    cilindraje: "",
    color: "",
    propietario: "",
    kmActual: "",
    notas: "",
  };

  const [vehiculos, setVehiculos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId") || "";
  const headersAuth = { "x-user-id": userId };

  const cargarVehiculos = async () => {
    try {
      const res = await fetch(`${API}/vehiculos`, { headers: headersAuth });
      const data = await res.json().catch(() => []);
      setVehiculos(Array.isArray(data) ? data : []);
      setError("");
    } catch {
      setVehiculos([]);
      setError("No se pudo conectar con el backend.");
    }
  };

  useEffect(() => {
    cargarVehiculos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalVehiculos = vehiculos.length;

  const promedioKm = useMemo(() => {
    if (vehiculos.length === 0) return 0;
    const suma = vehiculos.reduce((acc, v) => acc + (Number(v.kmActual) || 0), 0);
    return Math.round(suma / vehiculos.length);
  }, [vehiculos]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
  };

  const validarPlaca = (p) => {
    const placa = p.trim().toUpperCase();
    if (placa.length < 5) return false;
    return /^[A-Z0-9]+$/.test(placa);
  };

  const validar = () => {
    if (!validarPlaca(form.placa)) return "La placa es obligatoria y debe ser válida (sin espacios).";
    if (!form.marca.trim()) return "La marca es obligatoria.";
    if (!form.modelo.trim()) return "El modelo es obligatorio.";
    if (!form.anio || Number(form.anio) < 1950) return "El año debe ser válido.";
    if (!form.cilindraje || Number(form.cilindraje) <= 0) return "El cilindraje debe ser mayor a 0.";
    if (!form.color.trim()) return "El color es obligatorio.";
    if (!form.propietario.trim()) return "El propietario es obligatorio.";
    if (form.kmActual === "" || Number(form.kmActual) < 0) return "El km actual debe ser 0 o mayor.";
    return "";
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const msg = validar();
    if (msg) return setError(msg);

    const payload = {
      placa: form.placa.trim().toUpperCase(),
      marca: form.marca.trim(),
      modelo: form.modelo.trim(),
      anio: Number(form.anio),
      cilindraje: Number(form.cilindraje),
      color: form.color.trim(),
      propietario: form.propietario.trim(),
      kmActual: Number(form.kmActual),
      notas: form.notas.trim(),
    };

    try {
      const url = editId ? `${API}/vehiculos/${editId}` : `${API}/vehiculos`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...headersAuth },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Error guardando en el backend.");
        return;
      }

      resetForm();
      await cargarVehiculos();
    } catch {
      setError("No se pudo conectar con el backend.");
    }
  };

  const onEdit = (v) => {
    setEditId(v.id);
    setForm({
      placa: v.placa ?? "",
      marca: v.marca ?? "",
      modelo: v.modelo ?? "",
      anio: String(v.anio ?? ""),
      cilindraje: String(v.cilindraje ?? ""),
      color: v.color ?? "",
      propietario: v.propietario ?? "",
      kmActual: String(v.kmActual ?? ""),
      notas: v.notas ?? "",
    });
    setError("");
  };

  const onDelete = async (id) => {
    const ok = window.confirm("¿Seguro que deseas eliminar este vehículo?");
    if (!ok) return;

    try {
      const res = await fetch(`${API}/vehiculos/${id}`, {
        method: "DELETE",
        headers: headersAuth,
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Error eliminando en el backend.");
        return;
      }

      if (editId === id) resetForm();
      await cargarVehiculos();
    } catch {
      setError("No se pudo conectar con el backend.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Vehículos</h2>
        <p className={styles.subtitle}>Registra y administra tus vehículos.</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Vehículos</span>
          <span className={styles.statValue}>{totalVehiculos}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Promedio km</span>
          <span className={styles.statValue}>{promedioKm.toLocaleString("es-CO")}</span>
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>{editId ? "Editar vehículo" : "Agregar vehículo"}</h3>
        {error && <div className={styles.alert}>{error}</div>}

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span>Placa *</span>
              <input name="placa" placeholder="Ej: ABC12D" value={form.placa} onChange={onChange} />
            </label>

            <label className={styles.field}>
              <span>Marca *</span>
              <input name="marca" placeholder="Ej: Yamaha" value={form.marca} onChange={onChange} />
            </label>

            <label className={styles.field}>
              <span>Modelo *</span>
              <input name="modelo" placeholder="Ej: FZ 2.0" value={form.modelo} onChange={onChange} />
            </label>

            <label className={styles.field}>
              <span>Año *</span>
              <input type="number" name="anio" value={form.anio} onChange={onChange} min="1950" />
            </label>

            <label className={styles.field}>
              <span>Cilindraje (cc) *</span>
              <input type="number" name="cilindraje" value={form.cilindraje} onChange={onChange} min="1" />
            </label>

            <label className={styles.field}>
              <span>Color *</span>
              <input name="color" value={form.color} onChange={onChange} />
            </label>

            <label className={styles.field}>
              <span>Propietario *</span>
              <input name="propietario" value={form.propietario} onChange={onChange} />
            </label>

            <label className={styles.field}>
              <span>Kilometraje actual *</span>
              <input type="number" name="kmActual" value={form.kmActual} onChange={onChange} min="0" />
            </label>

            <label className={`${styles.field} ${styles.fieldFull}`}>
              <span>Notas</span>
              <input name="notas" value={form.notas} onChange={onChange} />
            </label>
          </div>

          <div className={styles.actions}>
            <button className={styles.btn} type="submit">
              {editId ? "Guardar cambios" : "Agregar"}
            </button>

            {editId && (
              <button className={styles.btnSecondary} type="button" onClick={resetForm}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Listado de vehículos</h3>

        {vehiculos.length === 0 ? (
          <p>No hay vehículos registrados.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Año</th>
                  <th>Cc</th>
                  <th>Color</th>
                  <th>Propietario</th>
                  <th>Km</th>
                  <th>Notas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vehiculos.map((v) => (
                  <tr key={v.id}>
                    <td>{v.placa}</td>
                    <td>{v.marca}</td>
                    <td>{v.modelo}</td>
                    <td>{v.anio}</td>
                    <td>{v.cilindraje}</td>
                    <td>{v.color}</td>
                    <td>{v.propietario}</td>
                    <td>{(Number(v.kmActual) || 0).toLocaleString("es-CO")}</td>
                    <td>{v.notas || "-"}</td>
                    <td className={styles.rowActions}>
                      <button className={styles.mini} onClick={() => onEdit(v)}>
                        Editar
                      </button>
                      <button className={`${styles.mini} ${styles.miniDanger}`} onClick={() => onDelete(v.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
