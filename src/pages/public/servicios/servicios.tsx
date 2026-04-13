import React, { useEffect, useState } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';
import { useInView } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faScissors,
  faSpinner,
  faClock,
  faDollarSign,
  faCalendarCheck,
  faArrowRight,
  faStar,
  faStarHalfAlt,
  faTag,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { servicioService } from '../../../services/servicioService';
import type { Servicio } from '../../../types/servicio';
import { colors } from '../../../styles/colors';

// Variantes de animación
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

export const ServiciosPublicos: React.FC = () => {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'precio_asc' | 'precio_desc' | 'nombre'>('precio_asc');

  useEffect(() => {
    loadServicios();
  }, []);

  const loadServicios = async () => {
    try {
      setLoading(true);
      const data = await servicioService.getAll();
      setServicios(data);
    } catch (error) {
      console.error('Error loading servicios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener categorías únicas
  const categorias = ['todos', ...new Set(servicios.map(s => s.categoria).filter(Boolean))];

  // Filtrar y ordenar servicios
  const serviciosFiltrados = servicios
    .filter(servicio => {
      if (selectedCategory === 'todos') return true;
      return servicio.categoria === selectedCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'precio_asc') return a.precio - b.precio;
      if (sortBy === 'precio_desc') return b.precio - a.precio;
      return a.nombre.localeCompare(b.nombre);
    });

  const containerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '60px 24px',
    minHeight: '100vh',
    backgroundColor: colors.blancoHueso,
  };

  // Hero Section
  const heroStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${colors.grafito} 0%, ${colors.azulAcero} 100%)`,
    borderRadius: '24px',
    padding: 'clamp(40px, 8vw, 80px) clamp(24px, 5vw, 60px)',
    marginBottom: '60px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  };

  const heroTitleStyle: React.CSSProperties = {
    color: colors.blancoHueso,
    fontSize: 'clamp(32px, 5vw, 48px)',
    fontWeight: 700,
    marginBottom: '16px',
    fontFamily: 'Playfair Display, serif',
  };

  const heroSubtitleStyle: React.CSSProperties = {
    color: colors.blancoHueso,
    fontSize: 'clamp(14px, 2vw, 18px)',
    maxWidth: '600px',
    margin: '0 auto',
    opacity: 0.9,
    lineHeight: 1.6,
  };

  // Filtros y ordenamiento
  const filtersStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '40px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  };

  const categoriesStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  };

  const categoryButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '8px 20px',
    borderRadius: '30px',
    border: `1px solid ${isActive ? colors.doradoClasico : colors.azulAcero}30`,
    backgroundColor: isActive ? colors.doradoClasico : 'transparent',
    color: isActive ? 'white' : colors.azulAcero,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s',
  });

  const sortSelectStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '30px',
    border: `1px solid ${colors.azulAcero}30`,
    backgroundColor: 'white',
    color: colors.azulAcero,
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    outline: 'none',
  };

  // Grid de servicios
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '30px',
    marginBottom: '40px',
  };

  // Tarjeta de servicio
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  const cardImageContainerStyle: React.CSSProperties = {
    height: '220px',
    backgroundColor: `linear-gradient(135deg, ${colors.grafito} 0%, ${colors.azulAcero} 100%)`,
    position: 'relative',
    overflow: 'hidden',
  };

  const cardImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s',
  };

  const cardContentStyle: React.CSSProperties = {
    padding: '24px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: 600,
    color: colors.negroSuave,
    marginBottom: '8px',
    fontFamily: 'Playfair Display, serif',
  };

  const cardDescriptionStyle: React.CSSProperties = {
    fontSize: '14px',
    color: colors.azulAcero,
    lineHeight: 1.6,
    marginBottom: '20px',
    flex: 1,
  };

  const cardInfoStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingTop: '16px',
    borderTop: `1px solid ${colors.azulAcero}15`,
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

  const buttonStyle: React.CSSProperties = {
    padding: '12px',
    backgroundColor: colors.grafito,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background-color 0.2s',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '80px',
    backgroundColor: 'white',
    borderRadius: '24px',
    color: '#718096',
  };

  // Componente de tarjeta animada
  const ServicioCardItem: React.FC<{ servicio: Servicio; index: number }> = ({ servicio, index }) => {
    const [imageError, setImageError] = useState(false);
    const controls = useAnimation();
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    React.useEffect(() => {
      if (isInView) {
        controls.start('visible');
      }
    }, [isInView, controls]);

    const cardVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: index * 0.05 }
      }
    };

    return (
      <motion.div
        ref={ref}
        style={cardStyle}
        variants={cardVariants}
        initial="hidden"
        animate={controls}
        whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={() => navigate(`/servicios/${servicio.id}`)}
      >
        <div style={cardImageContainerStyle}>
          {servicio.imagen_url && !imageError ? (
            <motion.img
              src={servicio.imagen_url}
              alt={servicio.nombre}
              style={cardImageStyle}
              onError={() => setImageError(true)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              color: colors.blancoHueso,
              background: `linear-gradient(135deg, ${colors.grafito} 0%, ${colors.azulAcero} 100%)`,
            }}>
              <FontAwesomeIcon icon={faScissors} />
            </div>
          )}
          {servicio.categoria && (
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              padding: '4px 12px',
              backgroundColor: colors.doradoClasico,
              color: 'white',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 500,
            }}>
              {servicio.categoria}
            </div>
          )}
        </div>

        <div style={cardContentStyle}>
          <h3 style={cardTitleStyle}>{servicio.nombre}</h3>
          {servicio.descripcion && (
            <p style={cardDescriptionStyle}>
              {servicio.descripcion.length > 100
                ? `${servicio.descripcion.substring(0, 100)}...`
                : servicio.descripcion}
            </p>
          )}

          <div style={cardInfoStyle}>
            <span style={priceStyle}>${servicio.precio}</span>
          </div>

          <motion.button
            style={buttonStyle}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/agendar-cita?servicioId=${servicio.id}&servicioNombre=${encodeURIComponent(servicio.nombre)}&precio=${servicio.precio}&duracion=${servicio.duracion}`);
            }}
          >
            <FontAwesomeIcon icon={faCalendarCheck} />
            Agendar
          </motion.button>

        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '80px' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FontAwesomeIcon icon={faSpinner} style={{ fontSize: '48px', color: colors.doradoClasico }} />
          </motion.div>
          <p style={{ marginTop: '20px', color: colors.azulAcero }}>Cargando servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>

      {/* Filtros y Ordenamiento */}
      {/*<motion.div
        style={filtersStyle}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div style={categoriesStyle}>
          {categorias.map(cat => (
            <motion.button
              key={cat}
              style={categoryButtonStyle(selectedCategory === cat)}
              onClick={() => setSelectedCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {cat === 'todos' ? 'Todos' : cat}
            </motion.button>
          ))}
        </div>

        <select
          style={sortSelectStyle}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="precio_asc">Precio: Menor a Mayor</option>
          <option value="precio_desc">Precio: Mayor a Menor</option>
          <option value="nombre">Nombre: A a Z</option>
        </select>
      </motion.div> */}

      {/* Grid de Servicios */}
      {serviciosFiltrados.length === 0 ? (
        <motion.div
          style={emptyStateStyle}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <FontAwesomeIcon icon={faScissors} style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
          <h3>No se encontraron servicios</h3>
          <p>No hay servicios disponibles en esta categoría.</p>
        </motion.div>
      ) : (
        <>
          <div style={gridStyle}>
            {serviciosFiltrados.map((servicio, index) => (
              <ServicioCardItem key={servicio.id} servicio={servicio} index={index} />
            ))}
          </div>

          {/* Resultados */}
          <motion.div
            style={{ textAlign: 'center', marginTop: '20px', color: colors.azulAcero, fontSize: '14px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Mostrando {serviciosFiltrados.length} de {servicios.length} servicios
          </motion.div>
        </>
      )}
    </div>
  );
};