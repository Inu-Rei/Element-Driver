import { useMemo, useState } from "react";
import styles from "../styles/Vehiculos.module.css";


export default function Vehiculos() {
  // ✅ Datos simulados (luego se reemplazan por backend)
  const [vehiculos, setVehiculos] = useState([
    {
      id: 1,
      placa: "ABC12D",
      marca: "Yamaha",
      modelo: "FZ 2.0",
      anio: 2022,
      cilindraje: 149,
      color: "Negro",
      propietario: "Ronald Ramos",
      kmActual: 24500,
      notas: "Moto principal",
    },
    {
      id: 2,
      placa: "XYZ98K",
      marca: "Honda",
      modelo: "CB 190R",
      anio: 2020,
      cilindraje: 184,
      color: "Rojo",
      propietario: "Ronald Ramos",
      kmActual: 23000,
      notas: "",
    },
  ]);

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

  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

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
    // Permite letras/números sin espacios. (Formato flexible)
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

  const existePlaca = (placa, idIgnorar = null) => {
    const p = placa.trim().toUpperCase();
    return vehiculos.some((v) => v.placa.toUpperCase() === p && v.id !== idIgnorar);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const msg = validar();
    if (msg) return setError(msg);

    const placaUp = form.placa.trim().toUpperCase();

    if (existePlaca(placaUp, editId)) {
      setError("Ya existe un vehículo con esa placa.");
      return;
    }

    const payload = {
      placa: placaUp,
      marca: form.marca.trim(),
      modelo: form.modelo.trim(),
      anio: Number(form.anio),
      cilindraje: Number(form.cilindraje),
      color: form.color.trim(),
      propietario: form.propietario.trim(),
      kmActual: Number(form.kmActual),
      notas: form.notas.trim(),
    };

    if (editId) {
      setVehiculos((prev) => prev.map((v) => (v.id === editId ? { ...v, ...payload } : v)));
    } else {
      setVehiculos((prev) => [{ id: Date.now(), ...payload }, ...prev]);
    }

    resetForm();
  };

  const onEdit = (v) => {
    setEditId(v.id);
    setForm({
      placa: v.placa,
      marca: v.marca,
      modelo: v.modelo,
      anio: String(v.anio),
      cilindraje: String(v.cilindraje),
      color: v.color,
      propietario: v.propietario,
      kmActual: String(v.kmActual),
      notas: v.notas || "",
    });
    setError("");
  };

  const onDelete = (id) => {
    const ok = window.confirm("¿Seguro que deseas eliminar este vehículo?");
    if (!ok) return;
    setVehiculos((prev) => prev.filter((v) => v.id !== id));
    if (editId === id) resetForm();
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Vehículos</h2>
        <p className={styles.subtitle}>Registra y administra los vehículos del conductor.</p>
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
              <input
                name="placa"
                placeholder="Ej: ABC12D"
                value={form.placa}
                onChange={onChange}
              />
            </label>

            <label className={styles.field}>
              <span>Marca *</span>
              <input
                name="marca"
                placeholder="Ej: Yamaha"
                value={form.marca}
                onChange={onChange}
              />
            </label>

            <label className={styles.field}>
              <span>Modelo *</span>
              <input
                name="modelo"
                placeholder="Ej: FZ 2.0"
                value={form.modelo}
                onChange={onChange}
              />
            </label>

            <label className={styles.field}>
              <span>Año *</span>
              <input
                type="number"
                name="anio"
                placeholder="Ej: 2022"
                value={form.anio}
                onChange={onChange}
                min="1950"
              />
            </label>

            <label className={styles.field}>
              <span>Cilindraje (cc) *</span>
              <input
                type="number"
                name="cilindraje"
                placeholder="Ej: 149"
                value={form.cilindraje}
                onChange={onChange}
                min="1"
              />
            </label>

            <label className={styles.field}>
              <span>Color *</span>
              <input
                name="color"
                placeholder="Ej: Negro"
                value={form.color}
                onChange={onChange}
              />
            </label>

            <label className={styles.field}>
              <span>Propietario *</span>
              <input
                name="propietario"
                placeholder="Ej: Ronald Ramos"
                value={form.propietario}
                onChange={onChange}
              />
            </label>

            <label className={styles.field}>
              <span>Kilometraje actual *</span>
              <input
                type="number"
                name="kmActual"
                placeholder="Ej: 24500"
                value={form.kmActual}
                onChange={onChange}
                min="0"
              />
            </label>

            <label className={`${styles.field} ${styles.fieldFull}`}>
              <span>Notas</span>
              <input
                name="notas"
                placeholder="Opcional"
                value={form.notas}
                onChange={onChange}
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
                    <td>{Number(v.kmActual).toLocaleString("es-CO")}</td>
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
