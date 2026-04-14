// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faUsers,
  faUserTie,
  faScissors,
  faClock,
  faEye,
  faCheckCircle,
  faTimesCircle,
  faHourglassHalf,
  faArrowRight,
  faPlus,
  faChartLine,
  faCog,
  faDatabase,
  faBox,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import { AdminLayout } from '../../layouts/AdminLayout';
import { colors } from '../../styles/colors';
import api from '../../services/axios';

interface CitaProxima {
  id: number;
  fecha: string;
  hora_inicio: string;
  cliente_nombre: string;
  cliente_telefono: string;
  servicio_nombre: string;
  barbero_nombre: string;
  estado_nombre: string;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [proximasCitas, setProximasCitas] = useState<CitaProxima[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    citasHoy: 0,
    clientesTotales: 0,
    barberosActivos: 0,
    serviciosActivos: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Obtener citas próximas (próximos 7 días)
      const citasResponse = await api.get('/citas/proximas?dias=7');
      setProximasCitas(citasResponse.data.data || []);

      // Obtener estadísticas básicas
      const [clientesRes, barberosRes, serviciosRes, citasHoyRes] = await Promise.all([
        api.get('/admin/usuarios?rol=Cliente&limit=1'),
        api.get('/barbero'),
        api.get('/servicios'),
        api.get('/citas?fecha=' + new Date().toISOString().split('T')[0]),
      ]);

      setStats({
        citasHoy: citasHoyRes.data?.data?.length || 0,
        clientesTotales: clientesRes.data?.pagination?.total || 0,
        barberosActivos: barberosRes.data?.data?.filter((b: any) => b.activo).length || 0,
        serviciosActivos: serviciosRes.data?.servicios?.filter((s: any) => s.activo).length || 0,
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const config: Record<string, { color: string; bg: string; icon: any; text: string }> = {
      'Pendiente': { color: '#F59E0B', bg: '#FEF3C7', icon: faHourglassHalf, text: 'Pendiente' },
      'Confirmada': { color: '#3B82F6', bg: '#DBEAFE', icon: faCheckCircle, text: 'Confirmada' },
      'Completada': { color: '#10B981', bg: '#D1FAE5', icon: faCheckCircle, text: 'Completada' },
      'Cancelada': { color: '#EF4444', bg: '#FEE2E2', icon: faTimesCircle, text: 'Cancelada' },
      'No_asistio': { color: '#EF4444', bg: '#FEE2E2', icon: faTimesCircle, text: 'No Asistió' },
    };
    const style = config[estado] || config['Pendiente'];

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 500,
        backgroundColor: style.bg,
        color: style.color,
      }}>
        <FontAwesomeIcon icon={style.icon} style={{ fontSize: '9px' }} />
        {style.text}
      </span>
    );
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);

    if (date.toDateString() === hoy.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === manana.toDateString()) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
    }
  };

  // Accesos rápidos
  const quickAccess = [
    { title: 'Ver Citas', icon: faCalendarCheck, path: '/admin/citas', color: '#3B82F6', bg: '#DBEAFE' },
    { title: 'Clientes', icon: faUsers, path: '/admin/usuarios', color: '#10B981', bg: '#D1FAE5' },
    { title: 'Barberos', icon: faUserTie, path: '/admin/barberos', color: '#8B5CF6', bg: '#EDE9FE' },
    { title: 'Servicios', icon: faScissors, path: '/admin/servicios', color: '#F59E0B', bg: '#FEF3C7' },
    {/* title: 'Productos', icon: faBox, path: '/admin/productos', color: '#EC4899', bg: '#FCE7F3' },
    { title: 'Estadísticas', icon: faChartLine, path: '/admin/stats', color: '#06B6D4', bg: '#CFFAFE' */},
    { title: 'Base de Datos', icon: faDatabase, path: '/admin/database', color: '#6B7280', bg: '#F3F4F6' },
    { title: 'Configuración', icon: faCog, path: '/admin/configuracion', color: '#4B5563', bg: '#F3F4F6' },
    { title: 'Predicciones', icon: faChartLine, path: '/admin/prediccion', color: '#06B6D4', bg: '#CFFAFE' },
  ];

  const containerStyle: React.CSSProperties = {
    width: '100%',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '28px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 700,
    color: colors.negroSuave,
    marginBottom: '8px',
    fontFamily: 'Playfair Display, serif',
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#718096',
    fontSize: '15px',
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  };

  const statCardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #EDF2F7',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 700,
    color: colors.negroSuave,
    marginBottom: '4px',
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#718096',
  };

  const quickAccessGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  };

  const quickCardStyle = (bgColor: string, borderColor: string): React.CSSProperties => ({
    backgroundColor: bgColor,
    borderRadius: '14px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: `1px solid ${borderColor}`,
    textAlign: 'center',
  });

  const quickIconStyle = (color: string): React.CSSProperties => ({
    fontSize: '24px',
    color: color,
    marginBottom: '10px',
  });

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #EDF2F7',
    marginBottom: '24px',
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: colors.negroSuave,
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '12px 8px',
    borderBottom: `1px solid #EDF2F7`,
    color: '#718096',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
  };

  const tdStyle: React.CSSProperties = {
    padding: '12px 8px',
    borderBottom: `1px solid #EDF2F7`,
    fontSize: '13px',
    verticalAlign: 'middle',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px',
    color: '#718096',
  };

  const linkStyle: React.CSSProperties = {
    color: colors.doradoClasico,
    textDecoration: 'none',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          Cargando dashboard...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={statValueStyle}>{stats.citasHoy}</div>
            <div style={statLabelStyle}>Citas de hoy</div>
          </div>
          <div style={statCardStyle}>
            <div style={statValueStyle}>{stats.clientesTotales}</div>
            <div style={statLabelStyle}>Clientes registrados</div>
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>
            <span>Accesos Rápidos</span>
          </h3>
          <div style={quickAccessGridStyle}>
            {quickAccess.map((item, idx) => (
              <div
                key={idx}
                style={quickCardStyle(item.bg, `${item.color}30`)}
                onClick={() => navigate(item.path)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <FontAwesomeIcon icon={item.icon} style={quickIconStyle(item.color)} />
                <div style={{ fontSize: '13px', fontWeight: 500, color: colors.negroSuave }}>
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Próximas Citas */}
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>
            <span>
              <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '8px', color: colors.doradoClasico }} />
              Próximas Citas
            </span>
            <button
              onClick={() => navigate('/admin/citas')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                color: colors.doradoClasico,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Ver todas <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '10px' }} />
            </button>
          </h3>

          {proximasCitas.length === 0 ? (
            <div style={emptyStateStyle}>
              No hay citas programadas en los próximos días
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Cliente</th>
                    <th style={thStyle}>Servicio</th>
                    <th style={thStyle}>Barbero</th>
                    <th style={thStyle}>Fecha</th>
                    <th style={thStyle}>Hora</th>
                    <th style={thStyle}>Estado</th>
                    <th style={thStyle}></th>
                  </tr>
                </thead>
                <tbody>
                  {proximasCitas.slice(0, 8).map((cita) => (
                    <tr key={cita.id}>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 500 }}>{cita.cliente_nombre}</div>
                        <div style={{ fontSize: '11px', color: '#718096' }}>{cita.cliente_telefono}</div>
                      </td>
                      <td style={tdStyle}>{cita.servicio_nombre}</td>
                      <td style={tdStyle}>{cita.barbero_nombre}</td>
                      <td style={tdStyle}>
                        <span style={{ fontWeight: 500 }}>{formatFecha(cita.fecha)}</span>
                      </td>
                      <td style={tdStyle}>{cita.hora_inicio.slice(0, 5)} hs</td>
                      <td style={tdStyle}>{getEstadoBadge(cita.estado_nombre)}</td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => navigate(`/admin/citas/${cita.id}`)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#F1F5F9',
                            cursor: 'pointer',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} style={{ fontSize: '11px' }} />
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};