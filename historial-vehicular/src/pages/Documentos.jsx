// ✅ src/pages/Documentos.jsx
import { useEffect, useMemo, useState } from "react";
import styles from "../styles/Documentos.module.css";

const API = "https://backend-element-driver.onrender.com/api";

export default function Documentos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [documentos, setDocumentos] = useState([]);

  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(
    localStorage.getItem("vehiculoDocs") || ""
  );
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const initialForm = {
    vehiculoId: "",
    tipo: "",
    numero: "",
    fechaVencimiento: "",
    notas: "",
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
        const guardado = localStorage.getItem("vehiculoDocs");
        const existe = guardado && arr.some((v) => String(v.id) === String(guardado));
        const idFinal = existe ? String(guardado) : String(arr[0].id);

        setVehiculoSeleccionado(idFinal);
        localStorage.setItem("vehiculoDocs", idFinal);
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

  const cargarDocumentos = async (vehiculoId) => {
    if (!vehiculoId) {
      setDocumentos([]);
      return;
    }

    try {
      const res = await fetch(`${API}/documentos?vehiculoId=${vehiculoId}`, {
        headers: headersAuth,
      });
      const data = await res.json().catch(() => []);
      setDocumentos(Array.isArray(data) ? data : []);
    } catch {
      setDocumentos([]);
      setError("No se pudo cargar documentos (backend).");
    }
  };

  useEffect(() => {
    cargarVehiculos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    cargarDocumentos(vehiculoSeleccionado);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehiculoSeleccionado]);

  const list = useMemo(() => {
    return (Array.isArray(documentos) ? documentos : [])
      .slice()
      .sort((a, b) => {
        const fa = a.fechaVencimiento || "";
        const fb = b.fechaVencimiento || "";
        return fa < fb ? 1 : -1;
      });
  }, [documentos]);

  const vencidos = useMemo(() => {
    const hoy = new Date().toISOString().slice(0, 10);
    return list.filter((d) => d.fechaVencimiento && d.fechaVencimiento < hoy).length;
  }, [list]);

  const hoy = new Date().toISOString().slice(0, 10);
  const estadoVencimiento = (fecha) => {
    if (!fecha) return "Sin fecha";
    if (fecha < hoy) return "Vencido";
    return "Vigente";
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
  };

  const validar = () => {
    if (!form.vehiculoId) return "Debes seleccionar un vehículo.";
    if (!form.tipo.trim()) return "El tipo es obligatorio (SOAT, Tecno, Seguro, Licencia...).";
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
      tipo: form.tipo.trim(),
      numero: form.numero.trim(),
      fechaVencimiento: (form.fechaVencimiento || "").trim(),
      notas: form.notas.trim(),
    };

    try {
      const url = editId ? `${API}/documentos/${editId}` : `${API}/documentos`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...headersAuth },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Error guardando documento en el backend.");
        return;
      }

      resetForm();
      await cargarDocumentos(vehiculoSeleccionado);
    } catch {
      setError("No se pudo conectar con el backend para guardar.");
    }
  };

  const onEdit = (d) => {
    setEditId(d.id);
    setForm({
      vehiculoId: String(d.vehiculoId ?? vehiculoSeleccionado ?? ""),
      tipo: d.tipo ?? "",
      numero: d.numero ?? "",
      fechaVencimiento: d.fechaVencimiento ?? "",
      notas: d.notas ?? "",
    });
    setError("");
  };

  const onDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este documento?")) return;

    try {
      const res = await fetch(`${API}/documentos/${id}`, {
        method: "DELETE",
        headers: headersAuth,
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Error eliminando documento en el backend.");
        return;
      }

      if (editId === id) resetForm();
      await cargarDocumentos(vehiculoSeleccionado);
    } catch {
      setError("No se pudo conectar con el backend para eliminar.");
    }
  };

  const vehiculoActual = vehiculos.find((v) => String(v.id) === String(vehiculoSeleccionado));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Documentos</h2>
        <p className={styles.subtitle}>
          {vehiculoActual
            ? `Vehículo: ${vehiculoActual.marca ?? ""} ${vehiculoActual.modelo ?? ""} (${vehiculoActual.placa ?? ""})`
            : "Gestión de documentos por vehículo"}
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
                localStorage.setItem("vehiculoDocs", id);
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
          <span className={styles.statLabel}>Vencidos</span>
          <span className={styles.statValue}>{vencidos}</span>
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>{editId ? "Editar documento" : "Agregar documento"}</h3>
        {error && <div className={styles.alert}>{error}</div>}

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span>Tipo *</span>
              <input name="tipo" value={form.tipo} onChange={onChange} placeholder="Ej: SOAT / Tecno / Seguro" />
            </label>

            <label className={styles.field}>
              <span>Número / póliza</span>
              <input name="numero" value={form.numero} onChange={onChange} placeholder="Opcional" />
            </label>

            <label className={styles.field}>
              <span>Fecha de vencimiento</span>
              <input type="date" name="fechaVencimiento" value={form.fechaVencimiento} onChange={onChange} />
            </label>

            <label className={`${styles.field} ${styles.fieldFull}`}>
              <span>Notas</span>
              <input name="notas" value={form.notas} onChange={onChange} placeholder="Opcional" />
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
        <h3 className={styles.cardTitle}>Documentos del vehículo</h3>

        {list.length === 0 ? (
          <p>No hay documentos para este vehículo.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Número</th>
                  <th>Vence</th>
                  <th>Estado</th>
                  <th>Notas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {list.map((d) => (
                  <tr key={d.id}>
                    <td>{d.tipo}</td>
                    <td>{d.numero || "-"}</td>
                    <td>{d.fechaVencimiento || "-"}</td>
                    <td>{estadoVencimiento(d.fechaVencimiento)}</td>
                    <td>{d.notas || "-"}</td>
                    <td className={styles.rowActions}>
                      <button className={styles.mini} onClick={() => onEdit(d)}>
                        Editar
                      </button>
                      <button className={`${styles.mini} ${styles.miniDanger}`} onClick={() => onDelete(d.id)}>
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
