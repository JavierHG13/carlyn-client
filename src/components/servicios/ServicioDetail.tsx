import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faClock,
  faDollarSign,
  faCalendarCheck,
  faStar,
  faStarHalfAlt,
  faInfoCircle,
  faScissors,
} from '@fortawesome/free-solid-svg-icons';
import { servicioService } from '../../services/servicioService';
import type { Servicio } from '../../types/servicio';
import { colors } from '../../styles/colors';

export const ServicioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    loadServicio();
  }, [id]);

  const loadServicio = async () => {
    try {
      setLoading(true);
      const data = await servicioService.getById(Number(id));
      setServicio(data);
    } catch (error) {
      console.error('Error loading servicio:', error);
      navigate('/servicios');
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 24px',
    minHeight: '100vh',
    backgroundColor: colors.blancoHueso,
  };

  const backButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: `2px solid ${colors.azulAcero}20`,
    borderRadius: '30px',
    color: colors.azulAcero,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '32px',
    transition: 'all 0.2s',
  };

  const contentCardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 4px 30px rgba(0,0,0,0.08)',
  };

  const imageContainerStyle: React.CSSProperties = {
    height: '400px',
    backgroundColor: `linear-gradient(135deg, ${colors.grafito} 0%, ${colors.azulAcero} 100%)`,
    overflow: 'hidden',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const contentStyle: React.CSSProperties = {
    padding: '40px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '36px',
    fontWeight: 700,
    color: colors.negroSuave,
    marginBottom: '16px',
    fontFamily: 'Playfair Display, serif',
  };

  const infoGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
    padding: '24px',
    backgroundColor: '#F8FAFC',
    borderRadius: '16px',
  };

  const infoItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const infoIconStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: `${colors.doradoClasico}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.doradoClasico,
    fontSize: '24px',
  };

  const infoLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#718096',
    marginBottom: '4px',
  };

  const infoValueStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    color: colors.negroSuave,
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '16px',
    color: colors.azulAcero,
    lineHeight: 1.8,
    marginBottom: '32px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '14px 32px',
    backgroundColor: colors.doradoClasico,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.2s',
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '80px' }}>
          <div style={{ color: colors.azulAcero }}>Cargando servicio...</div>
        </div>
      </div>
    );
  }

  if (!servicio) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '80px' }}>
          <h2>Servicio no encontrado</h2>
          <button onClick={() => navigate('/servicios')} style={buttonStyle}>
            Volver a servicios
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      style={containerStyle}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.button
        style={backButtonStyle}
        variants={fadeInUp}
        whileHover={{ x: -5, borderColor: colors.doradoClasico }}
        onClick={() => navigate('/servicios')}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Volver a servicios
      </motion.button>

      <motion.div style={contentCardStyle} variants={fadeInUp}>
        <motion.div
          style={imageContainerStyle}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {servicio.imagen_url && !imageError ? (
            <img
              src={servicio.imagen_url}
              alt={servicio.nombre}
              style={imageStyle}
              onError={() => setImageError(true)}
            />
          ) : (
            <div style={{
              ...imageContainerStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '80px',
            }}>
              <FontAwesomeIcon icon={faScissors} />
            </div>
          )}
        </motion.div>

        <div style={contentStyle}>
          <h1 style={titleStyle}>{servicio.nombre}</h1>

          <div style={infoGridStyle}>
            <div style={infoItemStyle}>
              <div style={infoIconStyle}>
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div>
                <div style={infoLabelStyle}>Duración</div>
                <div style={infoValueStyle}>{servicio.duracion} minutos</div>
              </div>
            </div>

            <div style={infoItemStyle}>
              <div style={infoIconStyle}>
                <FontAwesomeIcon icon={faDollarSign} />
              </div>
              <div>
                <div style={infoLabelStyle}>Precio</div>
                <div style={infoValueStyle}>${servicio.precio.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {servicio.descripcion && (
            <p style={descriptionStyle}>{servicio.descripcion}</p>
          )}

          <motion.button
            style={buttonStyle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <FontAwesomeIcon icon={faCalendarCheck} />
            Agendar este servicio
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};