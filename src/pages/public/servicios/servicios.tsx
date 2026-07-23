import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faCalendarCheck,
  faClock,
  faFilter,
  faScissors,
  faSpinner,
  faTag,
} from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { servicioService } from '../../../services/servicioService';
import type { Servicio } from '../../../types/servicio';
import { colors } from '../../../styles/colors';
import {
  formatPrice,
  getServiceCategory,
  getServiceDisplayName,
  getServiceImage,
} from '../../../utils/servicioDisplay';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

type SortMode = 'featured' | 'price-asc' | 'price-desc' | 'duration';

export const ServiciosPublicos: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [sortMode, setSortMode] = useState<SortMode>('featured');

  useEffect(() => {
    loadServicios();
  }, []);

  const loadServicios = async () => {
    try {
      setLoading(true);
      const data = await servicioService.getActive();
      setServicios(data.filter((servicio) => servicio.activo));
    } catch (error) {
      console.error('Error loading servicios:', error);
      try {
        const data = await servicioService.getAll();
        setServicios(data.filter((servicio) => servicio.activo));
      } catch (fallbackError) {
        console.error('Error loading fallback servicios:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const sortedServicios = useMemo(() => {
    const next = [...servicios];
    if (sortMode === 'price-asc') next.sort((a, b) => Number(a.precio) - Number(b.precio));
    if (sortMode === 'price-desc') next.sort((a, b) => Number(b.precio) - Number(a.precio));
    if (sortMode === 'duration') next.sort((a, b) => Number(a.duracion) - Number(b.duracion));
    return next;
  }, [servicios, sortMode]);

  const categories = useMemo(() => {
    const unique = new Set(servicios.map((servicio) => getServiceCategory(servicio)));
    return Array.from(unique);
  }, [servicios]);

  const goToBooking = (servicio: Servicio) => {
    navigate(
      `/agendar-cita?servicioId=${servicio.id}&servicioNombre=${encodeURIComponent(servicio.nombre)}&precio=${servicio.precio}&duracion=${servicio.duracion}`,
      { state: { backgroundLocation: location } },
    );
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
  };

  const heroStyle: React.CSSProperties = {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '92px 32px 48px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '32px',
    alignItems: 'end',
  };

  const eyebrowStyle: React.CSSProperties = {
    color: '#C40000',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '5px',
    textTransform: 'uppercase',
    marginBottom: '18px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'Lato, sans-serif',
    color: '#111111',
    fontSize: 'clamp(48px, 8vw, 92px)',
    lineHeight: 0.95,
    fontWeight: 400,
    letterSpacing: '8px',
    textTransform: 'uppercase',
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#2F3A45',
    fontSize: '18px',
    marginTop: '22px',
  };

  const toolbarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '16px',
    flexWrap: 'wrap',
  };

  const selectWrapStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid rgba(196, 0, 0, 0.35)',
    padding: '0 18px',
    height: '58px',
    minWidth: '260px',
    backgroundColor: '#FFFFFF',
  };

  const selectStyle: React.CSSProperties = {
    border: 'none',
    outline: 'none',
    width: '100%',
    backgroundColor: 'transparent',
    color: '#151515',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '1.6px',
    textTransform: 'uppercase',
  };

  const categoryRowStyle: React.CSSProperties = {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '0 32px 40px',
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  };

  const categoryChipStyle: React.CSSProperties = {
    border: '1px solid rgba(0,0,0,0.12)',
    color: '#151515',
    backgroundColor: '#FFFFFF',
    padding: '10px 16px',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '1px',
    textTransform: 'uppercase',
  };

  const gridStyle: React.CSSProperties = {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '0 32px 96px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '40px',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    border: '1px solid rgba(0,0,0,0.06)',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '280px',
    objectFit: 'cover',
    display: 'block',
    backgroundColor: '#F3F3F3',
  };

  const cardBodyStyle: React.CSSProperties = {
    padding: '28px 24px 30px',
    textAlign: 'center',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const cardEyebrowStyle: React.CSSProperties = {
    color: '#D0021B',
    fontSize: '12px',
    fontWeight: 900,
    letterSpacing: '6px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  };

  const cardTitleStyle: React.CSSProperties = {
    fontFamily: 'Lato, sans-serif',
    color: '#050505',
    fontSize: 'clamp(24px, 2vw, 30px)',
    fontWeight: 500,
    lineHeight: 1.2,
    margin: '0 0 14px',
  };

  const cardDescriptionStyle: React.CSSProperties = {
    color: '#4D5560',
    fontSize: '14px',
    lineHeight: 1.6,
    minHeight: '45px',
    marginBottom: '18px',
  };

  const metaRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '18px',
    color: '#111111',
    fontSize: '15px',
    marginTop: 'auto',
    marginBottom: '22px',
  };

  const actionRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  const detailButtonStyle: React.CSSProperties = {
    border: '1px solid #111111',
    backgroundColor: '#FFFFFF',
    color: '#111111',
    padding: '11px 18px',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    cursor: 'pointer',
  };

  const primaryButtonStyle: React.CSSProperties = {
    border: '1px solid #FFC629',
    backgroundColor: '#FFC629',
    color: '#111111',
    padding: '11px 20px',
    fontSize: '12px',
    fontWeight: 900,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    cursor: 'pointer',
  };

  const stickyButtonStyle: React.CSSProperties = {
    position: 'fixed',
    right: 0,
    top: '68%',
    transform: 'translateY(-50%)',
    writingMode: 'vertical-rl',
    backgroundColor: '#FFC629',
    color: '#1A1A1A',
    border: 'none',
    padding: '22px 14px',
    fontSize: '20px',
    fontWeight: 600,
    letterSpacing: '1px',
    cursor: 'pointer',
    zIndex: 70,
    boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
  };

  if (loading) {
    return (
      <div style={{ ...containerStyle, display: 'grid', placeItems: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <FontAwesomeIcon icon={faSpinner} style={{ fontSize: 46, color: colors.doradoClasico }} />
        </motion.div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <motion.section style={heroStyle} initial="hidden" animate="visible" variants={fadeInUp}>
        <div>
          <div style={eyebrowStyle}>Barberia Carlyn</div>
          <h1 style={titleStyle}>Servicios</h1>
          <p style={subtitleStyle}>Servicios disponibles para reservar en sucursal.</p>
        </div>

        <div style={toolbarStyle}>
          <label style={selectWrapStyle}>
            <FontAwesomeIcon icon={faFilter} style={{ color: '#C40000' }} />
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} style={selectStyle}>
              <option value="featured">Orden destacado</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="duration">Duracion</option>
            </select>
          </label>
        </div>
      </motion.section>

      {categories.length > 0 && (
        <div style={categoryRowStyle}>
          {categories.map((category) => (
            <span key={category} style={categoryChipStyle}>
              {category}
            </span>
          ))}
        </div>
      )}

      <motion.section style={gridStyle} variants={staggerContainer} initial="hidden" animate="visible">
        {sortedServicios.map((servicio, index) => {
          const display = getServiceDisplayName(servicio.nombre);
          const image = getServiceImage(servicio, index);

          return (
            <motion.article
              key={servicio.id}
              style={cardStyle}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              onClick={() => navigate(`/servicios/${servicio.id}`)}
            >
              {!imageErrors[servicio.id] ? (
                <img
                  src={image}
                  alt={display.title}
                  style={imageStyle}
                  onError={() => setImageErrors((prev) => ({ ...prev, [servicio.id]: true }))}
                />
              ) : (
                <div style={{ ...imageStyle, display: 'grid', placeItems: 'center' }}>
                  <FontAwesomeIcon icon={faScissors} style={{ fontSize: 48, color: '#111111' }} />
                </div>
              )}

              <div style={cardBodyStyle}>
                <div style={cardEyebrowStyle}>{display.label}</div>
                <h2 style={cardTitleStyle}>#{display.title}</h2>
                <p style={cardDescriptionStyle}>
                  {servicio.descripcion || 'Servicio profesional de barberia con atencion personalizada.'}
                </p>

                <div style={metaRowStyle}>
                  <span>
                    <FontAwesomeIcon icon={faClock} style={{ marginRight: 8, color: '#C40000' }} />
                    {servicio.duracion} min
                  </span>
                  <strong>{formatPrice(servicio.precio)}</strong>
                </div>

                <div style={actionRowStyle}>
                  <button
                    type="button"
                    style={detailButtonStyle}
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/servicios/${servicio.id}`);
                    }}
                  >
                    Ver detalle
                    <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: 8 }} />
                  </button>
                  <button
                    type="button"
                    style={primaryButtonStyle}
                    onClick={(event) => {
                      event.stopPropagation();
                      goToBooking(servicio);
                    }}
                  >
                    <FontAwesomeIcon icon={faCalendarCheck} style={{ marginRight: 8 }} />
                    Agendar
                  </button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </motion.section>

      <button
        type="button"
        style={stickyButtonStyle}
        onClick={() => {
          if (sortedServicios[0]) goToBooking(sortedServicios[0]);
        }}
        aria-label="Agendar cita"
      >
        <FontAwesomeIcon icon={faTag} style={{ marginBottom: 10 }} />
        Agendar cita
      </button>
    </div>
  );
};
