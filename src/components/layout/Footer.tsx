import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faInstagram,
  faTwitter
} from '@fortawesome/free-brands-svg-icons';
import {
  faPhone,
  faEnvelope,
  faLocationDot
} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

import { colors } from '../../styles/colors';

export const Footer: React.FC = () => {

  const footerStyle: React.CSSProperties = {
    backgroundColor: colors.negroSuave,
    padding: '60px 24px 30px',
    color: colors.blancoHueso,
  };

  const footerContentStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
  };

  const footerTitleStyle: React.CSSProperties = {
    color: colors.doradoClasico,
    marginBottom: '20px',
    fontSize: '18px',
  };

  const footerLinkStyle: React.CSSProperties = {
    color: colors.blancoHueso,
    textDecoration: 'none',
    display: 'block',
    marginBottom: '10px',
    opacity: 0.8,
  };

  const socialIconsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '15px',
    marginTop: '20px',
  };

  const socialIconStyle: React.CSSProperties = {
    fontSize: '24px',
    color: colors.blancoHueso,
    cursor: 'pointer',
  };

  const copyrightStyle: React.CSSProperties = {
    textAlign: 'center',
    marginTop: '40px',
    paddingTop: '30px',
    borderTop: `1px solid ${colors.blancoHueso}20`,
    opacity: 0.7,
  };

  return (
    <footer id="contacto" style={footerStyle}>
      <div style={footerContentStyle}>
        <div>
          <h3 style={footerTitleStyle}>Barbería Carlyn</h3>
          <p style={{ opacity: 0.8, marginBottom: '20px' }}>
            Ser la barbería de referencia en Huejutla, ofreciendo una experiencia única donde estilo, calidad y atención personalizada se combinan para hacer que cada cliente luzca y se sienta mejor que nunca.
          </p>
          <div style={socialIconsStyle}>
            <FontAwesomeIcon icon={faFacebook} style={socialIconStyle} />
            <FontAwesomeIcon icon={faInstagram} style={socialIconStyle} />
            <FontAwesomeIcon icon={faTwitter} style={socialIconStyle} />
          </div>
        </div>

        <div>
          <h3 style={footerTitleStyle}>Enlaces Rápidos</h3>
  
          <Link to="/" style={footerLinkStyle}>
            Inicio
          </Link>

          <Link to="#servicios" style={footerLinkStyle}>Servicios</Link>
          <Link to="#barberos" style={footerLinkStyle}>Barberos</Link>
        </div>

        <div>
          <h3 style={footerTitleStyle}>Horario</h3>
          <p style={{ opacity: 0.8 }}>Lunes a sabado: 8:00 AM - 8:00 PM</p>
          <p style={{ opacity: 0.8 }}>Domingos: Cerrado</p>
        </div>

        <div>
          <h3 style={footerTitleStyle}>Contacto</h3>
          <p style={{ opacity: 0.8 }}>
            <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px' }} />
            +52 771 261 3445
          </p>
          <p style={{ opacity: 0.8 }}>
            <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px' }} />
            agustinsebas1986@gmail.com
          </p>
          <p style={{ opacity: 0.8 }}>
            <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: '8px' }} />
            Boulevard Adolfo López Mateos, 43000 Huejutla Hgo., México
          </p>
        </div>
      </div>

      <div style={copyrightStyle}>
        © 2024 Barbería Carlyn. Todos los derechos reservados.
      </div>
    </footer>
  );
};