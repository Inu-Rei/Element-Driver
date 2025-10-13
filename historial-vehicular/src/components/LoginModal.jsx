import styles from "../styles/LoginModal.module.css";

export default function LoginModal({ onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Bienvenido</h2>
        <p>Inicia sesión para continuar</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
