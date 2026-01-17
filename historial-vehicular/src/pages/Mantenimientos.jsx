import { useMemo, useState } from "react";
import styles from "../styles/Mantenimientos.module.css";
import { getVehiculos, getMantenimientos, saveMantenimientos, uid } from "../data/storage";

export default function Mantenimientos() {
  const [vehiculos] = useState(getVehiculos());
  const [mantenimientos, setMantenimientos] = useState(getMantenimientos());

  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(vehiculos[0]?.id ?? "");

  const initialForm = {
    vehiculoId: vehiculos[0]?.id ?? "",
    fecha: "",
    tipo: "",
    km: "",
    taller: "",
    costo: "",
    notas: "",
  };

  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const list = useMemo(() => {
    return mantenimientos
      .filter((m) => String(m.vehiculoId) === String(vehiculoSeleccionado))
      .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  }, [mantenimientos, vehiculoSeleccionado]);

  const totalGastado = useMemo(() => list.reduce((acc, m) => acc + (Number(m.costo) || 0), 0), [list]);

  const setAndPersist = (next) => {
    setMantenimientos(next);
    saveMantenimientos(next);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
  };

  const validar = () => {
    if (!form.vehiculoId) return "Debes seleccionar un vehículo.";
    if (!form.fecha) return "La fecha es obligatoria.";
    if (!form.tipo.trim()) return "El tipo es obligatorio.";
    if (!String(form.km).trim()) return "El kilometraje es obligatorio.";
    if (!form.taller.trim()) return "El taller es obligatorio.";
    if (!String(form.costo).trim()) return "El costo es obligatorio.";
    return "";
  };

  const resetForm = () => {
    setForm((p) => ({ ...initialForm, vehiculoId: vehiculoSeleccionado }));
    setEditId(null);
    setError("");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const msg = validar();
    if (msg) return setError(msg);

    const payload = {
      vehiculoId: Number(form.vehiculoId),
      fecha: form.fecha,
      tipo: form.tipo.trim(),
      km: Number(form.km),
      taller: form.taller.trim(),
      costo: Number(form.costo),
      notas: form.notas.trim(),
    };

    if (editId) {
      const next = mantenimientos.map((m) => (m.id === editId ? { ...m, ...payload } : m));
      setAndPersist(next);
    } else {
      const next = [{ id: uid(), ...payload }, ...mantenimientos];
      setAndPersist(next);
    }
    resetForm();
  };

  const onEdit = (m) => {
    setEditId(m.id);
    setForm({
      vehiculoId: m.vehiculoId,
      fecha: m.fecha,
      tipo: m.tipo,
      km: m.km,
      taller: m.taller,
      costo: m.costo,
      notas: m.notas || "",
    });
  };

  const onDelete = (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este mantenimiento?")) return;
    const next = mantenimientos.filter((m) => m.id !== id);
    setAndPersist(next);
    if (editId === id) resetForm();
  };

  const vehiculoActual = vehiculos.find((v) => String(v.id) === String(vehiculoSeleccionado));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Mantenimientos</h2>
        <p className={styles.subtitle}>
          {vehiculoActual ? `Vehículo: ${vehiculoActual.nombre} (${vehiculoActual.placa})` : "Registro de mantenimientos"}
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
                setVehiculoSeleccionado(e.target.value);
                setForm((p) => ({ ...p, vehiculoId: e.target.value }));
                setEditId(null);
                setError("");
              }}
            >
              {vehiculos.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.placa} — {v.nombre}
                </option>
              ))}
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
              <span>Taller *</span>
              <input name="taller" value={form.taller} onChange={onChange} placeholder="Ej: MotoCenter" />
            </label>

            <label className={styles.field}>
              <span>Costo (COP) *</span>
              <input name="costo" value={form.costo} onChange={onChange} placeholder="Ej: 95000" />
            </label>

            <label className={`${styles.field} ${styles.fieldFull}`}>
              <span>Notas</span>
              <input name="notas" value={form.notas} onChange={onChange} placeholder="Opcional" />
            </label>
          </div>

          <div className={styles.actions}>
            <button className={styles.btn} type="submit">{editId ? "Guardar cambios" : "Agregar"}</button>
            {editId && <button className={styles.btnSecondary} type="button" onClick={resetForm}>Cancelar</button>}
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
                  <th>Fecha</th><th>Tipo</th><th>Km</th><th>Taller</th><th>Costo</th><th>Notas</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {list.map((m) => (
                  <tr key={m.id}>
                    <td>{m.fecha}</td>
                    <td>{m.tipo}</td>
                    <td>{Number(m.km).toLocaleString("es-CO")}</td>
                    <td>{m.taller}</td>
                    <td>${Number(m.costo).toLocaleString("es-CO")}</td>
                    <td>{m.notas || "-"}</td>
                    <td className={styles.rowActions}>
                      <button className={styles.mini} onClick={() => onEdit(m)}>Editar</button>
                      <button className={`${styles.mini} ${styles.miniDanger}`} onClick={() => onDelete(m.id)}>Eliminar</button>
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
