import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightToBracket,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '../common/Button';
import { colors } from '../../styles/colors';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const headerStyle: React.CSSProperties = {
    backgroundColor: colors.grafito,
    padding: '16px 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  };

  const navStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const logoStyle: React.CSSProperties = {
    color: colors.doradoClasico,
    fontSize: '28px',
    fontWeight: 700,
    fontFamily: 'Playfair Display, serif',
  };

  const navLinksStyle: React.CSSProperties = {
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
  };

  const navLinkStyle: React.CSSProperties = {
    color: colors.blancoHueso,
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'color 0.2s',
  };

  return (
    <header style={headerStyle}>
      <nav style={navStyle}>
        <div style={logoStyle}>Barbería Carlyn</div>

        <div style={navLinksStyle}>
          <Link to="/" style={navLinkStyle}>Inicio</Link>
          <Link to="/servicios" style={navLinkStyle}>Servicios</Link>
          <Link to="/barberos" style={navLinkStyle}>Barberos</Link>
          <Link to="/testimonios" style={navLinkStyle}>Testimonios</Link>
          <Link to="/contacto" style={navLinkStyle}>Contacto</Link>

          <Button variant="accent" onClick={() => navigate('/login')}>
            <FontAwesomeIcon icon={faRightToBracket} style={{ marginRight: '8px' }} />
            Iniciar Sesión
          </Button>

          <Button variant="secondary" onClick={() => navigate('/register')}>
            <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '8px' }} />
            Registrarse
          </Button>
        </div>
      </nav>
    </header>
  );
};


export default Header