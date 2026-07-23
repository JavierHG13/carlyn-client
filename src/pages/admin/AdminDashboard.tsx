// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faBrain,
  faCalendarAlt,
  faCalendarCheck,
  faCashRegister,
  faChartLine,
  faCheckCircle,
  faClock,
  faDatabase,
  faEye,
  faHourglassHalf,
  faMapMarkerAlt,
  faMoneyBillTrendUp,
  faScissors,
  faTimesCircle,
  faUserTie,
  faUsers,
  faUsersViewfinder,
  faBox,
} from '@fortawesome/free-solid-svg-icons';
import { AdminLayout } from '../../layouts/AdminLayout';
import { colors } from '../../styles/colors';
import api from '../../services/axios';
import { useAuth } from '../../context/AuthContext';

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

interface DashboardStats {
  citasHoy: number;
  clientesTotales: number;
  barberosActivos: number;
  serviciosActivos: number;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [proximasCitas, setProximasCitas] = useState<CitaProxima[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
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

      const citasResponse = await api.get('/citas/proximas?dias=7');
      setProximasCitas(citasResponse.data.data || []);

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
      Pendiente: { color: '#B7791F', bg: '#FEF3C7', icon: faHourglassHalf, text: 'Pendiente' },
      Confirmada: { color: '#2563EB', bg: '#DBEAFE', icon: faCheckCircle, text: 'Confirmada' },
      Completada: { color: '#059669', bg: '#D1FAE5', icon: faCheckCircle, text: 'Completada' },
      Cancelada: { color: '#DC2626', bg: '#FEE2E2', icon: faTimesCircle, text: 'Cancelada' },
      No_asistio: { color: '#DC2626', bg: '#FEE2E2', icon: faTimesCircle, text: 'No asistio' },
    };
    const style = config[estado] || config.Pendiente;

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 800,
        backgroundColor: style.bg,
        color: style.color,
      }}>
        <FontAwesomeIcon icon={style.icon} style={{ fontSize: 10 }} />
        {style.text}
      </span>
    );
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);

    if (date.toDateString() === hoy.toDateString()) return 'Hoy';
    if (date.toDateString() === manana.toDateString()) return 'Manana';
    return date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const statCards = [
    {
      label: 'Citas de hoy',
      value: stats.citasHoy,
      note: 'agenda del dia',
      icon: faCalendarCheck,
      color: '#2563EB',
      bg: '#EFF6FF',
    },
    {
      label: 'Clientes registrados',
      value: stats.clientesTotales,
      note: 'base activa',
      icon: faUsers,
      color: '#059669',
      bg: '#ECFDF5',
    },
    {
      label: 'Barberos activos',
      value: stats.barberosActivos,
      note: 'equipo disponible',
      icon: faUserTie,
      color: '#7C3AED',
      bg: '#F5F3FF',
    },
    {
      label: 'Servicios activos',
      value: stats.serviciosActivos,
      note: 'catalogo publico',
      icon: faScissors,
      color: colors.doradoClasico,
      bg: '#FFFBEB',
    },
  ];

  const operationAccess = [
    { title: 'Citas', description: 'Agenda y seguimiento', icon: faCalendarCheck, path: '/admin/citas', color: '#2563EB' },
    { title: 'Clientes', description: 'Usuarios y perfiles', icon: faUsers, path: '/admin/usuarios', color: '#059669' },
    { title: 'Barberos', description: 'Equipo y sucursales', icon: faUserTie, path: '/admin/barberos', color: '#7C3AED' },
    { title: 'Servicios', description: 'Catalogo y precios', icon: faScissors, path: '/admin/servicios', color: colors.doradoClasico },
    { title: 'Sucursales', description: 'Direccion y horarios', icon: faMapMarkerAlt, path: '/admin/locales', color: '#DC2626' },
    { title: 'Horarios', description: 'Disponibilidad', icon: faClock, path: '/admin/horarios', color: '#0F766E' },
    { title: 'POS', description: 'Ventas en mostrador', icon: faCashRegister, path: '/admin/pos', color: '#16A34A' },
    { title: 'Productos', description: 'Inventario y catalogo', icon: faBox, path: '/admin/productos', color: '#475467' },
  ];

  const intelligenceAccess = [
    { title: 'Prediccion', description: 'Analisis general', icon: faChartLine, path: '/admin/prediccion', color: '#0284C7' },
    { title: 'No-show IA', description: 'Riesgo de inasistencia', icon: faBrain, path: '/admin/conocimiento/no-show', color: '#232A67' },
    { title: 'Ingresos IA', description: 'Pronostico semanal', icon: faMoneyBillTrendUp, path: '/admin/conocimiento/ingresos', color: '#2B6A35' },
    { title: 'Segmentacion', description: 'Grupos de clientes', icon: faUsersViewfinder, path: '/admin/conocimiento/segmentacion', color: '#65519A' },
    { title: 'Base de Datos', description: 'Respaldo y estado', icon: faDatabase, path: '/admin/database', color: '#344054' },
  ];

  const pageStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  };

  const heroStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #181818 0%, #252525 58%, #3A2A09 100%)',
    color: '#FFFFFF',
    borderRadius: 24,
    padding: '34px 36px',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    alignItems: 'center',
    gap: 28,
    boxShadow: '0 24px 60px rgba(15,23,42,0.12)',
  };

  const eyebrowStyle: React.CSSProperties = {
    color: '#F6C453',
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: 10,
  };

  const heroTitleStyle: React.CSSProperties = {
    color: '#FFFFFF',
    fontSize: 42,
    lineHeight: 1.05,
    margin: 0,
  };

  const heroTextStyle: React.CSSProperties = {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 16,
    maxWidth: 660,
    marginTop: 14,
  };

  const heroActionStyle: React.CSSProperties = {
    border: '1px solid rgba(255,255,255,0.24)',
    background: '#FFFFFF',
    color: '#111827',
    borderRadius: 999,
    padding: '14px 18px',
    fontWeight: 900,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    whiteSpace: 'nowrap',
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 18,
  };

  const statCardStyle: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    border: '1px solid #E4E9F1',
    boxShadow: '0 14px 34px rgba(15,23,42,0.05)',
  };

  const moduleGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 14,
  };

  const moduleCardStyle: React.CSSProperties = {
    border: '1px solid #E4E9F1',
    background: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    textAlign: 'left',
  };

  const sectionCardStyle: React.CSSProperties = {
    background: '#FFFFFF',
    border: '1px solid #E4E9F1',
    borderRadius: 24,
    padding: 24,
    boxShadow: '0 14px 34px rgba(15,23,42,0.04)',
  };

  const sectionHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    marginBottom: 18,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 22,
    fontWeight: 900,
    color: '#101828',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '14px 12px',
    color: '#667085',
    fontSize: 12,
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    background: '#F8FAFC',
    borderBottom: '1px solid #E4E9F1',
  };

  const tdStyle: React.CSSProperties = {
    padding: '16px 12px',
    borderBottom: '1px solid #EEF2F6',
    fontSize: 14,
    verticalAlign: 'middle',
    color: '#1D2939',
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: 80, color: '#667085' }}>Cargando dashboard...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={pageStyle}>
        <section style={heroStyle}>
          <div>
            <div style={eyebrowStyle}>Command center</div>
            <h2 style={heroTitleStyle}>Hola, {user?.nombre?.split(' ')[0] || 'admin'}.</h2>
            <p style={heroTextStyle}>
              Revisa la operacion del dia, entra rapido a los modulos principales y da seguimiento a las proximas reservas.
            </p>
          </div>
          <button type="button" style={heroActionStyle} onClick={() => navigate('/admin/citas')}>
            Ver agenda <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </section>

        <section style={statsGridStyle}>
          {statCards.map((card) => (
            <article key={card.label} style={statCardStyle}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: card.bg,
                color: card.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                marginBottom: 18,
              }}>
                <FontAwesomeIcon icon={card.icon} />
              </div>
              <div style={{ fontSize: 38, lineHeight: 1, fontWeight: 900, color: '#101828', marginBottom: 10 }}>
                {card.value}
              </div>
              <div style={{ fontWeight: 900, color: '#1D2939' }}>{card.label}</div>
              <div style={{ color: '#8A94A6', marginTop: 4 }}>{card.note}</div>
            </article>
          ))}
        </section>

        <section style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <h3 style={sectionTitleStyle}>Operacion</h3>
          </div>
          <div style={moduleGridStyle}>
            {operationAccess.map((item) => (
              <button
                key={item.path}
                type="button"
                style={moduleCardStyle}
                onClick={() => navigate(item.path)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 18px 34px rgba(15,23,42,0.09)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  background: `${item.color}14`,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  flexShrink: 0,
                }}>
                  <FontAwesomeIcon icon={item.icon} />
                </span>
                <span>
                  <span style={{ display: 'block', color: '#101828', fontWeight: 900, fontSize: 16 }}>{item.title}</span>
                  <span style={{ display: 'block', color: '#667085', fontSize: 13, marginTop: 2 }}>{item.description}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <h3 style={sectionTitleStyle}>Inteligencia y datos</h3>
          </div>
          <div style={moduleGridStyle}>
            {intelligenceAccess.map((item) => (
              <button
                key={item.path}
                type="button"
                style={moduleCardStyle}
                onClick={() => navigate(item.path)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 18px 34px rgba(15,23,42,0.09)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  background: `${item.color}14`,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  flexShrink: 0,
                }}>
                  <FontAwesomeIcon icon={item.icon} />
                </span>
                <span>
                  <span style={{ display: 'block', color: '#101828', fontWeight: 900, fontSize: 16 }}>{item.title}</span>
                  <span style={{ display: 'block', color: '#667085', fontSize: 13, marginTop: 2 }}>{item.description}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <h3 style={sectionTitleStyle}>
              <FontAwesomeIcon icon={faCalendarAlt} style={{ color: colors.doradoClasico }} />
              Proximas citas
            </h3>
            <button
              type="button"
              onClick={() => navigate('/admin/citas')}
              style={{
                border: '1px solid #E4E9F1',
                background: '#FFFFFF',
                borderRadius: 999,
                padding: '10px 14px',
                cursor: 'pointer',
                fontWeight: 900,
                color: '#344054',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Ver todas <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 12 }} />
            </button>
          </div>

          {proximasCitas.length === 0 ? (
            <div style={{
              border: '1px dashed #D0D5DD',
              borderRadius: 18,
              padding: 36,
              textAlign: 'center',
              color: '#667085',
            }}>
              No hay citas programadas en los proximos dias.
            </div>
          ) : (
            <div style={{ overflowX: 'auto', border: '1px solid #E4E9F1', borderRadius: 18 }}>
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
                        <div style={{ fontWeight: 900 }}>{cita.cliente_nombre}</div>
                        <div style={{ fontSize: 12, color: '#667085', marginTop: 3 }}>{cita.cliente_telefono}</div>
                      </td>
                      <td style={tdStyle}>{cita.servicio_nombre}</td>
                      <td style={tdStyle}>{cita.barbero_nombre}</td>
                      <td style={tdStyle}>
                        <strong>{formatFecha(cita.fecha)}</strong>
                      </td>
                      <td style={tdStyle}>{cita.hora_inicio?.slice(0, 5)} hrs</td>
                      <td style={tdStyle}>{getEstadoBadge(cita.estado_nombre)}</td>
                      <td style={tdStyle}>
                        <button
                          type="button"
                          onClick={() => navigate('/admin/citas')}
                          style={{
                            border: 'none',
                            background: '#F2F4F7',
                            color: '#344054',
                            borderRadius: 999,
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 7,
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} style={{ fontSize: 12 }} />
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
};
