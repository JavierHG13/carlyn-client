import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faCalendarCheck,
  faClock,
  faLocationDot,
  faScissors,
  faSpinner,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../styles/colors';
import { servicioService } from '../../services/servicioService';
import type { Servicio } from '../../types/servicio';
import {
  formatPrice,
  getServiceDisplayName,
  getServiceImage,
} from '../../utils/servicioDisplay';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loadingServicios, setLoadingServicios] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const loadServicios = async () => {
      try {
        setLoadingServicios(true);
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
        setLoadingServicios(false);
      }
    };

    loadServicios();
  }, []);

  const featuredServices = useMemo(() => servicios.slice(0, 4), [servicios]);

  const goToBooking = (servicio: Servicio) => {
    navigate(
      `/agendar-cita?servicioId=${servicio.id}&servicioNombre=${encodeURIComponent(servicio.nombre)}&precio=${servicio.precio}&duracion=${servicio.duracion}`,
      { state: { backgroundLocation: location } },
    );
  };

  const pageStyle: React.CSSProperties = {
    width: '100%',
    overflowX: 'hidden',
    backgroundColor: '#FFFFFF',
  };

  const heroStyle: React.CSSProperties = {
    minHeight: '92vh',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    backgroundImage:
      'linear-gradient(90deg, rgba(0,0,0,0.76) 0%, rgba(0,0,0,0.54) 45%, rgba(0,0,0,0.18) 100%), url("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1900&q=85")',
    backgroundSize: 'cover',
    backgroundPosition: 'center 38%',
    color: '#FFFFFF',
  };

  const heroInnerStyle: React.CSSProperties = {
    width: 'min(1320px, 100%)',
    margin: '0 auto',
    padding: '140px 32px 72px',
  };

  const eyebrowStyle: React.CSSProperties = {
    color: '#FFC629',
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 5,
    textTransform: 'uppercase',
    marginBottom: 18,
  };

  const heroTitleStyle: React.CSSProperties = {
    maxWidth: 720,
    color: '#FFFFFF',
    fontFamily: 'Lato, sans-serif',
    fontSize: 'clamp(54px, 8vw, 104px)',
    lineHeight: 0.96,
    fontWeight: 400,
    letterSpacing: 2,
    textTransform: 'uppercase',
    margin: 0,
  };

  const heroTextStyle: React.CSSProperties = {
    maxWidth: 580,
    color: 'rgba(255,255,255,0.86)',
    fontSize: 'clamp(17px, 2vw, 21px)',
    lineHeight: 1.7,
    margin: '28px 0 36px',
  };

  const heroActionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: 14,
    flexWrap: 'wrap',
  };

  const primaryButtonStyle: React.CSSProperties = {
    border: '1px solid #FFC629',
    backgroundColor: '#FFC629',
    color: '#111111',
    padding: '15px 26px',
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: 1,
    textTransform: 'uppercase',
    cursor: 'pointer',
  };

  const ghostButtonStyle: React.CSSProperties = {
    ...primaryButtonStyle,
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    border: '1px solid rgba(255,255,255,0.75)',
  };

  const sectionStyle: React.CSSProperties = {
    padding: '96px 32px',
  };

  const sectionInnerStyle: React.CSSProperties = {
    width: 'min(1320px, 100%)',
    margin: '0 auto',
  };

  const sectionHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'end',
    justifyContent: 'space-between',
    gap: 24,
    marginBottom: 44,
    flexWrap: 'wrap',
  };

  const smallLabelStyle: React.CSSProperties = {
    color: '#C40000',
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 12,
  };

  const sectionTitleStyle: React.CSSProperties = {
    color: '#111111',
    fontFamily: 'Lato, sans-serif',
    fontSize: 'clamp(38px, 6vw, 78px)',
    fontWeight: 400,
    letterSpacing: 4,
    textTransform: 'uppercase',
    margin: 0,
    lineHeight: 1,
  };

  const sectionTextStyle: React.CSSProperties = {
    maxWidth: 560,
    color: '#53606D',
    lineHeight: 1.75,
    fontSize: 16,
  };

  const servicesGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 32,
  };

  const serviceCardStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    border: '1px solid rgba(0,0,0,0.07)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  };

  const serviceImageStyle: React.CSSProperties = {
    width: '100%',
    height: 245,
    objectFit: 'cover',
    display: 'block',
    backgroundColor: '#F5F5F5',
  };

  const serviceBodyStyle: React.CSSProperties = {
    padding: '25px 22px 28px',
    display: 'grid',
    gap: 12,
    textAlign: 'center',
    flex: 1,
  };

  const serviceEyebrowStyle: React.CSSProperties = {
    color: '#D0021B',
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 4,
    textTransform: 'uppercase',
  };

  const serviceTitleStyle: React.CSSProperties = {
    color: '#080808',
    fontFamily: 'Lato, sans-serif',
    fontSize: 26,
    lineHeight: 1.15,
    fontWeight: 500,
    margin: 0,
  };

  const serviceMetaStyle: React.CSSProperties = {
    color: '#111111',
    display: 'flex',
    justifyContent: 'center',
    gap: 18,
    flexWrap: 'wrap',
    fontSize: 14,
  };

  const splitSectionStyle: React.CSSProperties = {
    backgroundColor: '#F7F7F7',
    padding: '96px 32px',
  };

  const splitGridStyle: React.CSSProperties = {
    width: 'min(1320px, 100%)',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 42,
    alignItems: 'center',
  };

  const imageGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 0.78fr',
    gap: 16,
    alignItems: 'end',
  };

  const imageLargeStyle: React.CSSProperties = {
    width: '100%',
    height: 430,
    objectFit: 'cover',
  };

  const imageSmallStyle: React.CSSProperties = {
    width: '100%',
    height: 280,
    objectFit: 'cover',
  };

  const featureListStyle: React.CSSProperties = {
    display: 'grid',
    gap: 14,
    marginTop: 28,
  };

  const featureItemStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '42px 1fr',
    gap: 14,
    alignItems: 'start',
    padding: '16px 0',
    borderBottom: '1px solid rgba(0,0,0,0.09)',
  };

  return (
    <main style={pageStyle}>
      <section id="inicio" style={heroStyle}>
        <motion.div style={heroInnerStyle} initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div style={eyebrowStyle} variants={fadeInUp}>
            Barberia Carlyn
          </motion.div>
          <motion.h1 style={heroTitleStyle} variants={fadeInUp}>
            Corte clasico, trato fino
          </motion.h1>
          <motion.p style={heroTextStyle} variants={fadeInUp}>
            Reserva tu servicio con barberos profesionales, horarios disponibles y pago seguro para confirmar tu lugar.
          </motion.p>
          <motion.div style={heroActionsStyle} variants={fadeInUp}>
            <button type="button" style={primaryButtonStyle} onClick={() => navigate('/servicios')}>
              Ver servicios
              <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: 10 }} />
            </button>
            <button type="button" style={ghostButtonStyle} onClick={() => navigate('/nostros')}>
              Conocer barberia
            </button>
          </motion.div>
        </motion.div>
      </section>

      <section id="servicios" style={sectionStyle}>
        <div style={sectionInnerStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>Catalogo</div>
              <h2 style={sectionTitleStyle}>Servicios</h2>
            </div>
            <p style={sectionTextStyle}>
              Paquetes pensados para una experiencia completa. Si despues decides separar corte, barba o facial como servicios individuales, esta vista ya esta lista para mostrarlos como catalogo.
            </p>
          </div>

          {loadingServicios ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <FontAwesomeIcon icon={faSpinner} spin style={{ color: colors.doradoClasico, fontSize: 32 }} />
            </div>
          ) : (
            <motion.div style={servicesGridStyle} variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {featuredServices.map((servicio, index) => {
                const display = getServiceDisplayName(servicio.nombre);
                const image = getServiceImage(servicio, index);

                return (
                  <motion.article
                    key={servicio.id}
                    style={serviceCardStyle}
                    variants={fadeInUp}
                    whileHover={{ y: -8, boxShadow: '0 18px 42px rgba(0,0,0,0.12)' }}
                    onClick={() => navigate(`/servicios/${servicio.id}`)}
                  >
                    {!imageErrors[servicio.id] ? (
                      <img
                        src={image}
                        alt={display.title}
                        style={serviceImageStyle}
                        onError={() => setImageErrors((prev) => ({ ...prev, [servicio.id]: true }))}
                      />
                    ) : (
                      <div style={{ ...serviceImageStyle, display: 'grid', placeItems: 'center' }}>
                        <FontAwesomeIcon icon={faScissors} style={{ color: colors.doradoClasico, fontSize: 44 }} />
                      </div>
                    )}

                    <div style={serviceBodyStyle}>
                      <span style={serviceEyebrowStyle}>{display.label}</span>
                      <h3 style={serviceTitleStyle}>#{display.title}</h3>
                      <div style={serviceMetaStyle}>
                        <span>
                          <FontAwesomeIcon icon={faClock} style={{ color: '#C40000', marginRight: 7 }} />
                          {servicio.duracion} min
                        </span>
                        <strong>{formatPrice(servicio.precio)}</strong>
                      </div>
                      <button
                        type="button"
                        style={{ ...primaryButtonStyle, margin: '12px auto 0' }}
                        onClick={(event) => {
                          event.stopPropagation();
                          goToBooking(servicio);
                        }}
                      >
                        Agendar
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      <section style={splitSectionStyle}>
        <div style={splitGridStyle}>
          <motion.div style={imageGridStyle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.img
              variants={fadeInUp}
              src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=85"
              alt="Trabajo de barberia"
              style={imageLargeStyle}
            />
            <motion.img
              variants={fadeInUp}
              src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=700&q=85"
              alt="Afeitado profesional"
              style={imageSmallStyle}
            />
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.div style={smallLabelStyle} variants={fadeInUp}>
              Experiencia
            </motion.div>
            <motion.h2 style={{ ...sectionTitleStyle, letterSpacing: 1 }} variants={fadeInUp}>
              Mas que un corte
            </motion.h2>
            <motion.p style={{ ...sectionTextStyle, marginTop: 22 }} variants={fadeInUp}>
              Cada cita combina tecnica, detalle y puntualidad. Elige servicio, sucursal, barbero y horario desde el sitio.
            </motion.p>

            <motion.div style={featureListStyle} variants={staggerContainer}>
              {[
                { icon: faCalendarCheck, title: 'Reserva con pago seguro', text: 'Confirma tu horario pagando el total del servicio.' },
                { icon: faStar, title: 'Paquetes premium', text: 'Corte, barba, lavado, masaje y tratamientos segun el paquete.' },
                { icon: faLocationDot, title: 'Atencion por sucursal', text: 'Consulta disponibilidad real antes de confirmar.' },
              ].map((item) => (
                <motion.div key={item.title} style={featureItemStyle} variants={fadeInUp}>
                  <span style={{ color: colors.doradoClasico, fontSize: 22 }}>
                    <FontAwesomeIcon icon={item.icon} />
                  </span>
                  <div>
                    <strong style={{ color: '#111111', fontSize: 18 }}>{item.title}</strong>
                    <p style={{ color: '#66717D', margin: '6px 0 0', lineHeight: 1.6 }}>{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};
