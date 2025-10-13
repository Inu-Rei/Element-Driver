import React from 'react';
import styles from '../styles/VehicleCard.module.css';

export default function VehicleCard({ title, description, imageSvg }) {
  return (
    <div className={styles.vehicleCard}>
      <div className={styles.vehicleImage}>
        <img src={imageSvg} alt={title} />
      </div>
      <h3 className={styles.vehicleTitle}>{title}</h3>
      <p className={styles.vehicleDescription}>{description}</p>
    </div>
  );
}
