// ✅ src/pages/Mantenimientos.jsx
import { useEffect, useMemo, useState } from "react";
import styles from "../styles/Mantenimientos.module.css";

const API = "https://backend-element-driver.onrender.com/api";

export default function Mantenimientos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);

  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(
    localStorage.getItem("vehiculoMants") || ""
  );
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const initialForm = {
    vehiculoId: "",
    fecha: "",
    tipo: "",
    km: "",
    costo: "",
    descripcion: "",
  };

  const [form, setForm] = useState(initialForm);

  const userId = localStorage.getItem("userId") || "";
  const headersAuth = { "x-user-id": userId };

  const cargarVehiculos = async () => {
    try {
      const res = await fetch(`${API}/vehiculos`, { headers: headersAuth });
      const data = await res.json().catch(() => []);
      const arr = Array.isArray(data) ? data : [];
      setVehiculos(arr);

      if (arr.length > 0) {
        const guardado = localStorage.getItem("vehiculoMants");
        const existe = guardado && arr.some((v) => String(v.id) === String(guardado));
        const idFinal = existe ? String(guardado) : String(arr[0].id);

        setVehiculoSeleccionado(idFinal);
        localStorage.setItem("vehiculoMants", idFinal);
        setForm((p) => ({ ...p, vehiculoId: idFinal }));
      } else {
        setVehiculoSeleccionado("");
        setForm((p) => ({ ...p, vehiculoId: "" }));
      }
    } catch {
      setVehiculos([]);
      setError("No se pudo cargar la lista de vehículos (backend).");
    }
  };

  const cargarMantenimientos = async (vehiculoId) => {
    if (!vehiculoId) {
      setMantenimientos([]);
      return;
    }

    try {
      const res = await fetch(`${API}/mantenimientos?vehiculoId=${vehiculoId}`, {
        headers: headersAuth,
      });
      const data = await res.json().catch(() => []);
      setMantenimientos(Array.isArray(data) ? data : []);
    } catch {
      setMantenimientos([]);
      setError("No se pudo cargar mantenimientos (backend).");
    }
  };

  useEffect(() => {
    cargarVehiculos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    cargarMantenimientos(vehiculoSeleccionado);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehiculoSeleccionado]);

  const list = useMemo(() => {
    return (Array.isArray(mantenimientos) ? mantenimientos : [])
      .slice()
      .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  }, [mantenimientos]);

  const totalGastado = useMemo(
    () => list.reduce((acc, m) => acc + (Number(m.costo) || 0), 0),
    [list]
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
  };

  const validar = () => {
    if (!form.vehiculoId) return "Debes seleccionar un vehículo.";
    if (!form.fecha) return "La fecha es obligatoria.";
    if (!form.tipo.trim()) return "El tipo es obligatorio.";
    if (String(form.km).trim() === "") return "El kilometraje es obligatorio.";
    if (String(form.costo).trim() === "") return "El costo es obligatorio.";
    return "";
  };

  const resetForm = () => {
    setForm((p) => ({
      ...initialForm,
      vehiculoId: vehiculoSeleccionado || "",
    }));
    setEditId(null);
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const msg = validar();
    if (msg) return setError(msg);

    const payload = {
      vehiculoId: Number(form.vehiculoId),
      fecha: form.fecha,
      tipo: form.tipo.trim(),
      km: Number(form.km),
      costo: Number(form.costo),
      descripcion: form.descripcion.trim(),
    };

    try {
      const url = editId ? `${API}/mantenimientos/${editId}` : `${API}/mantenimientos`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...headersAuth },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Error guardando mantenimiento en el backend.");
        return;
      }

      resetForm();
      await cargarMantenimientos(vehiculoSeleccionado);
    } catch {
      setError("No se pudo conectar con el backend para guardar.");
    }
  };

  const onEdit = (m) => {
    setEditId(m.id);
    setForm({
      vehiculoId: String(m.vehiculoId ?? vehiculoSeleccionado ?? ""),
      fecha: m.fecha ?? "",
      tipo: m.tipo ?? "",
      km: String(m.km ?? ""),
      costo: String(m.costo ?? ""),
      descripcion: m.descripcion ?? "",
    });
    setError("");
  };

  const onDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este mantenimiento?")) return;

    try {
      const res = await fetch(`${API}/mantenimientos/${id}`, {
        method: "DELETE",
        headers: headersAuth,
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Error eliminando mantenimiento en el backend.");
        return;
      }

      if (editId === id) resetForm();
      await cargarMantenimientos(vehiculoSeleccionado);
    } catch {
      setError("No se pudo conectar con el backend para eliminar.");
    }
  };

  const vehiculoActual = vehiculos.find((v) => String(v.id) === String(vehiculoSeleccionado));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Mantenimientos</h2>
        <p className={styles.subtitle}>
          {vehiculoActual
            ? `Vehículo: ${vehiculoActual.marca ?? ""} ${vehiculoActual.modelo ?? ""} (${vehiculoActual.placa ?? ""})`
            : "Registro de mantenimientos"}
        </p>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Seleccionar vehículo</h3>
        <div className={styles.grid}>
          <label className={styles.field}>
            <span>Vehículo *</span>
            <select
              className={styles.select}
              value={vehiculoSeleccionado}
              onChange={(e) => {
                const id = e.target.value;
                setVehiculoSeleccionado(id);
                localStorage.setItem("vehiculoMants", id);
                setForm((p) => ({ ...p, vehiculoId: id }));
                setEditId(null);
                setError("");
              }}
            >
              {vehiculos.length === 0 ? (
                <option value="">No hay vehículos</option>
              ) : (
                vehiculos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.placa} — {v.marca} {v.modelo}
                  </option>
                ))
              )}
            </select>
          </label>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Registros</span>
          <span className={styles.statValue}>{list.length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total gastado</span>
          <span className={styles.statValue}>${totalGastado.toLocaleString("es-CO")}</span>
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>{editId ? "Editar mantenimiento" : "Agregar mantenimiento"}</h3>
        {error && <div className={styles.alert}>{error}</div>}

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span>Fecha *</span>
              <input type="date" name="fecha" value={form.fecha} onChange={onChange} />
            </label>

            <label className={styles.field}>
              <span>Tipo *</span>
              <input name="tipo" value={form.tipo} onChange={onChange} placeholder="Ej: Cambio de aceite" />
            </label>

            <label className={styles.field}>
              <span>Kilometraje (km) *</span>
              <input name="km" value={form.km} onChange={onChange} placeholder="Ej: 24500" />
            </label>

            <label className={styles.field}>
              <span>Costo (COP) *</span>
              <input name="costo" value={form.costo} onChange={onChange} placeholder="Ej: 95000" />
            </label>

            <label className={`${styles.field} ${styles.fieldFull}`}>
              <span>Descripción</span>
              <input
                name="descripcion"
                value={form.descripcion}
                onChange={onChange}
                placeholder="Ej: Aceite + filtro / detalles"
              />
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
        <h3 className={styles.cardTitle}>Historial de mantenimientos</h3>

        {list.length === 0 ? (
          <p>No hay mantenimientos para este vehículo.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Km</th>
                  <th>Costo</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {list.map((m) => (
                  <tr key={m.id}>
                    <td>{m.fecha}</td>
                    <td>{m.tipo}</td>
                    <td>{(Number(m.km) || 0).toLocaleString("es-CO")}</td>
                    <td>${(Number(m.costo) || 0).toLocaleString("es-CO")}</td>
                    <td>{m.descripcion || "-"}</td>
                    <td className={styles.rowActions}>
                      <button className={styles.mini} onClick={() => onEdit(m)}>
                        Editar
                      </button>
                      <button className={`${styles.mini} ${styles.miniDanger}`} onClick={() => onDelete(m.id)}>
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
