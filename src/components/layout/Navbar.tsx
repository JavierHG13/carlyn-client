import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightToBracket,
  faUser,
  faScissors,
  faCalendarCheck,
  faSignOutAlt,
  faBars,
  faTimes,
  faChevronDown,
  faTachometerAlt,
  faCog,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  transparent?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ transparent = false }) => {

  const navigate = useNavigate();
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [transparent]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isTransparent = transparent && !scrolled;

  // ─── Estilos ───────────────────────────────────────────────

  const headerStyle: React.CSSProperties = {
    backgroundColor: isTransparent ? 'transparent' : colors.grafito,
    padding: '16px 32px',
    position: transparent ? 'absolute' : 'sticky',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    boxShadow: isTransparent ? 'none' : '0 4px 20px rgba(0,0,0,0.15)',
    transition: 'background-color 0.3s, box-shadow 0.3s',
  };

  const navStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const logoContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  };

  const logoImageStyle: React.CSSProperties = {
    height: '50px',
    width: 'auto',
  };

  const navLinksStyle: React.CSSProperties = {
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
  };

  const navLinkStyle: React.CSSProperties = {
    color: 'rgba(255,255,255,0.88)',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    padding: '8px 0',
    transition: 'color 0.2s',
  };

  const rightSectionStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  };

  // Botón pill (Agendar Cita / Iniciar Sesión)
  const pillButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: colors.blancoHueso,
    border: '1.5px solid rgba(255,255,255,0.7)',
    borderRadius: '30px',
    padding: '8px 22px',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    cursor: 'pointer',
    transition: 'background-color 0.2s, border-color 0.2s',
  };

  const iconButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: colors.blancoHueso,
    fontSize: '22px',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    width: '42px',
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  };

  const userMenuContainerStyle: React.CSSProperties = {
    position: 'relative',
  };

  const userButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 8px 4px 4px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '30px',
    color: colors.blancoHueso,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const avatarStyle: React.CSSProperties = {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    backgroundColor: colors.doradoClasico,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
  };

  const userMenuStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    right: 0,
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    padding: '8px 0',
    minWidth: '240px',
    zIndex: 1000,
  };

  const userMenuItemStyle: React.CSSProperties = {
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    color: colors.negroSuave,
    fontSize: '14px',
    border: 'none',
    background: 'none',
    width: '100%',
    textAlign: 'left',
  };

  const menuDividerStyle: React.CSSProperties = {
    height: '1px',
    backgroundColor: '#EDF2F7',
    margin: '8px 0',
  };

  const mobileMenuButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: colors.blancoHueso,
    fontSize: '24px',
    cursor: 'pointer',
    padding: '8px',
  };

  const mobileMenuStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.grafito,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    borderTop: `1px solid ${colors.blancoHueso}20`,
  };

  const getDashboardPath = () => {
    if (hasRole('Admin')) return '/admin';
    if (hasRole('Barbero')) return '/barbero/dashboard';
    if (hasRole('Cliente')) return '/cliente/dashboard';
    return '/';
  };

  return (
    <header style={headerStyle}>
      <nav style={navStyle}>

        {/* Logo */}
        <div style={logoContainerStyle} onClick={() => navigate('/')}>
          <img
            src="/logo.png."
            alt="Barbería Carlyn"
            style={logoImageStyle}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const textLogo = document.createElement('span');
                textLogo.textContent = 'Barbería Carlyn';
                textLogo.style.color = colors.doradoClasico;
                textLogo.style.fontSize = '24px';
                textLogo.style.fontWeight = '700';
                textLogo.style.fontFamily = 'Playfair Display, serif';
                parent.appendChild(textLogo);
              }
            }}
          />
        </div>

        {/* Navigation Links - Desktop */}
        {!isMobile && (
          <div style={navLinksStyle}>
            <Link to="/" style={navLinkStyle}>Inicio</Link>
            <Link to="/servicios" style={navLinkStyle}>Servicios</Link>
            <Link to="/Nostros" style={navLinkStyle}>Nosotros</Link>
          </div>
        )}

        {/* Right Section */}
        <div style={rightSectionStyle}>

          {/* Botón Agendar Cita — siempre visible en desktop
          {!isMobile && (
            <button
              style={pillButtonStyle}
              onClick={() => navigate('/agendar')}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
              }}
            >
              Agendar Cita
            </button>
          )}  */}

          {isAuthenticated ? (
            <>
              {/* Notificaciones 
              <button
                style={iconButtonStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FontAwesomeIcon icon={faBell} /> 
              </button> */}

              {/* Menú de usuario */}
              <div style={userMenuContainerStyle}>
                <button
                  style={userButtonStyle}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  onMouseEnter={() => !isMobile && setUserMenuOpen(true)}
                >
                  <div style={avatarStyle}>
                    {user?.foto ? (
                      <img
                        src={user.foto}
                        alt={user.nombre}
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      user?.nombre?.charAt(0).toUpperCase()
                    )}
                  </div>
                  {!isMobile && (
                    <>
                      <span>{user?.nombre?.split(' ')[0]}</span>
                      <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '12px' }} />
                    </>
                  )}
                </button>

                {userMenuOpen && (
                  <div style={userMenuStyle} onMouseLeave={() => setUserMenuOpen(false)}>

                    {/* Header del menú */}
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #EDF2F7' }}>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{user?.nombre}</div>
                      <div style={{ fontSize: '12px', color: '#718096' }}>{user?.email}</div>
                      <div style={{
                        marginTop: '4px',
                        fontSize: '11px',
                        backgroundColor: colors.doradoClasico,
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        display: 'inline-block',
                      }}>
                        {user?.rol}
                      </div>
                    </div>

                    <button
                      style={userMenuItemStyle}
                      onClick={() => { navigate(getDashboardPath()); setUserMenuOpen(false); }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <FontAwesomeIcon icon={faTachometerAlt} style={{ color: colors.azulAcero }} />
                      Dashboard
                    </button>

                   

                    {(hasRole('Cliente') || hasRole('Barbero')) && (
                      <button
                        style={userMenuItemStyle}
                        onClick={() => { navigate('/mis-citas'); setUserMenuOpen(false); }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7FAFC'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <FontAwesomeIcon
                          icon={hasRole('Barbero') ? faScissors : faCalendarCheck}
                          style={{ color: colors.azulAcero }}
                        />
                        Mis Citas
                      </button>
                    )}

                    

                    <div style={menuDividerStyle} />

                    <button
                      style={{ ...userMenuItemStyle, color: '#EF4444' }}
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} style={{ color: '#EF4444' }} />
                      Cerrar Sesión
                    </button>

                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Iniciar Sesión — pill en desktop, ícono en mobile */}
              {!isMobile ? (
                <button
                  style={pillButtonStyle}
                  onClick={() => navigate('/login')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.borderColor = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
                  }}
                >
                  Iniciar Sesión
                </button>
              ) : (
                <button
                  style={iconButtonStyle}
                  onClick={() => navigate('/login')}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FontAwesomeIcon icon={faRightToBracket} />
                </button>
              )}
            </>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              style={mobileMenuButtonStyle}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
            </button>
          )}

        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div style={mobileMenuStyle}>
          <Link to="/" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
           <Link to="/productos" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>Productos</Link>
          <Link to="/servicios" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>Servicios</Link>
          <Link to="/contacto" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>Contacto</Link>
          <button
            style={{ ...pillButtonStyle, width: 'fit-content' }}
            onClick={() => { navigate('/agendar'); setMobileMenuOpen(false); }}
          >
            Agendar Cita
          </button>
        </div>
      )}

    </header>
  );
};

export default Navbar;