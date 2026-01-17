import { useMemo, useState } from "react";
import styles from "../styles/Documentos.module.css";
import { getVehiculos, getDocumentos, saveDocumentos, uid } from "../data/storage";

export default function Documentos() {
  const [vehiculos] = useState(getVehiculos());
  const [documentos, setDocumentos] = useState(getDocumentos());

  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(vehiculos[0]?.id ?? "");

  const initialForm = {
    vehiculoId: vehiculos[0]?.id ?? "",
    nombre: "",
    numero: "",
    entidad: "",
    vencimiento: "",
    notas: "",
  };

  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const hoy = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const diasEntre = (a, b) => Math.ceil((a - b) / (1000 * 60 * 60 * 24));

  const estadoDoc = (vencimientoStr) => {
    const fecha = new Date(vencimientoStr + "T00:00:00");
    const diffDias = diasEntre(fecha, hoy);

    if (diffDias < 0) return { texto: "Vencido", clase: styles.estadoVencido, dias: diffDias };
    if (diffDias <= 30) return { texto: "Por vencer", clase: styles.estadoPorVencer, dias: diffDias };
    return { texto: "Vigente", clase: styles.estadoVigente, dias: diffDias };
  };

  const documentosFiltrados = useMemo(() => {
    return documentos.filter((d) => String(d.vehiculoId) === String(vehiculoSeleccionado));
  }, [documentos, vehiculoSeleccionado]);

  const conteos = useMemo(() => {
    let vigente = 0, porVencer = 0, vencido = 0;
    documentosFiltrados.forEach((d) => {
      const e = estadoDoc(d.vencimiento).texto;
      if (e === "Vigente") vigente++;
      if (e === "Por vencer") porVencer++;
      if (e === "Vencido") vencido++;
    });
    return { vigente, porVencer, vencido };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentosFiltrados]);

  const setAndPersist = (next) => {
    setDocumentos(next);
    saveDocumentos(next);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
  };

  const validar = () => {
    if (!form.vehiculoId) return "Debes seleccionar un vehículo.";
    if (!form.nombre.trim()) return "El nombre del documento es obligatorio.";
    if (!form.numero.trim()) return "El número es obligatorio.";
    if (!form.entidad.trim()) return "La entidad es obligatoria.";
    if (!form.vencimiento) return "La fecha de vencimiento es obligatoria.";
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
      nombre: form.nombre.trim(),
      numero: form.numero.trim(),
      entidad: form.entidad.trim(),
      vencimiento: form.vencimiento,
      notas: form.notas.trim(),
    };

    if (editId) {
      const next = documentos.map((d) => (d.id === editId ? { ...d, ...payload } : d));
      setAndPersist(next);
    } else {
      const next = [{ id: uid(), ...payload }, ...documentos];
      setAndPersist(next);
    }
    resetForm();
  };

  const onEdit = (d) => {
    setEditId(d.id);
    setForm({
      vehiculoId: d.vehiculoId,
      nombre: d.nombre,
      numero: d.numero,
      entidad: d.entidad,
      vencimiento: d.vencimiento,
      notas: d.notas || "",
    });
  };

  const onDelete = (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este documento?")) return;
    const next = documentos.filter((d) => d.id !== id);
    setAndPersist(next);
    if (editId === id) resetForm();
  };

  const vehiculoActual = vehiculos.find((v) => String(v.id) === String(vehiculoSeleccionado));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Documentos</h2>
        <p className={styles.subtitle}>
          {vehiculoActual ? `Documentos de: ${vehiculoActual.nombre} (${vehiculoActual.placa})` : "Control de documentos"}
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
        <div className={styles.statCard}><span className={styles.statLabel}>Vigentes</span><span className={styles.statValue}>{conteos.vigente}</span></div>
        <div className={styles.statCard}><span className={styles.statLabel}>Por vencer (≤ 30 días)</span><span className={styles.statValue}>{conteos.porVencer}</span></div>
        <div className={styles.statCard}><span className={styles.statLabel}>Vencidos</span><span className={styles.statValue}>{conteos.vencido}</span></div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>{editId ? "Editar documento" : "Agregar documento"}</h3>
        {error && <div className={styles.alert}>{error}</div>}

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span>Documento *</span>
              <input name="nombre" value={form.nombre} onChange={onChange} placeholder="Ej: SOAT" />
            </label>

            <label className={styles.field}>
              <span>Número *</span>
              <input name="numero" value={form.numero} onChange={onChange} placeholder="Ej: SOAT-88921" />
            </label>

            <label className={styles.field}>
              <span>Entidad *</span>
              <input name="entidad" value={form.entidad} onChange={onChange} placeholder="Ej: Aseguradora / CDA / RUNT" />
            </label>

            <label className={styles.field}>
              <span>Vencimiento *</span>
              <input type="date" name="vencimiento" value={form.vencimiento} onChange={onChange} />
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
        <h3 className={styles.cardTitle}>Listado de documentos</h3>

        {documentosFiltrados.length === 0 ? (
          <p>No hay documentos registrados para este vehículo.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Documento</th><th>Número</th><th>Entidad</th><th>Vencimiento</th><th>Estado</th><th>Notas</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {documentosFiltrados.map((d) => {
                  const est = estadoDoc(d.vencimiento);
                  const extra = est.texto === "Vigente" ? "" : ` (${Math.abs(est.dias)} día(s))`;
                  return (
                    <tr key={d.id}>
                      <td>{d.nombre}</td>
                      <td>{d.numero}</td>
                      <td>{d.entidad}</td>
                      <td>{d.vencimiento}</td>
                      <td><span className={`${styles.estado} ${est.clase}`}>{est.texto}{extra}</span></td>
                      <td>{d.notas || "-"}</td>
                      <td className={styles.rowActions}>
                        <button className={styles.mini} onClick={() => onEdit(d)}>Editar</button>
                        <button className={`${styles.mini} ${styles.miniDanger}`} onClick={() => onDelete(d.id)}>Eliminar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
