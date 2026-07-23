import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightToBracket,
  faUser,
  faCalendarCheck,
  faSignOutAlt,
  faBars,
  faTimes,
  faChevronDown,
  faTachometerAlt,
  faMicrophone
} from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';
import { servicioService } from '../../services/servicioService';
import type { Servicio } from '../../types/servicio';
import { getServiceDisplayName } from '../../utils/servicioDisplay';

interface NavbarProps {
  transparent?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ transparent = false }) => {

  const navigate = useNavigate();
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [servicios, setServicios] = useState<Servicio[]>([]);
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

  useEffect(() => {
    const loadServicios = async () => {
      try {
        const data = await servicioService.getActive();
        setServicios(data.filter((servicio) => servicio.activo));
      } catch {
        setServicios([]);
      }
    };

    loadServicios();
  }, []);

  const isMobile = windowWidth <= 768;
  const isTransparent = transparent && !scrolled;
  const isLightHeader = !isTransparent;

  // ─── Estilos ───────────────────────────────────────────────

  const headerStyle: React.CSSProperties = {
    backgroundColor: isTransparent ? 'rgba(0,0,0,0.32)' : '#FFFFFF',
    padding: '22px 48px',
    position: transparent ? 'absolute' : 'sticky',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    boxShadow: isTransparent ? 'none' : '0 6px 28px rgba(0,0,0,0.08)',
    borderBottom: isTransparent ? 'none' : '1px solid rgba(0,0,0,0.06)',
    transition: 'background-color 0.3s, box-shadow 0.3s, border-color 0.3s',
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

  const logoTextStyle: React.CSSProperties = {
    color: colors.doradoClasico,
    fontSize: isMobile ? '24px' : '30px',
    fontWeight: 700,
    fontFamily: 'Playfair Display, serif',
    whiteSpace: 'nowrap',
  };

  const navLinksStyle: React.CSSProperties = {
    display: 'flex',
    gap: '34px',
    alignItems: 'center',
  };

  const navLinkStyle: React.CSSProperties = {
    color: isLightHeader ? '#111111' : 'rgba(255,255,255,0.92)',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 800,
    letterSpacing: '0.9px',
    textTransform: 'uppercase',
    padding: '8px 0',
    transition: 'color 0.2s',
  };

  const dropdownContainerStyle: React.CSSProperties = {
    position: 'relative',
  };

  const dropdownButtonStyle: React.CSSProperties = {
    ...navLinkStyle,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  };

  const servicesDropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 22px)',
    left: '-42px',
    width: '380px',
    backgroundColor: '#FFFFFF',
    borderTop: '3px solid #111111',
    border: '1px solid rgba(196,0,0,0.18)',
    boxShadow: '0 22px 48px rgba(0,0,0,0.14)',
    padding: '22px 0',
    zIndex: 1000,
  };

  const dropdownItemStyle: React.CSSProperties = {
    display: 'block',
    color: '#C40000',
    padding: '16px 38px',
    fontSize: '14px',
    fontWeight: 400,
    letterSpacing: '0.4px',
    textTransform: 'none',
    textDecoration: 'none',
  };

  const rightSectionStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  };

  // Botón pill (Agendar Cita / Iniciar Sesión)
  const pillButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: isLightHeader ? '#111111' : colors.blancoHueso,
    border: isLightHeader ? '1.5px solid rgba(0,0,0,0.25)' : '1.5px solid rgba(255,255,255,0.7)',
    borderRadius: '0',
    padding: '10px 22px',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    cursor: 'pointer',
    transition: 'background-color 0.2s, border-color 0.2s',
  };

  const iconButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: isLightHeader ? '#111111' : colors.blancoHueso,
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
    gap: '8px',
    padding: '5px 12px 5px 5px',
    backgroundColor: isLightHeader ? '#FFFFFF' : 'rgba(255,255,255,0.14)',
    border: isLightHeader ? '1px solid rgba(15,23,42,0.12)' : '1px solid rgba(255,255,255,0.22)',
    borderRadius: '30px',
    color: isLightHeader ? '#111111' : colors.blancoHueso,
    cursor: 'pointer',
    boxShadow: isLightHeader ? '0 10px 26px rgba(0,0,0,0.08)' : 'none',
    transition: 'background-color 0.2s, border-color 0.2s, box-shadow 0.2s',
  };

  const avatarStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: colors.doradoClasico,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
  };

  const userMenuStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 14px)',
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: '18px',
    boxShadow: '0 22px 55px rgba(0,0,0,0.16)',
    padding: '12px 0',
    minWidth: '300px',
    border: '1px solid rgba(255,255,255,0.65)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    zIndex: 1000,
    overflow: 'hidden',
  };

  const userMenuItemStyle: React.CSSProperties = {
    padding: '16px 22px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    color: colors.negroSuave,
    fontSize: '16px',
    border: 'none',
    background: 'none',
    width: '100%',
    textAlign: 'left',
  };

  const menuDividerStyle: React.CSSProperties = {
    height: '1px',
    backgroundColor: 'rgba(15,23,42,0.08)',
    margin: '10px 0',
  };

  const mobileMenuButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: isLightHeader ? '#111111' : colors.blancoHueso,
    fontSize: '24px',
    cursor: 'pointer',
    padding: '8px',
  };

  const mobileMenuStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: isLightHeader ? '#FFFFFF' : colors.grafito,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    borderTop: isLightHeader ? '1px solid rgba(0,0,0,0.08)' : `1px solid ${colors.blancoHueso}20`,
  };

  const getDashboardPath = () => {
    if (hasRole('Admin')) return '/admin';
    if (hasRole('Barbero')) return '/barbero';
    if (hasRole('Cliente')) return '/mis-citas';
    return '/';
  };

  return (
    <header style={headerStyle}>
      <nav style={navStyle}>

        {/* Logo */}
        <div style={logoContainerStyle} onClick={() => navigate('/')}>
          <span style={logoTextStyle}>Barbería Carlyn</span>
        </div>

        {/* Navigation Links - Desktop */}
        {!isMobile && (
          <div style={navLinksStyle}>
            <Link to="/" style={navLinkStyle}>Inicio</Link>
            <div
              style={dropdownContainerStyle}
              onMouseEnter={() => setServicesMenuOpen(true)}
              onMouseLeave={() => setServicesMenuOpen(false)}
            >
              <button type="button" style={dropdownButtonStyle} onClick={() => navigate('/servicios')}>
                Servicios
                <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 11 }} />
              </button>
              {servicesMenuOpen && (
                <div style={servicesDropdownStyle}>
                  {servicios.length > 0 ? (
                    servicios.map((servicio) => {
                      const displayName = getServiceDisplayName(servicio.nombre);
                      return (
                        <Link
                          key={servicio.id}
                          to={`/servicios/${servicio.id}`}
                          style={dropdownItemStyle}
                          onClick={() => setServicesMenuOpen(false)}
                        >
                          {displayName.title}
                        </Link>
                      );
                    })
                  ) : (
                    <Link
                      to="/servicios"
                      style={dropdownItemStyle}
                      onClick={() => setServicesMenuOpen(false)}
                    >
                      Ver servicios
                    </Link>
                  )}
                </div>
              )}
            </div>
            <Link to="/nostros" style={navLinkStyle}>Nosotros</Link>
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
                    <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
                      <div style={{ fontWeight: 600, fontSize: '16px', color: '#24364A' }}>{user?.nombre}</div>
                      <div style={{ fontSize: '14px', color: '#64748B', marginTop: '6px' }}>{user?.email}</div>
                      <div style={{
                        marginTop: '9px',
                        fontSize: '12px',
                        backgroundColor: colors.doradoClasico,
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        display: 'inline-block',
                      }}>
                        {user?.rol}
                      </div>
                    </div>

                    {!hasRole('Cliente') && (
                      <button
                        style={userMenuItemStyle}
                        onClick={() => { navigate(getDashboardPath()); setUserMenuOpen(false); }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7FAFC'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <FontAwesomeIcon icon={faTachometerAlt} style={{ color: colors.azulAcero }} />
                        Dashboard
                      </button>
                    )}

                    <button
                      style={userMenuItemStyle}
                      onClick={() => { navigate('/mi-perfil'); setUserMenuOpen(false); }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <FontAwesomeIcon icon={faUser} style={{ color: colors.azulAcero }} />
                      Mi Perfil
                    </button>

                   

                    {hasRole('Cliente') && (
                      <button
                        style={userMenuItemStyle}
                        onClick={() => { navigate('/mis-citas'); setUserMenuOpen(false); }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7FAFC'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <FontAwesomeIcon
                          icon={faCalendarCheck}
                          style={{ color: colors.azulAcero }}
                        />
                        Mis Citas
                      </button>
                    )}

                    {hasRole('Cliente') && (
                      <button
                        style={userMenuItemStyle}
                        onClick={() => { navigate('/alexa/vincular'); setUserMenuOpen(false); }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7FAFC'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <FontAwesomeIcon icon={faMicrophone} style={{ color: colors.azulAcero }} />
                        Vincular Alexa
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
