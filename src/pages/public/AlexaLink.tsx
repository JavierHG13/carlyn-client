import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faCalendarCheck,
  faExternalLinkAlt,
  faMicrophone,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../styles/colors';

const alexaSkillUrl =
  import.meta.env.VITE_ALEXA_SKILL_URL || 'https://www.amazon.com/alexa-skills/b?node=13727921011';

export const AlexaLink: React.FC = () => {
  const navigate = useNavigate();

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: colors.blancoHueso,
  };

  const heroStyle: React.CSSProperties = {
    minHeight: '62vh',
    display: 'grid',
    alignItems: 'center',
    backgroundImage:
      "linear-gradient(90deg, rgba(26,26,26,0.86), rgba(52,73,94,0.62)), url('https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1400&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: colors.blancoHueso,
    padding: '110px 24px 72px',
  };

  const contentStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '1120px',
    margin: '0 auto',
  };

  const eyebrowStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    color: colors.doradoClasico,
    fontSize: '14px',
    fontWeight: 700,
    marginBottom: '18px',
    textTransform: 'uppercase',
  };

  const titleStyle: React.CSSProperties = {
    maxWidth: '760px',
    fontSize: 'clamp(36px, 6vw, 58px)',
    lineHeight: 1.08,
    margin: '0 0 22px',
    fontWeight: 700,
  };

  const textStyle: React.CSSProperties = {
    maxWidth: '650px',
    fontSize: '18px',
    lineHeight: 1.7,
    opacity: 0.92,
    marginBottom: '34px',
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '14px',
  };

  const primaryButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: colors.doradoClasico,
    color: 'white',
    padding: '13px 18px',
    fontSize: '15px',
    fontWeight: 700,
    textDecoration: 'none',
    cursor: 'pointer',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...primaryButtonStyle,
    backgroundColor: 'transparent',
    border: '1px solid rgba(255,255,255,0.7)',
  };

  const stepsStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '18px',
    padding: '42px 24px 70px',
    maxWidth: '1120px',
    margin: '0 auto',
  };

  const stepStyle: React.CSSProperties = {
    backgroundColor: 'white',
    border: '1px solid rgba(52,73,94,0.12)',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
  };

  const iconStyle: React.CSSProperties = {
    width: '42px',
    height: '42px',
    borderRadius: '8px',
    display: 'grid',
    placeItems: 'center',
    backgroundColor: `${colors.doradoClasico}18`,
    color: colors.doradoClasico,
    marginBottom: '18px',
  };

  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <div style={contentStyle}>
          <div style={eyebrowStyle}>
            <FontAwesomeIcon icon={faMicrophone} />
            Skill de Alexa
          </div>
          <h1 style={titleStyle}>Agenda tus citas con Barberia Carlyn usando tu voz</h1>
          <p style={textStyle}>
            Vincula tu cuenta del sitio con Alexa mediante un código temporal para consultar tus citas,
            revisar horarios disponibles y confirmar nuevas reservas desde la skill.
          </p>
          <div style={actionsStyle}>
            <a href={alexaSkillUrl} target="_blank" rel="noreferrer" style={primaryButtonStyle}>
              Abrir skill en Alexa
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </a>
            <button type="button" style={secondaryButtonStyle} onClick={() => navigate('/alexa/vincular')}>
              Vincular con código
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </section>

      <section style={stepsStyle} aria-label="Proceso de vinculacion">
        <article style={stepStyle}>
          <div style={iconStyle}>
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </div>
          <h2>1. Abre la skill</h2>
          <p>Pide consultar tus citas o agendar una cita. Alexa te dará un código temporal de vinculación.</p>
        </article>

        <article style={stepStyle}>
          <div style={iconStyle}>
            <FontAwesomeIcon icon={faShieldHalved} />
          </div>
          <h2>2. Inicia sesión</h2>
          <p>Abre la página de vinculación en el sitio e inicia sesión con tu cuenta de cliente.</p>
        </article>

        <article style={stepStyle}>
          <div style={iconStyle}>
            <FontAwesomeIcon icon={faCalendarCheck} />
          </div>
          <h2>3. Confirma el código</h2>
          <p>Ingresa el código que te dictó Alexa y vuelve a la skill para consultar o agendar citas.</p>
        </article>
      </section>
    </main>
  );
};
