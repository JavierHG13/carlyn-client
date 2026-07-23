import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faCashRegister,
  faClock,
  faMapMarkerAlt,
  faReceipt,
  faRotateRight,
  faScissors,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import { AdminLayout } from '../../layouts/AdminLayout';
import { colors } from '../../styles/colors';
import { citaService } from '../../services/citasService';
import { barberoService } from '../../services/barberoService';
import { localService, type Local } from '../../services/localService';
import type { Cita } from '../../types/citas';
import type { Barbero } from '../../types/barbero';

export const AdminPOS: React.FC = () => {
  const today = new Date().toISOString().slice(0, 10);
  const [fecha, setFecha] = useState(today);
  const [localId, setLocalId] = useState(0);
  const [barberoId, setBarberoId] = useState(0);
  const [completedEstadoId, setCompletedEstadoId] = useState<number | null>(null);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [locales, setLocales] = useState<Local[]>([]);
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadCatalogs();
  }, []);

  useEffect(() => {
    if (completedEstadoId) {
      loadCompletedAppointments();
    }
  }, [fecha, localId, barberoId, completedEstadoId]);

  const loadCatalogs = async () => {
    try {
      setLoading(true);
      setMessage('');
      const [estadosResponse, localesResponse, barberosResponse] = await Promise.all([
        citaService.getEstados(),
        localService.getActivos(),
        barberoService.getAll(),
      ]);

      const completada = estadosResponse.find((estado) => estado.nombre.toLowerCase() === 'completada');
      if (!completada) {
        setMessage('No encontre el estado Completada en la base de datos.');
        return;
      }

      setCompletedEstadoId(completada.id);
      setLocales(localesResponse);
      setBarberos(barberosResponse);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'No se pudo cargar la informacion del POS');
    } finally {
      setLoading(false);
    }
  };

  const loadCompletedAppointments = async () => {
    if (!completedEstadoId) return;

    try {
      setLoading(true);
      setMessage('');
      const response = await citaService.search({
        fechaInicio: fecha,
        fechaFin: fecha,
        estadoId: completedEstadoId,
        localId: localId || undefined,
        barberoId: barberoId || undefined,
        page: 1,
        limit: 200,
      });
      setCitas(response.data || []);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'No se pudieron cargar las citas completadas');
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBarberos = useMemo(
    () => localId ? barberos.filter((barbero) => Number(barbero.local_id) === localId) : barberos,
    [barberos, localId]
  );

  const totalServicios = useMemo(
    () => citas.reduce((sum, cita) => sum + Number(cita.servicio_precio || 0), 0),
    [citas]
  );

  const totalPagado = useMemo(
    () => citas.reduce((sum, cita) => sum + Number(cita.monto_pagado || cita.servicio_precio || 0), 0),
    [citas]
  );

  const ticketPromedio = citas.length ? totalPagado / citas.length : 0;

  const groupedByBarber = useMemo(() => {
    const groups = new Map<number, { id: number; nombre: string; total: number; citas: number }>();
    citas.forEach((cita) => {
      const current = groups.get(cita.barbero_id) || {
        id: cita.barbero_id,
        nombre: cita.barbero_nombre || 'Sin barbero',
        total: 0,
        citas: 0,
      };
      current.total += Number(cita.monto_pagado || cita.servicio_precio || 0);
      current.citas += 1;
      groups.set(cita.barbero_id, current);
    });
    return Array.from(groups.values()).sort((a, b) => b.total - a.total);
  }, [citas]);

  const groupedByLocal = useMemo(() => {
    const groups = new Map<number, { id: number; nombre: string; total: number; citas: number }>();
    citas.forEach((cita) => {
      const id = Number(cita.local_id || 0);
      const current = groups.get(id) || {
        id,
        nombre: cita.local_nombre || 'Sin sucursal',
        total: 0,
        citas: 0,
      };
      current.total += Number(cita.monto_pagado || cita.servicio_precio || 0);
      current.citas += 1;
      groups.set(id, current);
    });
    return Array.from(groups.values()).sort((a, b) => b.total - a.total);
  }, [citas]);

  const formatCurrency = (amount: number) => `$${Number(amount || 0).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const formatTime = (time?: string | null) => String(time || '').slice(0, 5);

  const pageStyle: React.CSSProperties = { width: '100%' };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 20,
    flexWrap: 'wrap',
    marginBottom: 22,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 700,
    color: colors.negroSuave,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: 0,
    fontFamily: 'Playfair Display, serif',
  };

  const subtitleStyle: React.CSSProperties = {
    margin: '8px 0 0',
    color: '#667085',
    fontSize: 15,
  };

  const toolbarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  };

  const inputStyle: React.CSSProperties = {
    height: 46,
    padding: '0 14px',
    border: '1px solid #D9E1EC',
    borderRadius: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
    color: '#101828',
    outline: 'none',
  };

  const buttonStyle = (bg: string, color = '#FFFFFF'): React.CSSProperties => ({
    height: 46,
    padding: '0 16px',
    borderRadius: 12,
    border: 'none',
    backgroundColor: bg,
    color,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontWeight: 800,
    fontSize: 14,
  });

  const summaryGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 16,
    marginBottom: 20,
  };

  const cardStyle: React.CSSProperties = {
    border: '1px solid #E2E8F0',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 22,
    boxShadow: '0 16px 36px rgba(15, 23, 42, 0.05)',
  };

  const statCardStyle: React.CSSProperties = {
    ...cardStyle,
    minHeight: 132,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const iconBubbleStyle = (bg: string, color: string): React.CSSProperties => ({
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: bg,
    color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  });

  const layoutGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.45fr) minmax(360px, 0.7fr)',
    gap: 20,
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 920,
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '16px 18px',
    backgroundColor: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0',
    color: '#475467',
    fontSize: 12,
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  };

  const tdStyle: React.CSSProperties = {
    padding: '16px 18px',
    borderBottom: '1px solid #EEF2F6',
    color: '#102A43',
    fontSize: 14,
    verticalAlign: 'middle',
  };

  const listItemStyle: React.CSSProperties = {
    border: '1px solid #E2E8F0',
    borderRadius: 14,
    padding: 14,
    background: '#FBFCFE',
    display: 'grid',
    gap: 5,
  };

  return (
    <AdminLayout>
      <div style={pageStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>
              <FontAwesomeIcon icon={faCashRegister} style={{ color: colors.doradoClasico }} />
              POS y corte del dia
            </h1>
            <p style={subtitleStyle}>Consulta solo citas completadas por fecha, sucursal y barbero.</p>
          </div>

          <div style={toolbarStyle}>
            <input type="date" style={inputStyle} value={fecha} onChange={(event) => setFecha(event.target.value)} />
            <select style={{ ...inputStyle, minWidth: 190 }} value={localId} onChange={(event) => {
              setLocalId(Number(event.target.value));
              setBarberoId(0);
            }}>
              <option value={0}>Todas las sucursales</option>
              {locales.map((local) => (
                <option key={local.id} value={local.id}>{local.nombre}</option>
              ))}
            </select>
            <select style={{ ...inputStyle, minWidth: 190 }} value={barberoId} onChange={(event) => setBarberoId(Number(event.target.value))}>
              <option value={0}>Todos los barberos</option>
              {filteredBarberos.map((barbero) => (
                <option key={barbero.barbero_id} value={barbero.barbero_id}>{barbero.nombre}</option>
              ))}
            </select>
            <button style={buttonStyle('#E2E8F0', '#475467')} onClick={loadCompletedAppointments}>
              <FontAwesomeIcon icon={faRotateRight} />
              Actualizar
            </button>
            <button
              style={buttonStyle(colors.azulAcero)}
              onClick={() => setMessage(`Corte del ${fecha}: ${citas.length} citas completadas, total ${formatCurrency(totalPagado)}.`)}
            >
              <FontAwesomeIcon icon={faReceipt} />
              Corte de caja
            </button>
          </div>
        </div>

        {message && (
          <div style={{ padding: 14, borderRadius: 14, backgroundColor: '#FFFAEB', color: '#92400E', marginBottom: 16, border: '1px solid #FEDF89' }}>
            {message}
          </div>
        )}

        <div style={summaryGridStyle}>
          {[
            { label: 'Citas completadas', value: citas.length, detail: 'servicios cerrados', icon: faCalendarCheck, bg: '#EFF8FF', color: '#175CD3' },
            { label: 'Total del dia', value: formatCurrency(totalPagado), detail: 'monto registrado', icon: faCashRegister, bg: '#ECFDF3', color: '#067647' },
            { label: 'Ticket promedio', value: formatCurrency(ticketPromedio), detail: 'por cita completada', icon: faReceipt, bg: '#FFFAEB', color: colors.doradoClasico },
            { label: 'Servicios', value: formatCurrency(totalServicios), detail: 'valor de catalogo', icon: faScissors, bg: '#F4F3FF', color: '#6938EF' },
          ].map((stat) => (
            <div key={stat.label} style={statCardStyle}>
              <div>
                <div style={iconBubbleStyle(stat.bg, stat.color)}>
                  <FontAwesomeIcon icon={stat.icon} />
                </div>
                <div style={{ fontSize: 13, color: '#667085', fontWeight: 800 }}>{stat.label}</div>
              </div>
              <div>
                <div style={{ color: '#101828', fontSize: 30, fontWeight: 900 }}>{stat.value}</div>
                <div style={{ color: '#98A2B3', fontSize: 13, marginTop: 3 }}>{stat.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: colors.azulAcero }}>Cargando citas completadas...</div>
        ) : (
          <div style={layoutGridStyle}>
            <section style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
                <div>
                  <h2 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: 24, color: colors.negroSuave }}>
                    Citas completadas
                  </h2>
                  <p style={{ margin: '6px 0 0', color: '#667085' }}>Solo aparecen citas con estado Completada para la fecha seleccionada.</p>
                </div>
                <span style={{ padding: '8px 12px', borderRadius: 999, background: '#F2F4F7', color: '#344054', fontWeight: 800 }}>
                  {fecha}
                </span>
              </div>

              {citas.length === 0 ? (
                <div style={{ padding: '70px 20px', textAlign: 'center', color: '#667085' }}>
                  <FontAwesomeIcon icon={faScissors} style={{ fontSize: 42, opacity: 0.35, marginBottom: 14 }} />
                  <h3 style={{ margin: '0 0 8px', color: '#344054' }}>Sin citas completadas</h3>
                  <div>No hay servicios cerrados con los filtros actuales.</div>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        {['Folio', 'Cliente', 'Servicio', 'Barbero', 'Sucursal', 'Hora', 'Monto'].map((head) => (
                          <th key={head} style={thStyle}>{head}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {citas.map((cita) => (
                        <tr key={cita.id}>
                          <td style={tdStyle}>#{cita.id}</td>
                          <td style={tdStyle}>
                            <strong>{cita.cliente_nombre}</strong>
                            <div style={{ color: '#667085', fontSize: 12 }}>{cita.cliente_telefono || cita.cliente_email}</div>
                          </td>
                          <td style={tdStyle}>
                            <strong>{cita.servicio_nombre}</strong>
                            <div style={{ color: '#667085', fontSize: 12 }}>{cita.servicio_duracion} min</div>
                          </td>
                          <td style={tdStyle}>{cita.barbero_nombre}</td>
                          <td style={tdStyle}>
                            {cita.local_nombre || 'Sin sucursal'}
                            <div style={{ color: '#667085', fontSize: 12 }}>{cita.local_direccion || ''}</div>
                          </td>
                          <td style={tdStyle}>{formatTime(cita.hora_inicio)} - {formatTime(cita.hora_fin)}</td>
                          <td style={{ ...tdStyle, fontWeight: 900, color: colors.doradoClasico }}>
                            {formatCurrency(Number(cita.monto_pagado || cita.servicio_precio || 0))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <aside style={{ display: 'grid', gap: 20, alignContent: 'start' }}>
              <section style={cardStyle}>
                <h2 style={{ margin: '0 0 16px', fontSize: 20, color: colors.negroSuave }}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: colors.doradoClasico, marginRight: 8 }} />
                  Por sucursal
                </h2>
                <div style={{ display: 'grid', gap: 10 }}>
                  {groupedByLocal.length === 0 ? (
                    <div style={{ color: '#667085' }}>Sin informacion por sucursal.</div>
                  ) : groupedByLocal.map((item) => (
                    <div key={item.id} style={listItemStyle}>
                      <strong>{item.nombre}</strong>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#667085', fontSize: 13 }}>
                        <span>{item.citas} citas</span>
                        <strong style={{ color: colors.doradoClasico }}>{formatCurrency(item.total)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section style={cardStyle}>
                <h2 style={{ margin: '0 0 16px', fontSize: 20, color: colors.negroSuave }}>
                  <FontAwesomeIcon icon={faUserTie} style={{ color: colors.doradoClasico, marginRight: 8 }} />
                  Por barbero
                </h2>
                <div style={{ display: 'grid', gap: 10 }}>
                  {groupedByBarber.length === 0 ? (
                    <div style={{ color: '#667085' }}>Sin informacion por barbero.</div>
                  ) : groupedByBarber.map((item) => (
                    <div key={item.id} style={listItemStyle}>
                      <strong>{item.nombre}</strong>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#667085', fontSize: 13 }}>
                        <span>{item.citas} servicios</span>
                        <strong style={{ color: colors.doradoClasico }}>{formatCurrency(item.total)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section style={cardStyle}>
                <h2 style={{ margin: '0 0 10px', fontSize: 20, color: colors.negroSuave }}>
                  <FontAwesomeIcon icon={faClock} style={{ color: colors.doradoClasico, marginRight: 8 }} />
                  Corte rapido
                </h2>
                <p style={{ margin: 0, color: '#667085', lineHeight: 1.6 }}>
                  Usa los filtros para revisar una sucursal o un barbero especifico antes de generar el corte.
                </p>
              </section>
            </aside>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
