import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faDollarSign, faEye, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import type { Servicio } from '../../types/servicio';
import { colors } from '../../styles/colors';

interface ServicioCardProps {
  servicio: Servicio;
  index: number;
}

export const ServicioCard: React.FC<ServicioCardProps> = ({ servicio, index }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      } 
    },
    hover: { 
      y: -10,
      boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
      borderColor: colors.doradoClasico + '40',
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  const imageVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.98 }
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: `1px solid ${colors.azulAcero}15`,
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  const imageContainerStyle: React.CSSProperties = {
    height: '220px',
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
    position: 'relative',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const noImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `linear-gradient(135deg, ${colors.grafito} 0%, ${colors.azulAcero} 100%)`,
    color: colors.blancoHueso,
    fontSize: '48px',
    background: `linear-gradient(135deg, ${colors.doradoClasico} 0%, #e8d48a 100%)`,
  };

  const contentStyle: React.CSSProperties = {
    padding: '24px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: 600,
    color: colors.negroSuave,
    marginBottom: '12px',
    fontFamily: 'Playfair Display, serif',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '14px',
    color: colors.azulAcero,
    lineHeight: 1.7,
    marginBottom: '20px',
    flex: 1,
  };

  const infoRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: `1px solid ${colors.azulAcero}15`,
  };

  const durationStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: colors.azulAcero,
    fontSize: '14px',
  };

  const priceStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 700,
    color: colors.doradoClasico,
    fontFamily: 'Playfair Display, serif',
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
  };

  const buttonStyle = (bgColor: string, textColor: string = 'white'): React.CSSProperties => ({
    flex: 1,
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s',
    backgroundColor: bgColor,
    color: textColor,
  });

  return (
    <motion.div
      style={cardStyle}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.div style={imageContainerStyle} variants={imageVariants}>
        {servicio.imagen_url && !imageError ? (
          <img
            src={servicio.imagen_url}
            alt={servicio.nombre}
            style={imageStyle}
            onError={() => setImageError(true)}
          />
        ) : (
          <div style={noImageStyle}>
            <FontAwesomeIcon icon={faEye} style={{ fontSize: '48px', opacity: 0.5 }} />
          </div>
        )}
      </motion.div>

      <div style={contentStyle}>
        <h3 style={titleStyle}>{servicio.nombre}</h3>
        
        {servicio.descripcion && (
          <p style={descriptionStyle}>
            {servicio.descripcion.length > 100 
              ? `${servicio.descripcion.substring(0, 100)}...` 
              : servicio.descripcion}
          </p>
        )}

        <div style={infoRowStyle}>
          <span style={durationStyle}>
            <FontAwesomeIcon icon={faClock} />
            {servicio.duracion} min
          </span>
          <span style={priceStyle}>${servicio.precio}</span>
        </div>

        <div style={buttonContainerStyle}>
          <motion.button
            style={buttonStyle(colors.grafito)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => navigate(`/servicios/${servicio.id}`)}
          >
            <FontAwesomeIcon icon={faEye} />
            Ver detalles
          </motion.button>
          <motion.button
            style={buttonStyle(colors.doradoClasico)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FontAwesomeIcon icon={faCalendarCheck} />
            Agendar
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};