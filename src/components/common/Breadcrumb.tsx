import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../styles/colors';

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const breadcrumbStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    marginBottom: '20px',
    padding: '12px 0',
  };

  const linkStyle: React.CSSProperties = {
    color: colors.azulAcero,
    textDecoration: 'none',
    transition: 'color 0.2s',
  };

  const activeStyle: React.CSSProperties = {
    color: colors.doradoClasico,
    fontWeight: 500,
  };

  const separatorStyle: React.CSSProperties = {
    color: '#A0AEC0',
    fontSize: '12px',
  };

  return (
    <div style={breadcrumbStyle}>
      <Link to="/" style={linkStyle}>
        <FontAwesomeIcon icon={faHome} /> Inicio
      </Link>
      
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        // Capitalizar y reemplazar guiones
        const displayName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
        
        return (
          <React.Fragment key={name}>
            <span style={separatorStyle}>
              <FontAwesomeIcon icon={faChevronRight} />
            </span>
            {isLast ? (
              <span style={activeStyle}>{displayName}</span>
            ) : (
              <Link to={routeTo} style={linkStyle}>
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};