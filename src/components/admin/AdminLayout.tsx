import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine,
  faCalendarCheck,
  faUsers,
  faScissors,
  faUserTie,
  faClock,
  faDatabase,
  faGear,
  faRightFromBracket,
  faBars,
  faTimes,
  faBell,
  faSearch,
  faChevronDown,
  faHome
} from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../styles/colors';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const menuItems = [
    { icon: faChartLine, label: 'Dashboard', path: '/admin' },
    { icon: faCalendarCheck, label: 'Citas', path: '/admin/citas' },
    { icon: faUsers, label: 'Usuarios', path: '/admin/usuarios' },
    { icon: faUserTie, label: 'Barberos', path: '/admin/barberos' },
    { icon: faScissors, label: 'Servicios', path: '/admin/servicios' },
    { icon: faClock, label: 'Horarios', path: '/admin/horarios' },
    { icon: faDatabase, label: 'Base de Datos', path: '/admin/database' },
    { icon: faGear, label: 'Configuración', path: '/admin/configuracion' },
  ];

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#F0F2F5',
  };

  const sidebarStyle: React.CSSProperties = {
    width: sidebarOpen ? '280px' : '80px',
    backgroundColor: colors.grafito,
    color: colors.blancoHueso,
    transition: 'width 0.3s ease',
    position: 'fixed',
    height: '100vh',
    overflowY: 'auto',
    zIndex: 1000,
    boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
  };

  const sidebarHeaderStyle: React.CSSProperties = {
    padding: '24px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${colors.blancoHueso}20`,
  };

  const logoStyle: React.CSSProperties = {
    fontFamily: 'Playfair Display, serif',
    fontSize: sidebarOpen ? '20px' : '0',
    fontWeight: 700,
    color: colors.doradoClasico,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  };

  const menuItemStyle = (isActive: boolean = false): React.CSSProperties => ({
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    backgroundColor: isActive ? `${colors.doradoClasico}20` : 'transparent',
    borderLeft: isActive ? `4px solid ${colors.doradoClasico}` : '4px solid transparent',
    transition: 'all 0.2s',
    margin: '4px 0',
  });

  const menuIconStyle: React.CSSProperties = {
    fontSize: '20px',
    minWidth: '24px',
    color: colors.blancoHueso,
  };

  const menuLabelStyle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    opacity: sidebarOpen ? 1 : 0,
    transition: 'opacity 0.2s',
  };

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    marginLeft: sidebarOpen ? '280px' : '80px',
    transition: 'margin-left 0.3s ease',
    padding: '24px',
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '16px 24px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const searchContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: '8px 16px',
    borderRadius: '8px',
    width: '300px',
  };

  const searchInputStyle: React.CSSProperties = {
    border: 'none',
    background: 'none',
    outline: 'none',
    marginLeft: '8px',
    width: '100%',
    fontSize: '14px',
  };

  const headerActionsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  };

  const notificationBadgeStyle: React.CSSProperties = {
    position: 'relative',
    cursor: 'pointer',
  };

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: colors.doradoClasico,
    color: 'white',
    fontSize: '10px',
    padding: '2px 5px',
    borderRadius: '10px',
  };

  const userMenuStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '8px',
    position: 'relative',
  };

  const userDropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '8px 0',
    minWidth: '200px',
    marginTop: '8px',
    zIndex: 1000,
  };

  const dropdownItemStyle: React.CSSProperties = {
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div style={sidebarHeaderStyle}>
          <span style={logoStyle}>Barbería Carlyn</span>
          <FontAwesomeIcon 
            icon={sidebarOpen ? faTimes : faBars} 
            style={{ cursor: 'pointer', fontSize: '20px' }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>

        <nav style={{ padding: '20px 0' }}>
          {menuItems.map((item, index) => (
            <div
              key={index}
              style={menuItemStyle(window.location.pathname === item.path)}
              onClick={() => navigate(item.path)}
              onMouseEnter={(e) => {
                if (window.location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = `${colors.blancoHueso}10`;
                }
              }}
              onMouseLeave={(e) => {
                if (window.location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <FontAwesomeIcon icon={item.icon} style={menuIconStyle} />
              <span style={menuLabelStyle}>{item.label}</span>
            </div>
          ))}

          <div style={{ marginTop: 'auto', padding: '20px 0', borderTop: `1px solid ${colors.blancoHueso}20` }}>
            <div
              style={menuItemStyle(false)}
              onClick={() => navigate('/home')}
            >
              <FontAwesomeIcon icon={faHome} style={menuIconStyle} />
              <span style={menuLabelStyle}>Ir al Sitio</span>
            </div>
            <div
              style={menuItemStyle(false)}
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
            >
              <FontAwesomeIcon icon={faRightFromBracket} style={menuIconStyle} />
              <span style={menuLabelStyle}>Cerrar Sesión</span>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={mainContentStyle}>
        <header style={headerStyle}>
          <div style={searchContainerStyle}>
            <FontAwesomeIcon icon={faSearch} style={{ color: '#9AA6B2' }} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              style={searchInputStyle}
            />
          </div>

          <div style={headerActionsStyle}>
            <div style={notificationBadgeStyle}>
              <FontAwesomeIcon icon={faBell} style={{ fontSize: '20px', color: colors.azulAcero }} />
              <span style={badgeStyle}>3</span>
            </div>

            <div 
              style={userMenuStyle}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: colors.doradoClasico,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}>
                A
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>Admin User</div>
                <div style={{ fontSize: '12px', color: '#9AA6B2' }}>Administrador</div>
              </div>
              <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '12px', marginLeft: '8px' }} />

              {userMenuOpen && (
                <div style={userDropdownStyle}>
                  <div style={dropdownItemStyle}>
                    <FontAwesomeIcon icon={faUserTie} />
                    <span>Mi Perfil</span>
                  </div>
                  <div style={dropdownItemStyle}>
                    <FontAwesomeIcon icon={faGear} />
                    <span>Configuración</span>
                  </div>
                  <div style={{ ...dropdownItemStyle, borderTop: '1px solid #eee', marginTop: '8px', paddingTop: '12px' }}>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    <span>Cerrar Sesión</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px' }}>
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};