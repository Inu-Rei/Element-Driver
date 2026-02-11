import styles from "../styles/Contacto.module.css";

export default function Contacto() {
  const email = "ronaldramossierra@hotmail.com";
  const phone = "3194863001";

  // ✅ WhatsApp (con +57 Colombia)
  const waLink = `https://wa.me/57${phone}`;

  // ✅ GitHub del proyecto (el que ya tienes)
  const githubRepo = "https://github.com/Inu-Rei/Element-Driver";

  // (Opcional) placeholders: cámbialos si quieres
  const linkedin = "https://www.linkedin.com/in/tu-usuario";
  const website = "https://tu-sitio.com";

  const onSubmit = (e) => {
    e.preventDefault();
    alert("✅ Mensaje enviado (simulado). Luego lo conectamos al backend.");
    e.target.reset();
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Contacto</h2>
        <p className={styles.subtitle}>
          ¿Tienes dudas o quieres soporte? Escríbenos y te respondemos.
        </p>
      </div>

      <div className={styles.grid}>
        {/* ✅ Tarjeta de datos */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Canales de atención</h3>

          <div className={styles.item}>
            <span className={styles.icon}>📧</span>
            <div>
              <div className={styles.itemLabel}>Correo</div>
              <a className={styles.link} href={`mailto:${email}`}>
                {email}
              </a>
            </div>
          </div>

          <div className={styles.item}>
            <span className={styles.icon}>📱</span>
            <div>
              <div className={styles.itemLabel}>WhatsApp / Teléfono</div>
              <a className={styles.link} href={waLink} target="_blank" rel="noreferrer">
                +57 {phone}
              </a>
            </div>
          </div>

          <div className={styles.item}>
            <span className={styles.icon}>🕒</span>
            <div>
              <div className={styles.itemLabel}>Horario</div>
              <div className={styles.text}>Lun – Vie · 8:00 a.m. – 6:00 p.m.</div>
            </div>
          </div>

          <div className={styles.item}>
            <span className={styles.icon}>📍</span>
            <div>
              <div className={styles.itemLabel}>Ubicación</div>
              <div className={styles.text}>Bogotá, Colombia</div>
            </div>
          </div>

          <hr className={styles.divider} />

          <h4 className={styles.smallTitle}>Links</h4>

          <div className={styles.links}>
            <a className={styles.badge} href={githubRepo} target="_blank" rel="noreferrer">
              💻 GitHub (Proyecto)
            </a>

            <a className={styles.badge} href={linkedin} target="_blank" rel="noreferrer">
              🔗 LinkedIn (cámbialo)
            </a>

            <a className={styles.badge} href={website} target="_blank" rel="noreferrer">
              🌐 Sitio web (cámbialo)
            </a>
          </div>
        </div>

        {/* ✅ Formulario */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Envíanos un mensaje</h3>

          <form className={styles.form} onSubmit={onSubmit}>
            <label className={styles.field}>
              <span>Nombre</span>
              <input type="text" placeholder="Tu nombre" required />
            </label>

            <label className={styles.field}>
              <span>Correo</span>
              <input type="email" placeholder="tucorreo@email.com" required />
            </label>

            <label className={styles.field}>
              <span>Asunto</span>
              <select required>
                <option value="">Selecciona…</option>
                <option>Soporte</option>
                <option>Sugerencia</option>
                <option>Reporte de error</option>
                <option>Otro</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>Mensaje</span>
              <textarea rows="5" placeholder="Escribe tu mensaje…" required />
            </label>

            <button className={styles.btn} type="submit">
              Enviar
            </button>

            <p className={styles.note}>
              * En esta fase el envío es simulado. Luego lo conectamos al backend.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
