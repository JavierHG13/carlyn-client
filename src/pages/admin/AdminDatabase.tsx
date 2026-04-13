import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AdminStats } from './AdminStats';
import {
  faDatabase,
  faChartPie,
  faFileArchive,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../styles/colors';
import { AdminBackups } from './AdminBackups';
import { AdminVacuum } from './AdminVacuum';
export const AdminDatabase: React.FC = () => {

  const [activeTab, setActiveTab] = useState<'dashboard' | 'backups' | 'vacuum'>('dashboard');

  const containerStyle: React.CSSProperties = {
    width: '100%',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '24px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 600,
    color: colors.negroSuave,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const tabsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    borderBottom: '2px solid #EDF2F7',
    paddingBottom: '8px',
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '10px 20px',
    borderRadius: '8px 8px 0 0',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 500,
    backgroundColor: isActive ? `${colors.doradoClasico}15` : 'transparent',
    color: isActive ? colors.doradoClasico : '#718096',
    borderBottom: isActive ? `2px solid ${colors.doradoClasico}` : '2px solid transparent',
    transition: 'all 0.2s',
  });

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #EDF2F7',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  };

  const statItemStyle = (color: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    backgroundColor: `${color}10`,
    borderRadius: '12px',
  });

  const statIconStyle = (color: string): React.CSSProperties => ({
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    backgroundColor: `${color}20`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color,
    fontSize: '28px',
  });

  const tableContainerStyle: React.CSSProperties = {
    overflowX: 'auto',
    borderRadius: '12px',
    border: '1px solid #EDF2F7',
    backgroundColor: 'white',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '1000px',
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '16px',
    backgroundColor: '#F8FAFC',
    borderBottom: '2px solid #EDF2F7',
    color: '#475569',
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const tdStyle: React.CSSProperties = {
    padding: '16px',
    borderBottom: '1px solid #EDF2F7',
    fontSize: '14px',
  };

  const actionButtonStyle = (color: string): React.CSSProperties => ({
    padding: '6px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: color,
    cursor: 'pointer',
    fontSize: '14px',
    margin: '0 2px',
    width: '32px',
    height: '32px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const statusBadgeStyle = (status: string): React.CSSProperties => {
    const colorsMap: any = {
      Completado: { bg: '#D1FAE5', color: '#10B981' },
      En_proceso: { bg: '#FEF3C7', color: '#F59E0B' },
      Fallido: { bg: '#FEE2E2', color: '#EF4444' },
    };
    const style = colorsMap[status] || { bg: '#E2E8F0', color: '#475569' };

    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 8px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 500,
      backgroundColor: style.bg,
      color: style.color,
    };
  };

  return (
    <AdminLayout>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            <FontAwesomeIcon icon={faDatabase} style={{ color: colors.doradoClasico }} />
            Administración de Base de Datos
          </h1>
        </div>

        {/* Tabs */}
        <div style={tabsStyle}>
          <div style={tabStyle(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}>
            <FontAwesomeIcon icon={faChartPie} style={{ marginRight: '8px' }} />
            Dashboard
          </div>
          <div style={tabStyle(activeTab === 'backups')} onClick={() => setActiveTab('backups')}>
            <FontAwesomeIcon icon={faFileArchive} style={{ marginRight: '8px' }} />
            Backups
          </div>
          <div style={tabStyle(activeTab === 'vacuum')} onClick={() => setActiveTab('vacuum')}>
            <FontAwesomeIcon icon={faCog} style={{ marginRight: '8px' }} />
            Vacuum Analyze
          </div>
        </div>


        {/* Tab: Dashboard */}
        {activeTab === 'dashboard' && (
          <AdminStats></AdminStats>
        )}

        {/* Tab: Backups */}
        {activeTab === 'backups' && (
          <div>
            <AdminBackups></AdminBackups>
          </div>
        )}

        {/* Tab: Backups */}
        {activeTab === 'vacuum' && (
          <div>
            <AdminVacuum></AdminVacuum>
          </div>
        )}


      </div>



    </AdminLayout>


  );


};

