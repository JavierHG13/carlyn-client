// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faDollarSign,
  faUsers,
  faUserTie,
  faClock,
  faStar,
  faChartLine,
  faArrowUp,
  faArrowDown,
  faEye,
  faCheckCircle,
  faTimesCircle,
  faHourglassHalf
} from '@fortawesome/free-solid-svg-icons';
import { AdminLayout } from '../../layouts/AdminLayout';
import { StatsCard } from '../../components/admin/StatsCard';
import { colors } from '../../styles/colors';
import api from '../../services/axios';
interface DashboardStats {
  totalAppointments: number;
  totalRevenue: number;
  totalClients: number;
  activeBarbers: number;
  appointmentsToday: number;
  appointmentsPending: number;
  averageRating: number;
  popularServices: { name: string; count: number }[];
}

interface RecentAppointment {
  id: string;
  clientName: string;
  service: string;
  barber: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Obtener estadísticas generales
      const statsResponse = await api.get('/admin/usuarios/estadisticas/generales');
      
      // Obtener citas recientes (asumiendo que tienes un endpoint para esto)
     //const appointmentsResponse = await api.get('/admin/citas/recientes');
      
      //setStats(statsResponse.data);
      //setRecentAppointments(appointmentsResponse.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: '#F59E0B', icon: faHourglassHalf, text: 'Pendiente' },
      confirmed: { color: '#3B82F6', icon: faCheckCircle, text: 'Confirmada' },
      completed: { color: '#10B981', icon: faCheckCircle, text: 'Completada' },
      cancelled: { color: '#EF4444', icon: faTimesCircle, text: 'Cancelada' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: `${config.color}15`,
        color: config.color,
      }}>
        <FontAwesomeIcon icon={config.icon} style={{ fontSize: '10px' }} />
        {config.text}
      </span>
    );
  };

  const containerStyle: React.CSSProperties = {
    width: '100%',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '24px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 700,
    color: colors.negroSuave,
    marginBottom: '8px',
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#718096',
    fontSize: '16px',
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  };

  const chartsRowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
    marginBottom: '30px',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #EDF2F7',
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: colors.negroSuave,
    marginBottom: '20px',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '12px',
    borderBottom: `1px solid #EDF2F7`,
    color: '#718096',
    fontSize: '13px',
    fontWeight: 600,
  };

  const tdStyle: React.CSSProperties = {
    padding: '12px',
    borderBottom: `1px solid #EDF2F7`,
    fontSize: '14px',
  };

  const serviceItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: `1px solid #EDF2F7`,
  };

  const serviceProgressStyle: React.CSSProperties = {
    width: '100%',
    height: '8px',
    backgroundColor: '#EDF2F7',
    borderRadius: '4px',
    marginTop: '8px',
  };

  const serviceProgressFillStyle = (percentage: number): React.CSSProperties => ({
    width: `${percentage}%`,
    height: '100%',
    backgroundColor: colors.doradoClasico,
    borderRadius: '4px',
  });

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Cargando dashboard...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Dashboard</h1>
          <p style={subtitleStyle}>
            Bienvenido de vuelta. Aquí tienes un resumen de tu barbería.
          </p>
        </div>

        {/* Stats Cards */}
        <div style={statsGridStyle}>
          <StatsCard
            title="Citas Totales"
            value={stats?.totalAppointments || 0}
            icon={faCalendarCheck}
            change={12.5}
            color={colors.doradoClasico}
          />
          <StatsCard
            title="Ingresos Totales"
            value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
            icon={faDollarSign}
            change={8.2}
            color="#10B981"
          />
          <StatsCard
            title="Clientes Registrados"
            value={stats?.totalClients || 0}
            icon={faUsers}
            change={15.3}
            color="#3B82F6"
          />
          <StatsCard
            title="Barberos Activos"
            value={stats?.activeBarbers || 0}
            icon={faUserTie}
            change={0}
            color="#8B5CF6"
          />
        </div>

        {/* Charts Row */}
        <div style={chartsRowStyle}>
          {/* Citas de Hoy */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Citas de Hoy</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '36px', fontWeight: 700, color: colors.negroSuave }}>
                  {stats?.appointmentsToday || 0}
                </div>
                <div style={{ color: '#718096', fontSize: '14px' }}>Total citas hoy</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Completadas: 8</span>
                  <span>Pendientes: {stats?.appointmentsPending || 0}</span>
                </div>
                <div style={serviceProgressStyle}>
                  <div style={{ ...serviceProgressFillStyle(65), width: '65%' }} />
                </div>
              </div>
            </div>

            {/* Próximas citas */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#718096' }}>
                PRÓXIMAS CITAS
              </h4>
              {recentAppointments.map((apt) => (
                <div key={apt.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #EDF2F7',
                }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{apt.clientName}</div>
                    <div style={{ fontSize: '13px', color: '#718096' }}>
                      {apt.service} con {apt.barber}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{apt.time}</div>
                    {getStatusBadge(apt.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Servicios Populares */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Servicios Populares</h3>
            <div>
              {stats?.popularServices.map((service, index) => {
                const total = stats.popularServices.reduce((acc, s) => acc + s.count, 0);
                const percentage = (service.count / total) * 100;
                
                return (
                  <div key={index} style={serviceItemStyle}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 500 }}>{service.name}</span>
                        <span style={{ color: colors.doradoClasico, fontWeight: 600 }}>
                          {service.count}
                        </span>
                      </div>
                      <div style={serviceProgressStyle}>
                        <div style={serviceProgressFillStyle(percentage)} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #EDF2F7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#718096' }}>Valoración Promedio</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: colors.negroSuave }}>
                    {stats?.averageRating || 0}
                    <span style={{ fontSize: '14px', color: '#718096', marginLeft: '4px' }}>/5</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1,2,3,4,5].map((star) => (
                    <FontAwesomeIcon
                      key={star}
                      icon={faStar}
                      style={{
                        color: star <= Math.round(stats?.averageRating || 0) ? colors.doradoClasico : '#CBD5E0',
                        fontSize: '20px',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Citas Recientes */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={cardTitleStyle}>Citas Recientes</h3>
            <button style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: `1px solid ${colors.grafito}`,
              borderRadius: '8px',
              color: colors.grafito,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
            }}>
              Ver Todas
            </button>
          </div>

          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Cliente</th>
                <th style={thStyle}>Servicio</th>
                <th style={thStyle}>Barbero</th>
                <th style={thStyle}>Fecha</th>
                <th style={thStyle}>Hora</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.slice(0, 5).map((apt) => (
                <tr key={apt.id}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 500 }}>{apt.clientName}</div>
                  </td>
                  <td style={tdStyle}>{apt.service}</td>
                  <td style={tdStyle}>{apt.barber}</td>
                  <td style={tdStyle}>{new Date().toLocaleDateString()}</td>
                  <td style={tdStyle}>{apt.time}</td>
                  <td style={tdStyle}>{getStatusBadge(apt.status)}</td>
                  <td style={tdStyle}>
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: colors.azulAcero,
                      cursor: 'pointer',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <FontAwesomeIcon icon={faEye} />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};