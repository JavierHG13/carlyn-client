import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faClock,
  faMapMarkerAlt,
  faPhone,
  faScissors,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../styles/colors';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

export const Nosotros: React.FC = () => {
  const pageStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    color: '#111111',
    overflowX: 'hidden',
  };

  const heroStyle: React.CSSProperties = {
    minHeight: '64vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    backgroundImage:
      'linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.52) 45%, rgba(0,0,0,0.2) 100%), url("https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1900&q=85")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const heroInnerStyle: React.CSSProperties = {
    width: 'min(1180px, calc(100% - 48px))',
    margin: '0 auto',
    padding: '128px 0 82px',
  };

  const eyebrowStyle: React.CSSProperties = {
    color: colors.doradoClasico,
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 5,
    textTransform: 'uppercase',
    marginBottom: 18,
  };

  const heroTitleStyle: React.CSSProperties = {
    maxWidth: 760,
    color: '#FFFFFF',
    fontFamily: 'Lato, sans-serif',
    fontSize: 'clamp(52px, 7vw, 98px)',
    lineHeight: 0.95,
    fontWeight: 400,
    letterSpacing: 2,
    textTransform: 'uppercase',
    margin: 0,
  };

  const heroTextStyle: React.CSSProperties = {
    maxWidth: 620,
    color: 'rgba(255,255,255,0.86)',
    fontSize: 'clamp(17px, 2vw, 21px)',
    lineHeight: 1.7,
    margin: '28px 0 0',
  };

  const sectionStyle: React.CSSProperties = {
    padding: '92px 32px',
  };

  const sectionAltStyle: React.CSSProperties = {
    ...sectionStyle,
    backgroundColor: '#F7F7F7',
  };

  const sectionInnerStyle: React.CSSProperties = {
    width: 'min(1180px, 100%)',
    margin: '0 auto',
  };

  const splitGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 54,
    alignItems: 'center',
  };

  const labelStyle: React.CSSProperties = {
    color: '#C40000',
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 12,
  };

  const titleStyle: React.CSSProperties = {
    color: '#111111',
    fontFamily: 'Playfair Display, serif',
    fontSize: 'clamp(36px, 5vw, 58px)',
    lineHeight: 1.08,
    margin: 0,
  };

  const bodyTextStyle: React.CSSProperties = {
    color: '#4D5A67',
    fontSize: 17,
    lineHeight: 1.85,
    margin: '22px 0 0',
  };

  const imagePanelStyle: React.CSSProperties = {
    minHeight: 460,
    backgroundImage:
      'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.18)), url("https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1000&q=85")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    border: '1px solid rgba(0,0,0,0.08)',
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 1,
    border: '1px solid rgba(0,0,0,0.08)',
    marginTop: 34,
  };

  const statItemStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    padding: '24px 20px',
  };

  const cardsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 22,
    marginTop: 38,
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    border: '1px solid rgba(0,0,0,0.08)',
    padding: 30,
    minHeight: 190,
    boxShadow: '0 18px 45px rgba(0,0,0,0.06)',
  };

  const iconBoxStyle: React.CSSProperties = {
    width: 46,
    height: 46,
    display: 'grid',
    placeItems: 'center',
    backgroundColor: '#FAF4E8',
    color: colors.doradoClasico,
    marginBottom: 20,
    fontSize: 20,
  };

  const contactGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'minmax(300px, 0.78fr) minmax(360px, 1fr)',
    gap: 28,
  };

  const contactCardStyle: React.CSSProperties = {
    backgroundColor: '#111111',
    color: '#FFFFFF',
    padding: 38,
    display: 'grid',
    gap: 22,
  };

  const contactItemStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '34px 1fr',
    gap: 14,
    alignItems: 'start',
    paddingBottom: 18,
    borderBottom: '1px solid rgba(255,255,255,0.13)',
  };

  const mapStyle: React.CSSProperties = {
    width: '100%',
    minHeight: 440,
    border: 0,
    display: 'block',
    filter: 'grayscale(0.15)',
  };

  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <motion.div style={heroInnerStyle} initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div style={eyebrowStyle} variants={fadeInUp}>
            Barberia Carlyn
          </motion.div>
          <motion.h1 style={heroTitleStyle} variants={fadeInUp}>
            Tradicion, detalle y estilo en cada corte
          </motion.h1>
          <motion.p style={heroTextStyle} variants={fadeInUp}>
            Somos una barberia enfocada en ofrecer una experiencia cuidada, puntual y profesional para cada cliente.
          </motion.p>
        </motion.div>
      </section>

      <section style={sectionStyle}>
        <div style={sectionInnerStyle}>
          <div style={splitGridStyle}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.div style={labelStyle} variants={fadeInUp}>
                Nuestra historia
              </motion.div>
              <motion.h2 style={titleStyle} variants={fadeInUp}>
                Una barberia hecha para cuidar cada detalle
              </motion.h2>
              <motion.p style={bodyTextStyle} variants={fadeInUp}>
                Somos una barberia con mas de 10 anos de experiencia ofreciendo servicios de alta calidad.
                Nos especializamos en cortes modernos y clasicos, siempre cuidando que cada cliente reciba
                una atencion clara, comoda y bien ejecutada.
              </motion.p>

              <motion.div style={statsGridStyle} variants={fadeInUp}>
                {[
                  { value: '10+', label: 'anos de experiencia' },
                  { value: '4', label: 'paquetes activos' },
                  { value: '1', label: 'sucursal principal' },
                ].map((item) => (
                  <div key={item.label} style={statItemStyle}>
                    <strong style={{ color: colors.doradoClasico, fontSize: 34, lineHeight: 1 }}>{item.value}</strong>
                    <p style={{ color: '#4D5A67', margin: '8px 0 0', fontSize: 14 }}>{item.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              style={imagePanelStyle}
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            />
          </div>
        </div>
      </section>

      <section style={sectionAltStyle}>
        <div style={sectionInnerStyle}>
          <div style={{ maxWidth: 760 }}>
            <div style={labelStyle}>Forma de trabajo</div>
            <h2 style={titleStyle}>Lo que buscamos en cada servicio</h2>
          </div>

          <motion.div style={cardsGridStyle} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            {[
              {
                icon: faScissors,
                title: 'Tecnica y precision',
                text: 'Cortes clasicos y modernos trabajados con cuidado en el detalle.',
              },
              {
                icon: faStar,
                title: 'Experiencia completa',
                text: 'Servicios pensados para que el cliente salga satisfecho desde la atencion hasta el acabado.',
              },
              {
                icon: faCalendarCheck,
                title: 'Reservas organizadas',
                text: 'Horarios disponibles y flujo de cita claro para evitar esperas innecesarias.',
              },
            ].map((item) => (
              <motion.article key={item.title} style={cardStyle} variants={fadeInUp}>
                <div style={iconBoxStyle}>
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <h3 style={{ margin: 0, fontSize: 24, color: '#111111' }}>{item.title}</h3>
                <p style={{ margin: '12px 0 0', color: '#53606D', lineHeight: 1.7 }}>{item.text}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={sectionInnerStyle}>
          <div style={{ marginBottom: 34 }}>
            <div style={labelStyle}>Ubicacion</div>
            <h2 style={titleStyle}>Visitanos</h2>
          </div>

          <div style={contactGridStyle}>
            <div style={contactCardStyle}>
              <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: 28 }}>Barberia Carlyn</h3>
              {[
                {
                  icon: faMapMarkerAlt,
                  title: 'Direccion',
                  text: 'Boulevard Adolfo Lopez Mateos, 43000 Huejutla, Hidalgo',
                },
                {
                  icon: faPhone,
                  title: 'Telefono',
                  text: '771 261 3445',
                },
                {
                  icon: faClock,
                  title: 'Horario',
                  text: 'Lun - Sab / 8:00 AM - 8:00 PM',
                },
              ].map((item) => (
                <div key={item.title} style={contactItemStyle}>
                  <FontAwesomeIcon icon={item.icon} style={{ color: colors.doradoClasico, fontSize: 20, marginTop: 2 }} />
                  <div>
                    <strong style={{ display: 'block', color: '#FFFFFF', marginBottom: 4 }}>{item.title}</strong>
                    <span style={{ color: 'rgba(255,255,255,0.76)', lineHeight: 1.6 }}>{item.text}</span>
                  </div>
                </div>
              ))}
            </div>

            <iframe
              title="Ubicacion Barberia Carlyn"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.1534806557192!2d-98.40908632496514!3d21.146289480532634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d726a1ff0378ed%3A0xc011b089d03a4b72!2sAdolfo%20L%C3%B3pez%20Mateos%2C%2043000%20Hgo.!5e0!3m2!1ses!2smx!4v1776176110759!5m2!1ses!2smx"
              style={mapStyle}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  );
};
