import React from 'react';
import { useNavigate } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import FeatureCard from '../components/FeatureCard';
import styles from '../styles/Home.module.css';

export default function Home() {
  const navigate = useNavigate();

  const handleRegistration = () => {
    navigate('/vehiculos');
  };

  const motorcycleSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 140' style='background:%23f8f9fa'%3E%3Crect x='60' y='75' width='80' height='15' rx='8' fill='%234169E1'/%3E%3Ccircle cx='40' cy='100' r='15' fill='%23333' stroke='%23666' stroke-width='2'/%3E%3Ccircle cx='160' cy='100' r='15' fill='%23333' stroke='%23666' stroke-width='2'/%3E%3Crect x='55' y='70' width='20' height='6' rx='3' fill='%23666'/%3E%3Crect x='120' y='85' width='25' height='5' rx='2' fill='%23666'/%3E%3Crect x='70' y='65' width='25' height='8' rx='4' fill='%23222'/%3E%3Crect x='85' y='60' width='20' height='12' rx='6' fill='%234169E1'/%3E%3Ctext x='100' y='130' text-anchor='middle' fill='%23666' font-family='Arial' font-size='12'%3EMotocicleta%3C/text%3E%3C/svg%3E";

  const carSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 140' style='background:%23f8f9fa'%3E%3Crect x='30' y='80' width='140' height='25' rx='12' fill='%23DC143C'/%3E%3Crect x='50' y='65' width='100' height='18' rx='9' fill='%23DC143C'/%3E%3Crect x='60' y='70' width='25' height='12' rx='6' fill='%23ADD8E6' opacity='0.8'/%3E%3Crect x='115' y='70' width='25' height='12' rx='6' fill='%23ADD8E6' opacity='0.8'/%3E%3Ccircle cx='55' cy='110' r='12' fill='%23333' stroke='%23666' stroke-width='2'/%3E%3Ccircle cx='145' cy='110' r='12' fill='%23333' stroke='%23666' stroke-width='2'/%3E%3Ccircle cx='175' cy='90' r='5' fill='%23FFFF99'/%3E%3Ccircle cx='25' cy='90' r='4' fill='%23FF6B6B'/%3E%3Ctext x='100' y='130' text-anchor='middle' fill='%23666' font-family='Arial' font-size='12'%3EAutomóvil%3C/text%3E%3C/svg%3E";

  const features = [
    {
      icon: '🔧',
      title: 'Control de Mantenimientos',
      description: 'Programa y rastrea todos los servicios de mantenimiento de tus vehículos con recordatorios automáticos.'
    },
    {
      icon: '💰',
      title: 'Gestión de Gastos',
      description: 'Registra todos los gastos relacionados con tus vehículos y obtén reportes detallados de costos.'
    },
    {
      icon: '📄',
      title: 'Documentos Organizados',
      description: 'Mantén todos tus documentos importantes organizados y accesibles desde cualquier lugar.'
    },
    {
      icon: '📊',
      title: 'Reportes y Análisis',
      description: 'Visualiza el historial completo de tus vehículos con gráficos y estadísticas detalladas.'
    },
    {
      icon: '⏰',
      title: 'Recordatorios',
      description: 'Recibe notificaciones para renovaciones, mantenimientos y fechas importantes.'
    },
    {
      icon: '🔒',
      title: 'Seguridad Total',
      description: 'Tus datos están protegidos con encriptación de nivel empresarial y respaldos automáticos.'
    }
  ];

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>ELEMENT DRIVER</h1>
          <p className={styles.heroSubtitle}>
            Tu historial de moto y carro en un solo lugar
          </p>

          {/* Vehicles Cards */}
          <div className={styles.vehiclesSection}>
            <VehicleCard
              title="Motocicleta"
              description="Registra y controla todo el historial de mantenimiento de tu motocicleta"
              imageSvg={motorcycleSvg}
            />
            <VehicleCard
              title="Automóvil"
              description="Administra gastos, documentos y mantenimientos de tu automóvil"
              imageSvg={carSvg}
            />
          </div>

          {/* CTA Button */}
          <div className={styles.ctaSection}>
            <button 
              className={styles.ctaButton}
              onClick={handleRegistration}
            >
              Registrar mi vehículo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.featuresTitle}>
            ¿Por qué elegir Element Driver?
          </h2>

          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}