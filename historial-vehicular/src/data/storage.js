const KEYS = {
  vehiculos: "ed_vehiculos",
  documentos: "ed_documentos",
  mantenimientos: "ed_mantenimientos",
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return Date.now();
}

/* ------------------ Vehículos ------------------ */
export function getVehiculos() {
  const data = read(KEYS.vehiculos, []);
  if (data.length > 0) return data;

  const seed = [
    { id: 1, placa: "ABC12D", nombre: "Yamaha FZ 2.0", tipo: "Moto" },
    { id: 2, placa: "XYZ98K", nombre: "Chevrolet Spark", tipo: "Carro" },
  ];
  write(KEYS.vehiculos, seed);
  return seed;
}

export function saveVehiculos(items) {
  write(KEYS.vehiculos, items);
}

/* ------------------ Documentos ------------------ */
export function getDocumentos() {
  const data = read(KEYS.documentos, []);
  if (data.length > 0) return data;

  const seed = [
    { id: 11, vehiculoId: 1, nombre: "SOAT", numero: "SOAT-88921", entidad: "Aseguradora X", vencimiento: "2026-03-10", notas: "" },
    { id: 12, vehiculoId: 1, nombre: "Tecnomecánica", numero: "TM-55110", entidad: "CDA Centro", vencimiento: "2026-01-25", notas: "Revisión anual" },
    { id: 13, vehiculoId: 2, nombre: "SOAT", numero: "SOAT-12001", entidad: "Aseguradora Y", vencimiento: "2026-02-15", notas: "" },
  ];
  write(KEYS.documentos, seed);
  return seed;
}

export function saveDocumentos(items) {
  write(KEYS.documentos, items);
}

/* ------------------ Mantenimientos ------------------ */
export function getMantenimientos() {
  const data = read(KEYS.mantenimientos, []);
  if (data.length > 0) return data;

  const seed = [
    { id: 21, vehiculoId: 1, fecha: "2026-01-05", tipo: "Cambio de aceite", km: 24500, taller: "Taller Los Pinos", costo: 95000, notas: "Filtro incluido" },
    { id: 22, vehiculoId: 1, fecha: "2025-12-10", tipo: "Revisión general", km: 23000, taller: "MotoCenter", costo: 120000, notas: "Ajuste de frenos" },
    { id: 23, vehiculoId: 2, fecha: "2026-01-02", tipo: "Alineación y balanceo", km: 80500, taller: "ServiAuto", costo: 70000, notas: "" },
  ];
  write(KEYS.mantenimientos, seed);
  return seed;
}

export function saveMantenimientos(items) {
  write(KEYS.mantenimientos, items);
}

export { uid };
