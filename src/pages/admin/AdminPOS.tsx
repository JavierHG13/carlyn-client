import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faCashRegister,
  faClock,
  faMapMarkerAlt,
  faMoneyBillWave,
  faPhone,
  faReceipt,
  faRotateRight,
  faSave,
  faScissors,
  faUser,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import { AdminLayout } from '../../layouts/AdminLayout';
import { colors } from '../../styles/colors';
import { citaService } from '../../services/citasService';
import { barberoService } from '../../services/barberoService';
import { localService, type Local } from '../../services/localService';
import { saleService, type WalkInServiceInput } from '../../services/saleService';
import { servicioService } from '../../services/servicioService';
import type { Cita } from '../../types/citas';
import type { Barbero } from '../../types/barbero';
import type { Servicio } from '../../types/servicio';
import { getDateOnlyKey } from '../../utils/dateUtils';

type PaymentMethod = WalkInServiceInput['metodoPago'];

const getCurrentTimeInput = () => {
  const date = new Date();
  const roundedMinutes = Math.ceil(date.getMinutes() / 10) * 10;
  date.setMinutes(roundedMinutes, 0, 0);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

export const AdminPOS: React.FC = () => {
  const today = getDateOnlyKey(new Date());
  const [fecha, setFecha] = useState(today);
  const [localId, setLocalId] = useState(0);
  const [barberoId, setBarberoId] = useState(0);
  const [completedEstadoId, setCompletedEstadoId] = useState<number | null>(null);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [locales, setLocales] = useState<Local[]>([]);
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingWalkIn, setSavingWalkIn] = useState(false);
  const [message, setMessage] = useState('');
  const [walkInForm, setWalkInForm] = useState({
    localId: '',
    barberoId: '',
    servicioId: '',
    horaInicio: getCurrentTimeInput(),
    metodoPago: 'efectivo' as PaymentMethod,
    clienteNombre: '',
    clienteTelefono: '',
    notas: '',
  });

  useEffect(() => {
    loadCatalogs();
  }, []);

  useEffect(() => {
    if (completedEstadoId) {
      loadPointOfSaleDay();
    }
  }, [fecha, localId, barberoId, completedEstadoId]);

  const loadCatalogs = async () => {
    try {
      setLoading(true);
      setMessage('');
      const [estadosResponse, localesResponse, barberosResponse, serviciosResponse] = await Promise.all([
        citaService.getEstados(),
        localService.getActivos(),
        barberoService.getAll(),
        servicioService.getAll({ activo: true }),
      ]);

      const completada = estadosResponse.find((estado) => estado.nombre.toLowerCase() === 'completada');
      if (!completada) {
        setMessage('No encontre el estado Completada en la base de datos.');
        return;
      }

      setCompletedEstadoId(completada.id);
      setLocales(localesResponse);
      setBarberos(barberosResponse);
      setServicios(serviciosResponse);

      const defaultLocalId = localesResponse[0]?.id;
      const defaultBarber = defaultLocalId
        ? barberosResponse.find((barbero) => Number(barbero.local_id) === Number(defaultLocalId))
        : barberosResponse[0];

      setWalkInForm((prev) => ({
        ...prev,
        localId: prev.localId || (defaultLocalId ? String(defaultLocalId) : ''),
        barberoId: prev.barberoId || (defaultBarber?.barbero_id ? String(defaultBarber.barbero_id) : ''),
        servicioId: prev.servicioId || (serviciosResponse[0]?.id ? String(serviciosResponse[0].id) : ''),
      }));
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'No se pudo cargar la informacion del POS');
    } finally {
      setLoading(false);
    }
  };

  const loadPointOfSaleDay = async () => {
    if (!completedEstadoId) return;

    try {
      setLoading(true);
      setMessage('');
      const response = await citaService.search({
        fechaInicio: fecha,
        fechaFin: fecha,
        localId: localId || undefined,
        barberoId: barberoId || undefined,
        page: 1,
        limit: 300,
      });
      setCitas(response.data || []);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'No se pudo cargar la informacion del dia');
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  const normalizeStatus = (status?: string | null) => String(status || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/_/g, ' ')
    .trim();

  const getPaymentAmount = (cita: Cita) => Number(cita.monto_pagado || cita.servicio_precio || 0);

  const serviciosPagados = useMemo(
    () => citas.filter((cita) => normalizeStatus(cita.estado_nombre) === 'completada' && getPaymentAmount(cita) > 0),
    [citas]
  );

  const citasPorConcluir = useMemo(
    () => citas.filter((cita) => {
      const estado = normalizeStatus(cita.estado_nombre);
      return !['completada', 'cancelada', 'no asistio', 'no-show'].includes(estado);
    }),
    [citas]
  );

  const filteredBarberos = useMemo(
    () => localId ? barberos.filter((barbero) => Number(barbero.local_id) === localId) : barberos,
    [barberos, localId]
  );

  const walkInBarberos = useMemo(
    () => walkInForm.localId
      ? barberos.filter((barbero) => Number(barbero.local_id) === Number(walkInForm.localId))
      : barberos,
    [barberos, walkInForm.localId]
  );

  const selectedWalkInService = useMemo(
    () => servicios.find((servicio) => Number(servicio.id) === Number(walkInForm.servicioId)),
    [servicios, walkInForm.servicioId]
  );

  const totalPagado = useMemo(
    () => serviciosPagados.reduce((sum, cita) => sum + getPaymentAmount(cita), 0),
    [serviciosPagados]
  );

  const ticketPromedio = serviciosPagados.length ? totalPagado / serviciosPagados.length : 0;

  const groupedByBarber = useMemo(() => {
    const groups = new Map<number, { id: number; nombre: string; total: number; citas: number }>();
    serviciosPagados.forEach((cita) => {
      const current = groups.get(cita.barbero_id) || {
        id: cita.barbero_id,
        nombre: cita.barbero_nombre || 'Sin barbero',
        total: 0,
        citas: 0,
      };
      current.total += getPaymentAmount(cita);
      current.citas += 1;
      groups.set(cita.barbero_id, current);
    });
    return Array.from(groups.values()).sort((a, b) => b.total - a.total);
  }, [serviciosPagados]);

  const groupedByLocal = useMemo(() => {
    const groups = new Map<number, { id: number; nombre: string; total: number; citas: number }>();
    serviciosPagados.forEach((cita) => {
      const id = Number(cita.local_id || 0);
      const current = groups.get(id) || {
        id,
        nombre: cita.local_nombre || 'Sin sucursal',
        total: 0,
        citas: 0,
      };
      current.total += getPaymentAmount(cita);
      current.citas += 1;
      groups.set(id, current);
    });
    return Array.from(groups.values()).sort((a, b) => b.total - a.total);
  }, [serviciosPagados]);

  const formatCurrency = (amount: number) => `$${Number(amount || 0).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const formatTime = (time?: string | null) => String(time || '').slice(0, 5);

  const updateWalkInForm = (field: keyof typeof walkInForm, value: string) => {
    setWalkInForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === 'localId') {
        const nextBarbero = barberos.find((barbero) => Number(barbero.local_id) === Number(value));
        next.barberoId = nextBarbero?.barbero_id ? String(nextBarbero.barbero_id) : '';
      }

      return next;
    });
  };

  const handleRegisterWalkInService = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!walkInForm.localId || !walkInForm.barberoId || !walkInForm.servicioId || !walkInForm.horaInicio) {
      setMessage('Completa sucursal, barbero, servicio y hora.');
      return;
    }

    try {
      setSavingWalkIn(true);
      setMessage('');
      await saleService.registerWalkInService({
        localId: Number(walkInForm.localId),
        barberoId: Number(walkInForm.barberoId),
        servicioId: Number(walkInForm.servicioId),
        fecha,
        horaInicio: walkInForm.horaInicio,
        metodoPago: walkInForm.metodoPago,
        clienteNombre: walkInForm.clienteNombre.trim() || 'Cliente mostrador',
        clienteTelefono: walkInForm.clienteTelefono.trim() || undefined,
        notas: walkInForm.notas.trim() || undefined,
      });

      setMessage('Servicio de mostrador registrado como cita completada y pagada.');
      setWalkInForm((prev) => ({
        ...prev,
        clienteNombre: '',
        clienteTelefono: '',
        notas: '',
        horaInicio: getCurrentTimeInput(),
      }));
      await loadPointOfSaleDay();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'No se pudo registrar el servicio de mostrador');
    } finally {
      setSavingWalkIn(false);
    }
  };

  const pageStyle: React.CSSProperties = { width: '100%' };

  const headerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'minmax(280px, 0.8fr) minmax(0, 1.2fr)',
    alignItems: 'center',
    gap: 24,
    marginBottom: 22,
    padding: 22,
    border: '1px solid #E2E8F0',
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    boxShadow: '0 18px 42px rgba(15, 23, 42, 0.04)',
    overflow: 'hidden',
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
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    minWidth: 0,
  };

  const inputStyle: React.CSSProperties = {
    height: 46,
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    padding: '0 14px',
    border: '1px solid #D9E1EC',
    borderRadius: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
    color: '#101828',
    outline: 'none',
  };

  const toolbarInputStyle: React.CSSProperties = {
    ...inputStyle,
    height: 44,
    width: 'auto',
    flex: '1 1 170px',
    maxWidth: 260,
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
    whiteSpace: 'nowrap',
    flex: '0 0 auto',
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
    minWidth: 0,
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
    gridTemplateColumns: 'minmax(0, 1fr) minmax(300px, 360px)',
    gap: 20,
    alignItems: 'start',
  };

  const formGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 12,
    alignItems: 'end',
  };

  const formWideGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 12,
    alignItems: 'end',
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
              POS y servicios del dia
            </h1>
            <p style={subtitleStyle}>Separa servicios pagados de citas que siguen pendientes por concluir.</p>
          </div>

          <div style={toolbarStyle}>
            <input type="date" style={toolbarInputStyle} value={fecha} onChange={(event) => setFecha(event.target.value)} />
            <select style={toolbarInputStyle} value={localId} onChange={(event) => {
              setLocalId(Number(event.target.value));
              setBarberoId(0);
            }}>
              <option value={0}>Todas las sucursales</option>
              {locales.map((local) => (
                <option key={local.id} value={local.id}>{local.nombre}</option>
              ))}
            </select>
            <select style={toolbarInputStyle} value={barberoId} onChange={(event) => setBarberoId(Number(event.target.value))}>
              <option value={0}>Todos los barberos</option>
              {filteredBarberos.map((barbero) => (
                <option key={barbero.barbero_id} value={barbero.barbero_id}>{barbero.nombre}</option>
              ))}
            </select>
            <button style={buttonStyle('#E2E8F0', '#475467')} onClick={loadPointOfSaleDay}>
              <FontAwesomeIcon icon={faRotateRight} />
              Actualizar
            </button>
            <button
              style={buttonStyle(colors.azulAcero)}
              onClick={() => setMessage(`Corte del ${fecha}: ${serviciosPagados.length} servicios pagados, total ${formatCurrency(totalPagado)}.`)}
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
            { label: 'Servicios pagados', value: serviciosPagados.length, detail: 'cerrados en caja', icon: faCalendarCheck, bg: '#EFF8FF', color: '#175CD3' },
            { label: 'Total cobrado', value: formatCurrency(totalPagado), detail: 'monto registrado', icon: faCashRegister, bg: '#ECFDF3', color: '#067647' },
            { label: 'Ticket promedio', value: formatCurrency(ticketPromedio), detail: 'por servicio pagado', icon: faReceipt, bg: '#FFFAEB', color: colors.doradoClasico },
            { label: 'Citas por concluir', value: citasPorConcluir.length, detail: 'pendientes o confirmadas', icon: faScissors, bg: '#F4F3FF', color: '#6938EF' },
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
          <div style={{ textAlign: 'center', padding: 60, color: colors.azulAcero }}>Cargando informacion del dia...</div>
        ) : (
          <div style={layoutGridStyle}>
            <div style={{ display: 'grid', gap: 20, minWidth: 0 }}>
              <section style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
                  <div>
                    <h2 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: 24, color: colors.negroSuave }}>
                      Servicio sin cita
                    </h2>
                    <p style={{ margin: '6px 0 0', color: '#667085', lineHeight: 1.5 }}>
                      Registra clientes que llegaron directo a la barberia. Se guarda como cita completada y pagada al 100%.
                    </p>
                  </div>
                  <span style={{ padding: '9px 12px', borderRadius: 999, background: '#ECFDF3', color: '#067647', fontWeight: 900, fontSize: 13, display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faMoneyBillWave} />
                    Pago presencial
                  </span>
                </div>

                <form onSubmit={handleRegisterWalkInService} style={{ display: 'grid', gap: 16 }}>
                  <div style={formGridStyle}>
                    <label style={{ display: 'grid', gap: 7, color: '#344054', fontWeight: 800, fontSize: 13 }}>
                      Sucursal
                      <select style={inputStyle} value={walkInForm.localId} onChange={(event) => updateWalkInForm('localId', event.target.value)}>
                        <option value="">Selecciona sucursal</option>
                        {locales.map((local) => (
                          <option key={local.id} value={local.id}>{local.nombre}</option>
                        ))}
                      </select>
                    </label>

                    <label style={{ display: 'grid', gap: 7, color: '#344054', fontWeight: 800, fontSize: 13 }}>
                      Barbero
                      <select style={inputStyle} value={walkInForm.barberoId} onChange={(event) => updateWalkInForm('barberoId', event.target.value)}>
                        <option value="">Selecciona barbero</option>
                        {walkInBarberos.map((barbero) => (
                          <option key={barbero.barbero_id} value={barbero.barbero_id}>{barbero.nombre}</option>
                        ))}
                      </select>
                    </label>

                    <label style={{ display: 'grid', gap: 7, color: '#344054', fontWeight: 800, fontSize: 13 }}>
                      Servicio
                      <select style={inputStyle} value={walkInForm.servicioId} onChange={(event) => updateWalkInForm('servicioId', event.target.value)}>
                        <option value="">Selecciona servicio</option>
                        {servicios.map((servicio) => (
                          <option key={servicio.id} value={servicio.id}>{servicio.nombre}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div style={formGridStyle}>
                    <label style={{ display: 'grid', gap: 7, color: '#344054', fontWeight: 800, fontSize: 13 }}>
                      Hora
                      <input type="time" style={inputStyle} value={walkInForm.horaInicio} onChange={(event) => updateWalkInForm('horaInicio', event.target.value)} />
                    </label>

                    <label style={{ display: 'grid', gap: 7, color: '#344054', fontWeight: 800, fontSize: 13 }}>
                      Metodo de pago
                      <select style={inputStyle} value={walkInForm.metodoPago} onChange={(event) => updateWalkInForm('metodoPago', event.target.value)}>
                        <option value="efectivo">Efectivo</option>
                        <option value="tarjeta">Tarjeta</option>
                        <option value="transferencia">Transferencia</option>
                      </select>
                    </label>

                    <label style={{ display: 'grid', gap: 7, color: '#344054', fontWeight: 800, fontSize: 13 }}>
                      Cliente
                      <div style={{ position: 'relative', minWidth: 0 }}>
                        <FontAwesomeIcon icon={faUser} style={{ position: 'absolute', left: 14, top: 15, color: '#98A2B3' }} />
                        <input
                          style={{ ...inputStyle, width: '100%', paddingLeft: 40, boxSizing: 'border-box' }}
                          value={walkInForm.clienteNombre}
                          onChange={(event) => updateWalkInForm('clienteNombre', event.target.value)}
                          placeholder="Cliente mostrador"
                        />
                      </div>
                    </label>
                  </div>

                  <div style={formWideGridStyle}>
                    <label style={{ display: 'grid', gap: 7, color: '#344054', fontWeight: 800, fontSize: 13 }}>
                      Telefono
                      <div style={{ position: 'relative', minWidth: 0 }}>
                        <FontAwesomeIcon icon={faPhone} style={{ position: 'absolute', left: 14, top: 15, color: '#98A2B3' }} />
                        <input
                          style={{ ...inputStyle, width: '100%', paddingLeft: 40, boxSizing: 'border-box' }}
                          value={walkInForm.clienteTelefono}
                          onChange={(event) => updateWalkInForm('clienteTelefono', event.target.value)}
                          placeholder="Opcional"
                        />
                      </div>
                    </label>

                    <label style={{ display: 'grid', gap: 7, color: '#344054', fontWeight: 800, fontSize: 13 }}>
                      Notas
                      <input
                        style={inputStyle}
                        value={walkInForm.notas}
                        onChange={(event) => updateWalkInForm('notas', event.target.value)}
                        placeholder="Opcional"
                      />
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap', border: '1px solid #E2E8F0', borderRadius: 14, padding: 14, background: '#F8FAFC' }}>
                    <div>
                      <strong style={{ color: colors.negroSuave }}>
                        {selectedWalkInService?.nombre || 'Selecciona un servicio'}
                      </strong>
                      <div style={{ color: '#667085', fontSize: 13, marginTop: 4 }}>
                        {selectedWalkInService
                          ? `${selectedWalkInService.duracion} min - ${formatCurrency(selectedWalkInService.precio)}`
                          : 'El registro se toma para la fecha filtrada en POS.'}
                      </div>
                    </div>
                    <button type="submit" disabled={savingWalkIn} style={{ ...buttonStyle(colors.doradoClasico, '#111827'), opacity: savingWalkIn ? 0.7 : 1 }}>
                      <FontAwesomeIcon icon={faSave} />
                      {savingWalkIn ? 'Guardando...' : 'Registrar servicio'}
                    </button>
                  </div>
                </form>
              </section>

              <section style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
                <div>
                  <h2 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: 24, color: colors.negroSuave }}>
                    Servicios pagados
                  </h2>
                  <p style={{ margin: '6px 0 0', color: '#667085' }}>Servicios cerrados y pagados para la fecha seleccionada.</p>
                </div>
                <span style={{ padding: '8px 12px', borderRadius: 999, background: '#F2F4F7', color: '#344054', fontWeight: 800 }}>
                  {fecha}
                </span>
              </div>

              {serviciosPagados.length === 0 ? (
                <div style={{ padding: '70px 20px', textAlign: 'center', color: '#667085' }}>
                  <FontAwesomeIcon icon={faScissors} style={{ fontSize: 42, opacity: 0.35, marginBottom: 14 }} />
                  <h3 style={{ margin: '0 0 8px', color: '#344054' }}>Sin servicios pagados</h3>
                  <div>No hay servicios cobrados con los filtros actuales.</div>
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
                      {serviciosPagados.map((cita) => (
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
                            {formatCurrency(getPaymentAmount(cita))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              </section>

              <section style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
                  <div>
                    <h2 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: 24, color: colors.negroSuave }}>
                      Citas por concluir
                    </h2>
                    <p style={{ margin: '6px 0 0', color: '#667085' }}>Reservas pendientes o confirmadas que aun no se han cerrado en caja.</p>
                  </div>
                  <span style={{ padding: '8px 12px', borderRadius: 999, background: '#FFFAEB', color: '#B54708', fontWeight: 800 }}>
                    {citasPorConcluir.length} pendientes
                  </span>
                </div>

                {citasPorConcluir.length === 0 ? (
                  <div style={{ padding: '54px 20px', textAlign: 'center', color: '#667085' }}>
                    <FontAwesomeIcon icon={faCalendarCheck} style={{ fontSize: 40, opacity: 0.35, marginBottom: 14 }} />
                    <h3 style={{ margin: '0 0 8px', color: '#344054' }}>Sin citas por concluir</h3>
                    <div>No hay reservas abiertas con los filtros actuales.</div>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          {['Folio', 'Cliente', 'Servicio', 'Barbero', 'Hora', 'Estado', 'Monto'].map((head) => (
                            <th key={head} style={thStyle}>{head}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {citasPorConcluir.map((cita) => (
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
                            <td style={tdStyle}>{formatTime(cita.hora_inicio)} - {formatTime(cita.hora_fin)}</td>
                            <td style={tdStyle}>
                              <span style={{ padding: '7px 10px', borderRadius: 999, background: '#FEF3C7', color: '#B45309', fontWeight: 900, fontSize: 12 }}>
                                {cita.estado_nombre || 'Pendiente'}
                              </span>
                            </td>
                            <td style={{ ...tdStyle, fontWeight: 900, color: '#475467' }}>
                              {formatCurrency(getPaymentAmount(cita))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>

            <aside style={{ display: 'grid', gap: 20, alignContent: 'start', minWidth: 0 }}>
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
