import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useAnimation, Variants } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faScissors,
  faCalendarCheck,
  faUser,
  faStar,
  faClock,
  faArrowRight,
  faQuoteRight,
  faFaceSmile,
  faCrown,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components/common/Button';
import { colors } from '../../styles/colors';
import { servicioService } from '../../services/servicioService';
import type { Servicio } from '../../types/servicio';

// Hook para contador animado
const useCountUp = (end: number, duration: number = 2000, startOnView: boolean = true) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (startOnView && !isInView) return;
    if (hasStarted) return;
    
    setHasStarted(true);
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, isInView, startOnView, hasStarted]);

  return { count, ref };
};

// Variantes de animacion
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  
  // Estado para servicios desde la BD
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loadingServicios, setLoadingServicios] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Stats con contadores (datos reales basados en servicios)
  const statsData = [
    { id: 1, value: 10, suffix: '+', label: 'Años de experiencia', icon: faCrown },
    { id: 2, value: 15, suffix: 'K+', label: 'Clientes satisfechos', icon: faFaceSmile },
    { id: 3, value: 6, suffix: '', label: 'Barberos expertos', icon: faUser },
    { id: 4, value: servicios.length, suffix: '+', label: 'Servicios disponibles', icon: faScissors },
  ];

  // Cargar servicios desde la BD
  useEffect(() => {
    const loadServicios = async () => {
      try {
        setLoadingServicios(true);
        const data = await servicioService.getAll();
        // Filtrar solo servicios activos
        const activeServices = data.filter(servicio => servicio.activo === true);
        setServicios(activeServices);
      } catch (error) {
        console.error('Error loading servicios:', error);
      } finally {
        setLoadingServicios(false);
      }
    };
    loadServicios();
  }, []);

  const handleImageError = (servicioId: number) => {
    setImageErrors(prev => ({ ...prev, [servicioId]: true }));
  };

  // Estilos
  const containerStyle: React.CSSProperties = {
    width: '100%',
    overflowX: 'hidden',
  };

  const heroStyle: React.CSSProperties = {
    backgroundImage: `url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1170&auto=format&fit=crop')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  const heroContentStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '0 24px',
  };

  const heroTitleStyle: React.CSSProperties = {
    color: colors.blancoHueso,
    fontSize: 'clamp(36px, 8vw, 64px)',
    marginBottom: '24px',
    lineHeight: 1.1,
    fontWeight: 600,
    textShadow: '0 4px 30px rgba(0,0,0,0.3)',
  };

  const heroSubtitleStyle: React.CSSProperties = {
    color: colors.blancoHueso,
    fontSize: 'clamp(16px, 2.5vw, 20px)',
    marginBottom: '48px',
    opacity: 0.9,
    lineHeight: 1.6,
    maxWidth: '600px',
    margin: '0 auto 48px',
  };

  const heroButtonsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  const sectionStyle = (bgColor: string = 'transparent'): React.CSSProperties => ({
    padding: 'clamp(60px, 10vw, 100px) 24px',
    backgroundColor: bgColor,
  });

  const sectionContentStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const sectionTitleStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '16px',
    color: colors.negroSuave,
    fontSize: 'clamp(28px, 5vw, 42px)',
    fontWeight: 600,
  };

  const sectionSubtitleStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '18px',
    color: colors.azulAcero,
    maxWidth: '700px',
    margin: '0 auto 60px',
    lineHeight: 1.6,
  };

  const servicesGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '30px',
  };

  const serviceCardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: `1px solid ${colors.azulAcero}15`,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const serviceImageContainerStyle: React.CSSProperties = {
    height: '220px',
    overflow: 'hidden',
    position: 'relative',
  };

  const serviceImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  };

  const serviceNoImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grafito,
    color: colors.blancoHueso,
    fontSize: '48px',
  };

  const serviceContentStyle: React.CSSProperties = {
    padding: '24px',
  };

  const serviceNameStyle: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: 600,
    marginBottom: '12px',
    color: colors.negroSuave,
  };

  const serviceDescriptionStyle: React.CSSProperties = {
    color: colors.azulAcero,
    marginBottom: '20px',
    lineHeight: 1.6,
    fontSize: '14px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  const serviceFooterStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: `1px solid ${colors.azulAcero}15`,
    paddingTop: '16px',
  };

  const servicePriceStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    color: colors.doradoClasico,
  };

  const serviceDurationStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: colors.azulAcero,
    fontSize: '14px',
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    textAlign: 'center',
  };

  const statItemStyle: React.CSSProperties = {
    padding: '20px',
  };

  const statIconStyle: React.CSSProperties = {
    fontSize: '48px',
    color: colors.doradoClasico,
    marginBottom: '16px',
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: 700,
    color: colors.negroSuave,
    marginBottom: '8px',
    fontFamily: 'Playfair Display, serif',
  };

  const statLabelStyle: React.CSSProperties = {
    color: colors.azulAcero,
    fontSize: '15px',
  };

  const ctaStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${colors.grafito} 0%, ${colors.azulAcero} 100%)`,
    padding: 'clamp(60px, 10vw, 100px) 24px',
    textAlign: 'center',
  };

  const ctaTitleStyle: React.CSSProperties = {
    color: colors.blancoHueso,
    marginBottom: '20px',
    fontSize: 'clamp(28px, 5vw, 40px)',
    fontWeight: 600,
  };

  const ctaTextStyle: React.CSSProperties = {
    color: colors.blancoHueso,
    fontSize: '18px',
    maxWidth: '600px',
    margin: '0 auto 40px',
    opacity: 0.9,
    lineHeight: 1.6,
  };

  // Componente Stat con contador
  const StatItem: React.FC<{ stat: typeof statsData[0]; index: number }> = ({ stat, index }) => {
    const { count, ref } = useCountUp(stat.value, 2000);
    
    return (
      <motion.div
        ref={ref}
        style={statItemStyle}
        variants={scaleUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: index * 0.1 }}
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FontAwesomeIcon icon={stat.icon} style={statIconStyle} />
        </motion.div>
        <div style={statValueStyle}>{count}{stat.suffix}</div>
        <div style={statLabelStyle}>{stat.label}</div>
      </motion.div>
    );
  };

  return (
    <div style={containerStyle}>

      {/* Hero Section */}
      <section id="inicio" style={heroStyle}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,16,20,0.6) 0%, rgba(10,16,20,0.4) 40%, rgba(10,16,20,0.75) 100%)',
        }} />
        
        <motion.div
          style={{ ...heroContentStyle, position: 'relative', zIndex: 1 }}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 style={heroTitleStyle} variants={fadeInUp}>
            Tradición y Estilo en Cada Corte
          </motion.h1>
          <motion.p style={heroSubtitleStyle} variants={fadeInUp}>
            Más de 10 años ofreciendo servicios de barbería de alta calidad.
            Donde la tradición se encuentra con las tendencias modernas.
          </motion.p>
          <motion.div style={heroButtonsStyle} variants={fadeInUp}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button variant="accent" size="large">
                <FontAwesomeIcon icon={faCalendarCheck} style={{ marginRight: '8px' }} />
                Agendar Cita
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button variant="secondary" size="large">
                Conocer Más
                <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '8px' }} />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div style={{
            width: '30px',
            height: '50px',
            border: '2px solid rgba(255,255,255,0.4)',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '8px',
          }}>
            <motion.div
              style={{
                width: '6px',
                height: '10px',
                backgroundColor: colors.doradoClasico,
                borderRadius: '3px',
              }}
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* Servicios Section - Con datos reales de la BD */}
      <section id="servicios" style={sectionStyle()}>
        <div style={sectionContentStyle}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 style={sectionTitleStyle}>Nuestros Servicios</h2>
            <p style={sectionSubtitleStyle}>
              Ofrecemos una amplia gama de servicios de barbería,
              utilizando productos de alta calidad y técnicas profesionales.
            </p>
          </motion.div>

          {loadingServicios ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <p>Cargando servicios...</p>
            </div>
          ) : servicios.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <p>No hay servicios disponibles por el momento.</p>
            </div>
          ) : (
            <motion.div
              style={servicesGridStyle}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {servicios.map((servicio, index) => (
                <motion.div
                  key={servicio.id}
                  style={serviceCardStyle}
                  variants={fadeInUp}
                  whileHover={{ 
                    y: -8, 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => navigate(`/servicios/${servicio.id}`)}
                >
                  <div style={serviceImageContainerStyle}>
                    {servicio.imagen_url && !imageErrors[servicio.id] ? (
                      <motion.img
                        src={servicio.imagen_url}
                        alt={servicio.nombre}
                        style={serviceImageStyle}
                        onError={() => handleImageError(servicio.id)}
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.4 }}
                      />
                    ) : (
                      <div style={serviceNoImageStyle}>
                        <FontAwesomeIcon icon={faScissors} />
                      </div>
                    )}
                  </div>
                  <div style={serviceContentStyle}>
                    <h3 style={serviceNameStyle}>{servicio.nombre}</h3>
                    {servicio.descripcion && (
                      <p style={serviceDescriptionStyle}>
                        {servicio.descripcion}
                      </p>
                    )}
                  
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Section 
      <section style={sectionStyle(colors.blancoHueso)}>
        <div style={sectionContentStyle}>
          <div style={statsGridStyle}>
            {statsData.map((stat, index) => (
              <StatItem key={stat.id} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section style={ctaStyle}>
        <motion.div
          style={sectionContentStyle}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <h2 style={ctaTitleStyle}>
            ¿Listo para un cambio de imagen?
          </h2>
          <p style={ctaTextStyle}>
            Reserva tu cita ahora y obtén un 10% de descuento en tu primera visita
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button variant="accent" size="large">
              <FontAwesomeIcon icon={faCalendarCheck} style={{ marginRight: '8px' }} />
              Agendar Cita Ahora
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};