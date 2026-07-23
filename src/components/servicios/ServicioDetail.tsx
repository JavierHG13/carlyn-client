import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faCalendarCheck,
  faClock,
  faDollarSign,
  faScissors,
} from '@fortawesome/free-solid-svg-icons';
import { servicioService } from '../../services/servicioService';
import type { Servicio } from '../../types/servicio';
import { colors } from '../../styles/colors';
import {
  formatPrice,
  getServiceBenefits,
  getServiceCategory,
  getServiceDisplayName,
  getServiceImage,
} from '../../utils/servicioDisplay';

export const ServicioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
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

  const goToBooking = () => {
    if (!servicio) return;
    navigate(
      `/agendar-cita?servicioId=${servicio.id}&servicioNombre=${encodeURIComponent(servicio.nombre)}&precio=${servicio.precio}&duracion=${servicio.duracion}`,
      { state: { backgroundLocation: location } },
    );
  };

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
    padding: '64px 32px 96px',
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: '1320px',
    margin: '0 auto',
  };

  const backButtonStyle: React.CSSProperties = {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#111111',
    fontSize: '15px',
    fontWeight: 800,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    marginBottom: '44px',
  };

  const productGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '64px',
    alignItems: 'start',
  };

  const imagePanelStyle: React.CSSProperties = {
    backgroundColor: '#F4F4F4',
    minHeight: '520px',
    overflow: 'hidden',
    display: 'grid',
    placeItems: 'center',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '520px',
    objectFit: 'cover',
    display: 'block',
  };

  const textPanelStyle: React.CSSProperties = {
    paddingTop: '24px',
  };

  const eyebrowStyle: React.CSSProperties = {
    color: '#D0021B',
    fontSize: '12px',
    fontWeight: 900,
    letterSpacing: '5px',
    textTransform: 'uppercase',
    marginBottom: '18px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'Lato, sans-serif',
    color: '#050505',
    fontSize: 'clamp(42px, 5vw, 68px)',
    lineHeight: 1.02,
    fontWeight: 400,
    margin: '0 0 22px',
  };

  const priceStyle: React.CSSProperties = {
    color: '#111111',
    fontSize: '28px',
    fontWeight: 500,
    marginBottom: '34px',
  };

  const metaGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '14px',
    marginBottom: '28px',
  };

  const metaCardStyle: React.CSSProperties = {
    border: '1px solid rgba(0,0,0,0.12)',
    padding: '18px',
    minHeight: '84px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  };

  const descriptionStyle: React.CSSProperties = {
    color: '#2F3A45',
    fontSize: '16px',
    lineHeight: 1.75,
    marginBottom: '28px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: 'Lato, sans-serif',
    color: '#111111',
    fontSize: '24px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    fontWeight: 500,
    margin: '0 0 18px',
  };

  const benefitGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '10px',
    marginBottom: '34px',
  };

  const benefitStyle: React.CSSProperties = {
    border: '1px solid rgba(184,134,11,0.35)',
    backgroundColor: '#FAF4E8',
    color: '#111111',
    padding: '12px 14px',
    fontSize: '14px',
    fontWeight: 700,
  };

  const actionStyle: React.CSSProperties = {
    backgroundColor: '#FFC629',
    color: '#111111',
    border: '1px solid #FFC629',
    padding: '15px 30px',
    minWidth: '220px',
    fontSize: '13px',
    fontWeight: 900,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    cursor: 'pointer',
  };

  if (loading) {
    return (
      <div style={{ ...pageStyle, display: 'grid', placeItems: 'center' }}>
        <span style={{ color: colors.azulAcero }}>Cargando servicio...</span>
      </div>
    );
  }

  if (!servicio) {
    return (
      <div style={pageStyle}>
        <div style={contentStyle}>
          <h1>Servicio no encontrado</h1>
          <button type="button" onClick={() => navigate('/servicios')} style={actionStyle}>
            Volver a servicios
          </button>
        </div>
      </div>
    );
  }

  const display = getServiceDisplayName(servicio.nombre);
  const benefits = getServiceBenefits(servicio.descripcion);
  const image = getServiceImage(servicio);

  return (
    <main style={pageStyle}>
      <div style={contentStyle}>
        <button type="button" style={backButtonStyle} onClick={() => navigate('/servicios')}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Volver a servicios
        </button>

        <motion.section
          style={productGridStyle}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div style={imagePanelStyle}>
            {!imageError ? (
              <img src={image} alt={display.title} style={imageStyle} onError={() => setImageError(true)} />
            ) : (
              <FontAwesomeIcon icon={faScissors} style={{ fontSize: 72, color: colors.doradoClasico }} />
            )}
          </div>

          <div style={textPanelStyle}>
            <div style={eyebrowStyle}>Barberia Carlyn</div>
            <h1 style={titleStyle}>#{display.title}</h1>
            <div style={priceStyle}>{formatPrice(servicio.precio)}</div>

            <div style={metaGridStyle}>
              <div style={metaCardStyle}>
                <FontAwesomeIcon icon={faClock} style={{ color: '#C40000', fontSize: 20 }} />
                <div>
                  <strong>{servicio.duracion} min</strong>
                  <div style={{ color: '#607080', fontSize: 13 }}>Duracion estimada</div>
                </div>
              </div>
              <div style={metaCardStyle}>
                <FontAwesomeIcon icon={faDollarSign} style={{ color: '#C40000', fontSize: 20 }} />
                <div>
                  <strong>{getServiceCategory(servicio)}</strong>
                  <div style={{ color: '#607080', fontSize: 13 }}>{display.label}</div>
                </div>
              </div>
            </div>

            {servicio.descripcion && <p style={descriptionStyle}>{servicio.descripcion}</p>}

            {benefits.length > 0 && (
              <>
                <h2 style={sectionTitleStyle}>Incluye</h2>
                <div style={benefitGridStyle}>
                  {benefits.map((benefit) => (
                    <span key={benefit} style={benefitStyle}>
                      {benefit}
                    </span>
                  ))}
                </div>
              </>
            )}

            <button type="button" style={actionStyle} onClick={goToBooking}>
              <FontAwesomeIcon icon={faCalendarCheck} style={{ marginRight: 10 }} />
              Agendar servicio
            </button>
          </div>
        </motion.section>
      </div>
    </main>
  );
};
