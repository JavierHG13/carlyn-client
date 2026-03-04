// src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
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

export const Home: React.FC = () => {
  const navigate = useNavigate();

  // Datos de ejemplo para la presentación
  const services = [
    { id: 1, name: 'Corte Clásico', description: 'Corte de cabello tradicional con navaja y tijera', price: '$15', duration: '45 min', icon: faScissors },
    { id: 2, name: 'Afeitado Profesional', description: 'Afeitado con toalla caliente y productos premium', price: '$20', duration: '60 min', icon: faScissors },
    { id: 3, name: 'Corte + Barba', description: 'Combo completo para una imagen impecable', price: '$30', duration: '90 min', icon: faScissors },
    { id: 4, name: 'Arreglo de Barba', description: 'Diseño y perfilado de barba', price: '$12', duration: '30 min', icon: faUser },
    { id: 5, name: 'Tratamiento Capilar', description: 'Hidratación y cuidado para tu cabello', price: '$25', duration: '60 min', icon: faFaceSmile },
    { id: 6, name: 'Corte Infantil', description: 'Cortes modernos para los más pequeños', price: '$10', duration: '30 min', icon: faScissors },
  ];

  const barbers = [
    { id: 1, name: 'Carlos Martínez', specialty: 'Especialista en cortes clásicos', experience: '8 años', rating: 4.9, image: '👨‍🦰' },
    { id: 2, name: 'Miguel Ángel', specialty: 'Maestro de la barba y el diseño', experience: '10 años', rating: 5.0, image: '👨‍🦱' },
    { id: 3, name: 'Juan Pérez', specialty: 'Cortes modernos y tendencias', experience: '5 años', rating: 4.8, image: '👨‍🦲' },
    { id: 4, name: 'Roberto Sánchez', specialty: 'Tratamientos capilares', experience: '6 años', rating: 4.9, image: '👨‍🦳' },
  ];

  const testimonials = [
    { id: 1, name: 'Luis García', text: 'Excelente servicio, el mejor corte que me han hecho. El ambiente es muy acogedor y los barberos son verdaderos profesionales.', rating: 5 },
    { id: 2, name: 'Ana Rodríguez', text: 'Llevé a mi hijo y quedó encantado. Muy buen trato y atención personalizada. Volveremos sin duda.', rating: 5 },
    { id: 3, name: 'Carlos Mendoza', text: 'La barbería tiene un estilo único. La atención es de primera y los precios son muy accesibles.', rating: 5 },
  ];

  const stats = [
    { id: 1, value: '10+', label: 'Años de experiencia', icon: faCrown },
    { id: 2, value: '15K+', label: 'Clientes satisfechos', icon: faFaceSmile },
    { id: 3, value: '6', label: 'Barberos expertos', icon: faUser },
    { id: 4, value: '30+', label: 'Servicios disponibles', icon: faScissors },
  ];

  // --- Estilos ---
  const containerStyle: React.CSSProperties = {
    width: '100%',
    overflowX: 'hidden',
  };

  

  // Hero Section
  const heroStyle: React.CSSProperties = {
    background: `linear-gradient(rgba(54, 69, 79, 0.9), rgba(54, 69, 79, 0.9)), url('/api/placeholder/1920/600')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '100px 24px',
    textAlign: 'center',
  };

  const heroContentStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
  };

  const heroTitleStyle: React.CSSProperties = {
    color: colors.blancoHueso,
    fontSize: '56px',
    marginBottom: '20px',
    lineHeight: 1.2,
  };

  const heroSubtitleStyle: React.CSSProperties = {
    color: colors.blancoHueso,
    fontSize: '20px',
    marginBottom: '40px',
    opacity: 0.9,
  };

  const heroButtonsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
  };

  // Sección general
  const sectionStyle = (bgColor: string = 'transparent'): React.CSSProperties => ({
    padding: '80px 24px',
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
  };

  const sectionSubtitleStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '18px',
    color: colors.azulAcero,
    maxWidth: '700px',
    margin: '0 auto 60px',
  };

  // Grid de servicios
  const servicesGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
  };

  const serviceCardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
    border: `1px solid ${colors.azulAcero}20`,
  };

  const serviceIconStyle: React.CSSProperties = {
    fontSize: '40px',
    color: colors.doradoClasico,
    marginBottom: '20px',
  };

  const serviceNameStyle: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: 700,
    marginBottom: '10px',
    color: colors.negroSuave,
  };

  const serviceDescriptionStyle: React.CSSProperties = {
    color: colors.azulAcero,
    marginBottom: '20px',
    lineHeight: 1.6,
  };

  const serviceFooterStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: `1px solid ${colors.azulAcero}20`,
    paddingTop: '20px',
  };

  const servicePriceStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    color: colors.doradoClasico,
  };

  const serviceDurationStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: colors.azulAcero,
  };

  // Grid de barberos
  const barbersGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
  };

  const barberCardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px 20px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s',
  };

  const barberImageStyle: React.CSSProperties = {
    fontSize: '80px',
    marginBottom: '20px',
  };

  const barberNameStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '5px',
    color: colors.negroSuave,
  };

  const barberSpecialtyStyle: React.CSSProperties = {
    color: colors.azulAcero,
    marginBottom: '10px',
  };

  const barberRatingStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    color: colors.doradoClasico,
    marginBottom: '10px',
  };

  const barberExperienceStyle: React.CSSProperties = {
    color: colors.azulAcero,
    fontSize: '14px',
  };

  // Stats
  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
    textAlign: 'center',
  };

  const statItemStyle: React.CSSProperties = {
    padding: '30px',
  };

  const statIconStyle: React.CSSProperties = {
    fontSize: '48px',
    color: colors.doradoClasico,
    marginBottom: '15px',
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: '42px',
    fontWeight: 700,
    color: colors.negroSuave,
    marginBottom: '5px',
  };

  const statLabelStyle: React.CSSProperties = {
    color: colors.azulAcero,
    fontSize: '16px',
  };

  // Testimonios
  const testimonialsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
  };

  const testimonialCardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    position: 'relative',
  };

  const quoteIconStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    fontSize: '40px',
    color: `${colors.doradoClasico}20`,
  };

  const testimonialTextStyle: React.CSSProperties = {
    color: colors.azulAcero,
    lineHeight: 1.8,
    marginBottom: '20px',
    fontStyle: 'italic',
  };

  const testimonialAuthorStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 700,
    color: colors.negroSuave,
    marginBottom: '5px',
  };

  // CTA Section
  const ctaStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${colors.grafito} 0%, ${colors.azulAcero} 100%)`,
    padding: '80px 24px',
    textAlign: 'center',
  };

  const ctaTitleStyle: React.CSSProperties = {
    color: colors.blancoHueso,
    marginBottom: '20px',
  };

  const ctaTextStyle: React.CSSProperties = {
    color: colors.blancoHueso,
    fontSize: '18px',
    maxWidth: '600px',
    margin: '0 auto 40px',
    opacity: 0.9,
  };

  return (
    <div style={containerStyle}>
  
      {/* Hero Section */}
      <section id="inicio" style={heroStyle}>
        <div style={heroContentStyle}>
          <h1 style={heroTitleStyle}>
            Tradición y Estilo en Cada Corte
          </h1>
          <p style={heroSubtitleStyle}>
            Más de 10 años ofreciendo servicios de barbería de alta calidad. 
            Donde la tradición se encuentra con las tendencias modernas.
          </p>
          <div style={heroButtonsStyle}>
            <Button variant="accent" size="large">
              <FontAwesomeIcon icon={faCalendarCheck} style={{ marginRight: '8px' }} />
              Agendar Cita
            </Button>
            <Button variant="secondary" size="large">
              Conocer Más
              <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '8px' }} />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={sectionStyle(colors.blancoHueso)}>
        <div style={sectionContentStyle}>
          <div style={statsGridStyle}>
            {stats.map(stat => (
              <div key={stat.id} style={statItemStyle}>
                <FontAwesomeIcon icon={stat.icon} style={statIconStyle} />
                <div style={statValueStyle}>{stat.value}</div>
                <div style={statLabelStyle}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section id="servicios" style={sectionStyle()}>
        <div style={sectionContentStyle}>
          <h2 style={sectionTitleStyle}>Nuestros Servicios</h2>
          <p style={sectionSubtitleStyle}>
            Ofrecemos una amplia gama de servicios de barbería, 
            utilizando productos de alta calidad y técnicas profesionales.
          </p>
          
          <div style={servicesGridStyle}>
            {services.map(service => (
              <div 
                key={service.id} 
                style={serviceCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                <FontAwesomeIcon icon={service.icon} style={serviceIconStyle} />
                <h3 style={serviceNameStyle}>{service.name}</h3>
                <p style={serviceDescriptionStyle}>{service.description}</p>
                <div style={serviceFooterStyle}>
                  <span style={servicePriceStyle}>{service.price}</span>
                  <span style={serviceDurationStyle}>
                    <FontAwesomeIcon icon={faClock} />
                    {service.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Barberos Section */}
      <section id="barberos" style={sectionStyle(colors.blancoHueso)}>
        <div style={sectionContentStyle}>
          <h2 style={sectionTitleStyle}>Nuestros Barberos</h2>
          <p style={sectionSubtitleStyle}>
            Profesionales apasionados por su oficio, dedicados a realzar tu estilo
          </p>
          
          <div style={barbersGridStyle}>
            {barbers.map(barber => (
              <div 
                key={barber.id} 
                style={barberCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={barberImageStyle}>{barber.image}</div>
                <h3 style={barberNameStyle}>{barber.name}</h3>
                <p style={barberSpecialtyStyle}>{barber.specialty}</p>
                <div style={barberRatingStyle}>
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <span>({barber.rating})</span>
                </div>
                <p style={barberExperienceStyle}>{barber.experience} de experiencia</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios Section */}
      <section id="testimonios" style={sectionStyle()}>
        <div style={sectionContentStyle}>
          <h2 style={sectionTitleStyle}>Lo que dicen nuestros clientes</h2>
          <p style={sectionSubtitleStyle}>
            La satisfacción de nuestros clientes es nuestro mejor aval
          </p>
          
          <div style={testimonialsGridStyle}>
            {testimonials.map(testimonial => (
              <div key={testimonial.id} style={testimonialCardStyle}>
                <FontAwesomeIcon icon={faQuoteRight} style={quoteIconStyle} />
                <p style={testimonialTextStyle}>"{testimonial.text}"</p>
                <div style={testimonialAuthorStyle}>{testimonial.name}</div>
                <div style={barberRatingStyle}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} style={{ color: colors.doradoClasico }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={ctaStyle}>
        <div style={sectionContentStyle}>
          <h2 style={{...ctaTitleStyle, ...sectionTitleStyle}}>
            ¿Listo para un cambio de imagen?
          </h2>
          <p style={ctaTextStyle}>
            Reserva tu cita ahora y obtén un 10% de descuento en tu primera visita
          </p>
          <Button variant="accent" size="large">
            <FontAwesomeIcon icon={faCalendarCheck} style={{ marginRight: '8px' }} />
            Agendar Cita Ahora
          </Button>
        </div>
      </section>

    </div>
  );
};