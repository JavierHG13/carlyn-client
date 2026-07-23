import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faCalendarCheck,
  faUsers,
  faScissors,
  faUserTie,
  faClock,
  faDatabase,
  faRightFromBracket,
  faBars,
  faTimes,
  faChevronDown,
  faHome,
  faMapMarkerAlt,
  faCashRegister,
  faBrain,
  faMoneyBillTrendUp,
  faUsersViewfinder,
} from '@fortawesome/free-solid-svg-icons';
import { colors } from '../styles/colors';
import { useAuth } from '../context/AuthContext';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const menuItems = [
    { icon: faChartLine, label: 'Dashboard', path: '/admin' },
    { icon: faCalendarCheck, label: 'Citas', path: '/admin/citas' },
    { icon: faUsers, label: 'Usuarios', path: '/admin/usuarios' },
    { icon: faCashRegister, label: 'POS', path: '/admin/pos' },
    { icon: faUserTie, label: 'Barberos', path: '/admin/barberos' },
    { icon: faMapMarkerAlt, label: 'Sucursales', path: '/admin/locales' },
    { icon: faClock, label: 'Horarios', path: '/admin/horarios' },
    { icon: faScissors, label: 'Servicios', path: '/admin/servicios' },
    { icon: faChartLine, label: 'Prediccion', path: '/admin/prediccion' },
    { icon: faBrain, label: 'No-show', path: '/admin/conocimiento/no-show' },
    { icon: faMoneyBillTrendUp, label: 'Ingresos IA', path: '/admin/conocimiento/ingresos' },
    { icon: faUsersViewfinder, label: 'Segmentacion', path: '/admin/conocimiento/segmentacion' },
    { icon: faDatabase, label: 'Base de Datos', path: '/admin/database' },
  ];

  const sidebarExpandedWidth = 292;
  const sidebarCollapsedWidth = 84;
  const sidebarWidth = sidebarOpen ? sidebarExpandedWidth : sidebarCollapsedWidth;
  const activeSection = menuItems.find((item) => item.path === location.pathname)?.label || 'Panel administrativo';

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#F4F6FA',
  };

  const headerShellStyle: React.CSSProperties = {
    height: 96,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1100,
    display: 'grid',
    gridTemplateColumns: `${sidebarExpandedWidth}px minmax(0, 1fr)`,
  };

  const brandHeaderStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    color: '#101828',
    padding: '24px 22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRight: '1px solid #E7EBF2',
    borderBottom: '1px solid #E7EBF2',
  };

  const sidebarStyle: React.CSSProperties = {
    width: sidebarWidth,
    background: 'linear-gradient(180deg, rgba(28,28,28,0.88) 0%, rgba(16,16,16,0.82) 100%)',
    color: '#FFFFFF',
    transition: 'width 0.24s ease',
    position: 'fixed',
    top: 96,
    left: 0,
    bottom: 0,
    overflowY: 'auto',
    zIndex: 1000,
    borderRight: '1px solid rgba(255,255,255,0.16)',
    boxShadow: '18px 0 44px rgba(15,23,42,0.12)',
    backdropFilter: 'blur(14px) saturate(120%)',
    WebkitBackdropFilter: 'blur(14px) saturate(120%)',
  };

  const logoStyle: React.CSSProperties = {
    fontFamily: 'Playfair Display, serif',
    fontSize: 25,
    fontWeight: 700,
    color: colors.doradoClasico,
    whiteSpace: 'nowrap',
  };

  const menuItemStyle = (isActive: boolean = false): React.CSSProperties => ({
    padding: sidebarOpen ? '14px 22px' : '14px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: sidebarOpen ? 'flex-start' : 'center',
    gap: 14,
    cursor: 'pointer',
    backgroundColor: isActive ? 'rgba(184,134,11,0.22)' : 'transparent',
    borderLeft: isActive ? `4px solid ${colors.doradoClasico}` : '4px solid transparent',
    transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
    color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.78)',
  });

  const menuIconStyle: React.CSSProperties = {
    fontSize: 20,
    minWidth: 24,
    color: 'inherit',
  };

  const menuLabelStyle: React.CSSProperties = {
    fontSize: 15,
    fontWeight: 700,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    width: sidebarOpen ? 'auto' : 0,
    opacity: sidebarOpen ? 1 : 0,
    transition: 'opacity 0.18s ease',
  };

  const mainContentStyle: React.CSSProperties = {
    marginLeft: sidebarWidth,
    paddingTop: 96,
    minHeight: '100vh',
    transition: 'margin-left 0.24s ease',
  };

  const topbarStyle: React.CSSProperties = {
    height: 96,
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E7EBF2',
    padding: '0 36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const sidebarActionBarStyle: React.CSSProperties = {
    padding: sidebarOpen ? '12px 16px 10px' : '12px 0 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: sidebarOpen ? 'flex-end' : 'center',
    borderBottom: '1px solid rgba(255,255,255,0.12)',
  };

  const collapseButtonStyle: React.CSSProperties = {
    minWidth: sidebarOpen ? 108 : 38,
    height: 34,
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.22)',
    background: 'rgba(255,255,255,0.10)',
    color: 'rgba(255,255,255,0.92)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 800,
    transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
  };

  const pageShellStyle: React.CSSProperties = {
    padding: '30px 34px 42px',
  };

  const sectionTextStyle: React.CSSProperties = {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    color: '#8A94A6',
    fontWeight: 800,
    marginBottom: 4,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 800,
    color: '#101828',
    fontFamily: 'Lato, sans-serif',
    margin: 0,
  };

  const userButtonStyle: React.CSSProperties = {
    border: '1px solid #E0E5ED',
    background: '#FFFFFF',
    color: '#101828',
    borderRadius: 999,
    padding: '8px 12px 8px 8px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    boxShadow: '0 12px 28px rgba(16,24,40,0.08)',
  };

  const homeButtonStyle: React.CSSProperties = {
    border: '1px solid #E0E5ED',
    background: '#FFFFFF',
    color: '#344054',
    borderRadius: 999,
    padding: '12px 16px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 9,
    cursor: 'pointer',
    fontWeight: 900,
    boxShadow: '0 12px 28px rgba(16,24,40,0.06)',
  };

  const avatarStyle: React.CSSProperties = {
    width: 42,
    height: 42,
    borderRadius: '50%',
    background: colors.doradoClasico,
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    fontSize: 18,
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: 62,
    right: 0,
    width: 280,
    backgroundColor: 'rgba(255,255,255,0.94)',
    border: '1px solid rgba(226,232,240,0.9)',
    borderRadius: 18,
    boxShadow: '0 24px 60px rgba(15,23,42,0.18)',
    padding: 12,
    zIndex: 1200,
    backdropFilter: 'blur(12px)',
  };

  const dropdownItemStyle: React.CSSProperties = {
    width: '100%',
    border: 'none',
    background: 'transparent',
    color: '#1D2939',
    padding: '12px 14px',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontWeight: 700,
    cursor: 'pointer',
    textAlign: 'left',
  };

  return (
    <div style={containerStyle}>
      <header style={headerShellStyle}>
        <div style={brandHeaderStyle}>
          <span style={logoStyle}>Barberia Carlyn</span>
        </div>

        <div style={topbarStyle}>
          <div>
            <div style={sectionTextStyle}>Administrador</div>
            <h1 style={sectionTitleStyle}>{activeSection}</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button type="button" style={homeButtonStyle} onClick={() => navigate('/')}>
              <FontAwesomeIcon icon={faHome} />
              Inicio
            </button>

            <div style={{ position: 'relative' }}>
              <button type="button" style={userButtonStyle} onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <span style={avatarStyle}>{user?.nombre?.charAt(0)?.toUpperCase() || 'A'}</span>
                <span style={{ fontWeight: 800 }}>{user?.nombre?.split(' ')[0] || 'Admin'}</span>
                <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 12, color: '#667085' }} />
              </button>

              {userMenuOpen && (
                <div style={dropdownStyle}>
                  <div style={{ padding: '10px 12px 14px', borderBottom: '1px solid #E7EBF2', marginBottom: 8 }}>
                    <div style={{ fontWeight: 900, color: '#101828' }}>{user?.nombre || 'Administrador'}</div>
                    <div style={{ color: '#667085', fontSize: 13 }}>{user?.email}</div>
                    <div style={{ color: colors.doradoClasico, fontWeight: 900, fontSize: 12, marginTop: 4 }}>{user?.rol}</div>
                  </div>

                  <button type="button" style={dropdownItemStyle} onClick={() => navigate('/admin')}>
                    <FontAwesomeIcon icon={faChartLine} />
                    Dashboard
                  </button>
                  <button type="button" style={{ ...dropdownItemStyle, color: '#D92D20' }} onClick={logout}>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    Cerrar Sesion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <aside style={sidebarStyle}>
        <div style={sidebarActionBarStyle}>
          <button
            type="button"
            aria-label="Alternar menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={collapseButtonStyle}
          >
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
            {sidebarOpen && <span>Ocultar</span>}
          </button>
        </div>

        <nav style={{ padding: '18px 0' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.path}
                style={menuItemStyle(isActive)}
                onClick={() => navigate(item.path)}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.10)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <FontAwesomeIcon icon={item.icon} style={menuIconStyle} />
                <span style={menuLabelStyle}>{item.label}</span>
              </div>
            );
          })}

          <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={menuItemStyle(false)} onClick={() => navigate('/')}>
              <FontAwesomeIcon icon={faHome} style={menuIconStyle} />
              <span style={menuLabelStyle}>Ir al Sitio</span>
            </div>
          </div>
        </nav>
      </aside>

      <main style={mainContentStyle}>
        <div style={pageShellStyle}>{children || <Outlet />}</div>
      </main>
    </div>
  );
};
