import React from 'react';
import styles from '../styles/FeatureCard.module.css';

export default function FeatureCard({ icon, title, description }) {
  return (
    <div className={styles.featureCard}>
      <span className={styles.featureIcon}>{icon}</span>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </div>
  );
}
