import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faCalendarAlt,
  faCheckCircle,
  faChevronLeft,
  faChevronRight,
  faCreditCard,
  faDollarSign,
  faInfoCircle,
  faMapMarkerAlt,
  faScissors,
  faSpinner,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/axios';
import { citaService } from '../../../services/citasService';
import { localService, type Local } from '../../../services/localService';
import { paymentService } from '../../../services/paymentService';
import { colors } from '../../../styles/colors';

interface ServicioSeleccionado {
  id: number;
  nombre: string;
  duracion: number;
  precio: number;
}

interface Barbero {
  barbero_id: number;
  nombre: string;
  especialidad: string;
  calificacion?: number;
  foto: string | null;
}

interface HorarioDisponible {
  hora: string;
  disponible?: boolean;
  ocupado?: boolean;
}

const meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const diasSemana = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

interface AgendarCitaProps {
  modal?: boolean;
}

export const AgendarCita: React.FC<AgendarCitaProps> = ({ modal = false }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading: authLoading, user } = useAuth();

  const servicioSeleccionado = useMemo<ServicioSeleccionado | null>(() => {
    const servicioId = searchParams.get('servicioId');
    if (!servicioId) return null;

    return {
      id: Number(servicioId),
      nombre: searchParams.get('servicioNombre') || 'Servicio seleccionado',
      duracion: Number(searchParams.get('duracion') || 30),
      precio: Number(searchParams.get('precio') || 0),
    };
  }, [searchParams]);

  const [step, setStep] = useState(1);
  const [locales, setLocales] = useState<Local[]>([]);
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [horarios, setHorarios] = useState<HorarioDisponible[]>([]);
  const [disabledDates, setDisabledDates] = useState<string[]>([]);

  const [selectedLocal, setSelectedLocal] = useState<Local | null>(null);
  const [selectedBarbero, setSelectedBarbero] = useState<Barbero | null>(null);
  const [selectedFecha, setSelectedFecha] = useState('');
  const [selectedHora, setSelectedHora] = useState('');

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [submitAction, setSubmitAction] = useState<'no-pay' | 'deposit' | null>(null);
  const [error, setError] = useState('');

  const submitting = submitAction !== null;
  const pagoTotal = Number((servicioSeleccionado?.precio || 0).toFixed(2));

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          redirectTo: `/agendar-cita?${searchParams.toString()}`,
        },
        replace: true,
      });
    }
  }, [authLoading, isAuthenticated, navigate, searchParams]);

  useEffect(() => {
    const loadLocales = async () => {
      if (!isAuthenticated) return;
      setLoading(true);
      setError('');
      try {
        const data = await localService.getActivos();
        setLocales(data);
      } catch {
        setError('No pudimos cargar las sucursales. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    loadLocales();
  }, [isAuthenticated]);

  useEffect(() => {
    const loadBarberos = async () => {
      if (!selectedLocal) return;
      setLoading(true);
      setError('');
      setBarberos([]);
      setSelectedBarbero(null);
      setSelectedFecha('');
      setSelectedHora('');

      try {
        const response = await api.get(`/barbero/local/${selectedLocal.id}`);
        setBarberos(response.data.data || []);
      } catch {
        setError('No pudimos cargar los barberos de esta sucursal.');
      } finally {
        setLoading(false);
      }
    };

    loadBarberos();
  }, [selectedLocal]);

  useEffect(() => {
    const loadFechas = async () => {
      if (!selectedBarbero || step !== 3) return;
      try {
        const response = await api.get('/citas/fechas-disponibles', {
          params: { barberoId: selectedBarbero.barbero_id },
        });
        setDisabledDates(response.data.fechasNoDisponibles || []);
      } catch {
        setDisabledDates([]);
      }
    };

    loadFechas();
  }, [selectedBarbero, step]);

  useEffect(() => {
    const loadHorarios = async () => {
      if (!selectedBarbero || !selectedFecha || step !== 3) return;
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/citas/horarios-disponibles', {
          params: {
            barberoId: selectedBarbero.barbero_id,
            fecha: selectedFecha,
          },
        });
        const disponibles = response.data.disponibles || [];
        setHorarios(disponibles);
        setSelectedHora((current) =>
          current && disponibles.some((horario: HorarioDisponible) => horario.hora === current && horario.disponible !== false)
            ? current
            : ''
        );
      } catch {
        setError('No pudimos cargar los horarios disponibles.');
      } finally {
        setLoading(false);
      }
    };

    loadHorarios();
  }, [selectedBarbero, selectedFecha, step]);

  const goToStep = (nextStep: number) => {
    setError('');
    setStep(nextStep);
  };

  const handleLocalSelect = (local: Local) => {
    setSelectedLocal(local);
    setSelectedBarbero(null);
    setSelectedFecha('');
    setSelectedHora('');
  };

  const handleBarberoSelect = (barbero: Barbero) => {
    setSelectedBarbero(barbero);
    setSelectedFecha('');
    setSelectedHora('');
  };

  const getDaysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (month: number, year: number) =>
    new Date(year, month, 1).getDay();

  const toDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    return disabledDates.includes(toDateKey(date));
  };

  const handleDateSelect = (date: Date) => {
    if (!isDateDisabled(date)) {
      setSelectedFecha(toDateKey(date));
    }
  };

  const handlePayment = async () => {
    if (!servicioSeleccionado || !selectedLocal || !selectedBarbero || !selectedFecha || !selectedHora) {
      setError('Completa todos los pasos antes de continuar al pago.');
      return;
    }

    setSubmitAction('deposit');
    setError('');
    try {
      const preference = await paymentService.createAppointmentPreference({
        localId: selectedLocal.id,
        barberoId: selectedBarbero.barbero_id,
        servicioId: servicioSeleccionado.id,
        fecha: selectedFecha,
        horaInicio: selectedHora,
      });

      sessionStorage.setItem('carlyn_pending_appointment', JSON.stringify({
        url: `/agendar-cita?${searchParams.toString()}`,
        servicio: servicioSeleccionado,
        local: selectedLocal,
        barbero: selectedBarbero,
        fecha: selectedFecha,
        hora: selectedHora,
        pagoTotal,
      }));
      window.location.href = preference.initPoint || preference.sandboxInitPoint || '';
    } catch (err: any) {
      setError(err.response?.data?.message || 'No pudimos iniciar el pago. Intenta nuevamente.');
    } finally {
      setSubmitAction(null);
    }
  };

  const handleBookWithoutPayment = async () => {
    if (!servicioSeleccionado || !selectedLocal || !selectedBarbero || !selectedFecha || !selectedHora) {
      setError('Completa todos los pasos antes de reservar.');
      return;
    }

    setSubmitAction('no-pay');
    setError('');
    try {
      await citaService.create({
        clienteId: user?.id || 0,
        localId: selectedLocal.id,
        barberoId: selectedBarbero.barbero_id,
        servicioId: servicioSeleccionado.id,
        fecha: selectedFecha,
        horaInicio: selectedHora,
        estadoId: 1,
        notas: 'Reserva creada sin pago desde el sitio web',
        montoPagado: 0,
      });
      navigate('/mis-citas', {
        state: { message: 'Tu cita fue reservada sin pago.' },
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'No pudimos reservar la cita. Intenta nuevamente.');
    } finally {
      setSubmitAction(null);
    }
  };

  const renderCalendar = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < startOffset; i += 1) {
      days.push(<div key={`empty-${i}`} style={emptyDayStyle} />);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(currentYear, currentMonth, day);
      const dateKey = toDateKey(date);
      const selected = dateKey === selectedFecha;
      const disabled = isDateDisabled(date);

      days.push(
        <button
          key={dateKey}
          type="button"
          style={{
            ...dayStyle,
            ...(selected ? selectedDayStyle : {}),
            ...(disabled ? disabledDayStyle : {}),
          }}
          disabled={disabled}
          onClick={() => handleDateSelect(date)}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const closeBooking = () => {
    if (modal) {
      navigate(-1);
      return;
    }
    navigate('/servicios');
  };

  const pageContainerStyle = modal ? modalContainerStyle : containerStyle;
  const pageContentStyle = modal ? modalContentStyle : contentStyle;

  if (!servicioSeleccionado) {
    return (
      <div style={pageContainerStyle}>
        <div style={pageContentStyle}>
          <div style={emptyStateStyle}>
            <FontAwesomeIcon icon={faInfoCircle} style={{ fontSize: 42, color: colors.doradoClasico }} />
            <h2>Servicio no encontrado</h2>
            <button type="button" onClick={closeBooking} style={buttonStyle}>
              Ver servicios
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageContainerStyle}>
      <div style={pageContentStyle}>
        <section style={cardStyle}>
          <div style={modalTopStyle}>
            <button type="button" style={backLinkStyle} onClick={closeBooking}>
              <FontAwesomeIcon icon={faArrowLeft} />
              Regresar
            </button>
            <button type="button" style={closeButtonStyle} onClick={closeBooking} aria-label="Cerrar">
              ×
            </button>
          </div>

          <div style={headerStyle}>
            <div>
              <h1 style={titleStyle}>Agenda tu cita</h1>
              <p style={subtitleStyle}>Selecciona los datos de tu reserva. Puedes reservar sin pagar o pagar el total ahora.</p>
            </div>
            <div style={pricePillStyle}>
              <span>Total</span>
              <strong>${servicioSeleccionado.precio.toFixed(2)}</strong>
            </div>
          </div>

          <div style={serviceSummaryStyle}>
            <FontAwesomeIcon icon={faScissors} style={{ color: colors.doradoClasico }} />
            <div style={{ display: 'grid', gap: 4 }}>
              <strong>{servicioSeleccionado.nombre}</strong>
              <span>{servicioSeleccionado.duracion} min · Pago completo {`$${pagoTotal.toFixed(2)}`}</span>
            </div>
          </div>

          <div style={stepsStyle}>
            {[
              'Sucursal',
              'Barbero',
              'Horario',
              'Confirmar',
            ].map((label, index) => {
              const number = index + 1;
              return (
                <div key={label} style={stepItemStyle}>
                  <div style={stepBubbleStyle(step === number, step > number)}>
                    {step > number ? <FontAwesomeIcon icon={faCheckCircle} /> : number}
                  </div>
                  <span style={{ color: step >= number ? '#111111' : '#6B7280', fontWeight: step >= number ? 800 : 600 }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          {step === 1 && (
            <div>
              <h2 style={sectionTitleStyle}>Selecciona una sucursal</h2>
              {loading ? <Loader /> : (
                <div style={optionGridStyle}>
                  {locales.map((local) => (
                    <button
                      key={local.id}
                      type="button"
                      style={optionCardStyle(selectedLocal?.id === local.id)}
                      onClick={() => handleLocalSelect(local)}
                    >
                      <FontAwesomeIcon icon={faMapMarkerAlt} style={optionIconStyle} />
                      <strong>{local.nombre}</strong>
                      <span>{local.direccion}</span>
                      {local.hora_apertura && local.hora_cierre && (
                        <small>{local.hora_apertura.slice(0, 5)} - {local.hora_cierre.slice(0, 5)}</small>
                      )}
                    </button>
                  ))}
                </div>
              )}
              <FooterActions
                nextDisabled={!selectedLocal}
                onNext={() => goToStep(2)}
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={sectionTitleStyle}>Elige tu barbero</h2>
              {loading ? <Loader /> : (
                <div style={optionGridStyle}>
                  {barberos.map((barbero) => (
                    <button
                      key={barbero.barbero_id}
                      type="button"
                      style={barberoCardStyle(selectedBarbero?.barbero_id === barbero.barbero_id)}
                      onClick={() => handleBarberoSelect(barbero)}
                    >
                      <div style={avatarStyle}>
                        {barbero.foto ? (
                          <img src={barbero.foto} alt={barbero.nombre} style={avatarImageStyle} />
                        ) : (
                          barbero.nombre.charAt(0)
                        )}
                      </div>
                      <strong>{barbero.nombre}</strong>
                    </button>
                  ))}
                </div>
              )}
              <FooterActions
                back
                nextDisabled={!selectedBarbero}
                onBack={() => goToStep(1)}
                onNext={() => goToStep(3)}
              />
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={sectionTitleStyle}>Selecciona fecha y horario</h2>
              <div style={scheduleGridStyle}>
                <div style={calendarStyle}>
                  <div style={calendarHeaderStyle}>
                    <button
                      type="button"
                      style={iconButtonStyle}
                      onClick={() => {
                        if (currentMonth === 0) {
                          setCurrentMonth(11);
                          setCurrentYear(currentYear - 1);
                        } else {
                          setCurrentMonth(currentMonth - 1);
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <strong>{meses[currentMonth]} {currentYear}</strong>
                    <button
                      type="button"
                      style={iconButtonStyle}
                      onClick={() => {
                        if (currentMonth === 11) {
                          setCurrentMonth(0);
                          setCurrentYear(currentYear + 1);
                        } else {
                          setCurrentMonth(currentMonth + 1);
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                  <div style={weekdaysStyle}>
                    {diasSemana.map((dia, index) => <span key={`${dia}-${index}`}>{dia}</span>)}
                  </div>
                  <div style={daysGridStyle}>{renderCalendar()}</div>
                </div>

                <div>
                  <h3 style={timeTitleStyle}>
                    <FontAwesomeIcon icon={faCalendarAlt} /> Horarios disponibles
                  </h3>
                  {!selectedFecha ? (
                    <p style={mutedTextStyle}>Selecciona una fecha para ver horarios.</p>
                  ) : loading ? (
                    <Loader />
                  ) : horarios.length === 0 ? (
                    <p style={mutedTextStyle}>No hay horarios disponibles para este día.</p>
                  ) : (
                    <div style={timeGridStyle}>
                      {horarios.map((horario) => {
                        const isDisabled = horario.disponible === false || horario.ocupado === true;
                        return (
                          <button
                            key={horario.hora}
                            type="button"
                            disabled={isDisabled}
                            aria-label={`${horario.hora.slice(0, 5)} ${isDisabled ? 'ocupado' : 'disponible'}`}
                            title={isDisabled ? 'Horario reservado' : 'Horario disponible'}
                            style={timeSlotStyle(selectedHora === horario.hora, isDisabled)}
                            onClick={() => {
                              if (!isDisabled) setSelectedHora(horario.hora);
                            }}
                          >
                            <span>{horario.hora.slice(0, 5)}</span>
                            {isDisabled && <small style={timeSlotLabelStyle}>Ocupado</small>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <FooterActions
                back
                nextDisabled={!selectedFecha || !selectedHora}
                onBack={() => goToStep(2)}
                onNext={() => goToStep(4)}
              />
            </div>
          )}

          {step === 4 && selectedLocal && selectedBarbero && (
            <div>
              <h2 style={sectionTitleStyle}>Confirma tu cita</h2>
              <div style={summaryGridStyle}>
                <SummaryItem icon={faMapMarkerAlt} label="Sucursal" value={selectedLocal.nombre} detail={selectedLocal.direccion} />
                <SummaryItem icon={faUserTie} label="Barbero" value={selectedBarbero.nombre} detail={selectedBarbero.especialidad} />
                <SummaryItem icon={faCalendarAlt} label="Fecha y hora" value={selectedFecha} detail={`${selectedHora.slice(0, 5)} hrs`} />
                <SummaryItem icon={faDollarSign} label="Pago" value={`$${pagoTotal.toFixed(2)}`} detail="Total del servicio" />
              </div>

              <div style={paymentNoticeStyle}>
                <FontAwesomeIcon icon={faCreditCard} />
                <span>Puedes reservar sin pagar ahora o confirmar tu horario pagando el total con Mercado Pago.</span>
              </div>

              <div style={footerActionsStyle}>
                <button type="button" style={secondaryButtonStyle} onClick={() => goToStep(3)} disabled={submitting}>
                  <FontAwesomeIcon icon={faArrowLeft} /> Atrás
                </button>
                <div style={confirmButtonsStyle}>
                  <button type="button" style={secondaryButtonStyle} disabled={submitting} onClick={handleBookWithoutPayment}>
                    {submitAction === 'no-pay' ? 'Reservando...' : 'Reservar sin pagar'}
                    <FontAwesomeIcon icon={submitAction === 'no-pay' ? faSpinner : faCheckCircle} spin={submitAction === 'no-pay'} />
                  </button>
                  <button type="button" style={buttonStyle} disabled={submitting} onClick={handlePayment}>
                    {submitAction === 'deposit' ? 'Redirigiendo...' : 'Pagar ahora'}
                    <FontAwesomeIcon icon={submitAction === 'deposit' ? faSpinner : faCreditCard} spin={submitAction === 'deposit'} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const Loader = () => (
  <div style={{ textAlign: 'center', padding: 36 }}>
    <FontAwesomeIcon icon={faSpinner} spin style={{ color: colors.doradoClasico, fontSize: 28 }} />
  </div>
);

interface FooterActionsProps {
  back?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
  nextIcon?: any;
  onBack?: () => void;
  onNext: () => void;
}

const FooterActions: React.FC<FooterActionsProps> = ({
  back,
  nextDisabled,
  nextLabel = 'Continuar',
  nextIcon = faArrowRight,
  onBack,
  onNext,
}) => (
  <div style={footerActionsStyle}>
    {back ? (
      <button type="button" style={secondaryButtonStyle} onClick={onBack}>
        <FontAwesomeIcon icon={faArrowLeft} /> Atrás
      </button>
    ) : <span />}
    <button type="button" style={buttonStyle} disabled={nextDisabled} onClick={onNext}>
      {nextLabel} <FontAwesomeIcon icon={nextIcon} spin={nextIcon === faSpinner} />
    </button>
  </div>
);

const SummaryItem = ({ icon, label, value, detail }: { icon: any; label: string; value: string; detail?: string }) => (
  <div style={summaryItemStyle}>
    <span style={summaryIconStyle}><FontAwesomeIcon icon={icon} /></span>
    <small>{label}</small>
    <strong>{value}</strong>
    {detail && <span>{detail}</span>}
  </div>
);

const containerStyle: React.CSSProperties = {
  minHeight: 'calc(100vh - 96px)',
  backgroundColor: 'rgba(0, 0, 0, 0.62)',
  padding: '34px 24px',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
};

const modalContainerStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.62)',
  padding: '28px 24px',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  zIndex: 2000,
  overflowY: 'auto',
};

const contentStyle: React.CSSProperties = {
  width: 'min(960px, 100%)',
  margin: '0 auto',
};

const modalContentStyle: React.CSSProperties = {
  width: 'min(960px, 100%)',
  margin: '0 auto',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  borderRadius: 0,
  boxShadow: '0 24px 70px rgba(0,0,0,0.35)',
  maxHeight: 'calc(100vh - 148px)',
  overflowY: 'auto',
};

const modalTopStyle: React.CSSProperties = {
  height: 72,
  borderBottom: '1px solid #E5E7EB',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  backgroundColor: '#FFFFFF',
  position: 'sticky',
  top: 0,
  zIndex: 4,
};

const backLinkStyle: React.CSSProperties = {
  border: 'none',
  backgroundColor: 'transparent',
  color: '#555555',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 10,
  fontSize: 16,
  cursor: 'pointer',
};

const closeButtonStyle: React.CSSProperties = {
  border: 'none',
  backgroundColor: 'transparent',
  color: '#444444',
  fontSize: 44,
  lineHeight: 1,
  cursor: 'pointer',
  padding: '0 4px',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 16,
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  padding: '28px 32px 16px',
};

const titleStyle: React.CSSProperties = {
  color: '#111111',
  margin: 0,
  fontSize: 34,
};

const subtitleStyle: React.CSSProperties = {
  color: '#5C6670',
  marginTop: 8,
};

const pricePillStyle: React.CSSProperties = {
  border: '1px solid rgba(184, 134, 11, 0.26)',
  borderRadius: 0,
  padding: '10px 14px',
  color: colors.doradoClasico,
  display: 'grid',
  gap: 2,
  minWidth: 120,
};

const serviceSummaryStyle: React.CSSProperties = {
  margin: '8px 32px 0',
  padding: 16,
  borderRadius: 0,
  backgroundColor: '#FAF4E8',
  border: '1px solid rgba(184, 134, 11, 0.22)',
  display: 'flex',
  gap: 12,
  alignItems: 'center',
  color: '#111111',
};

const stepsStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 0,
  margin: '24px 0 28px',
  borderTop: '1px solid #E5E7EB',
  borderBottom: '1px solid #E5E7EB',
};

const stepItemStyle: React.CSSProperties = {
  display: 'grid',
  justifyItems: 'center',
  gap: 8,
  fontSize: 13,
  padding: '18px 8px',
  borderRight: '1px solid #E5E7EB',
};

const stepBubbleStyle = (active: boolean, completed: boolean): React.CSSProperties => ({
  width: 36,
  height: 36,
  borderRadius: 0,
  display: 'grid',
  placeItems: 'center',
  backgroundColor: active ? '#FFE08A' : completed ? '#F3F4F6' : '#FFFFFF',
  border: `1px solid ${active ? '#FFC629' : '#D7DCE1'}`,
  color: active || completed ? '#111111' : '#7A8491',
  fontWeight: 700,
});

const sectionTitleStyle: React.CSSProperties = {
  color: '#111111',
  fontSize: 24,
  margin: '0 32px 18px',
};

const optionGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 14,
  padding: '0 32px',
};

const optionCardStyle = (selected: boolean): React.CSSProperties => ({
  minHeight: 150,
  border: `1.5px solid ${selected ? '#FFC629' : '#E2E8F0'}`,
  backgroundColor: selected ? '#FAF4E8' : '#FFFFFF',
  color: '#17202A',
  borderRadius: 0,
  padding: 18,
  display: 'grid',
  gap: 8,
  textAlign: 'left',
  cursor: 'pointer',
});

const barberoCardStyle = (selected: boolean): React.CSSProperties => ({
  ...optionCardStyle(selected),
  minHeight: 120,
  alignContent: 'center',
});

const optionIconStyle: React.CSSProperties = {
  color: colors.doradoClasico,
  fontSize: 22,
};

const avatarStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: '50%',
  backgroundColor: colors.doradoClasico,
  color: '#111111',
  display: 'grid',
  placeItems: 'center',
  fontWeight: 800,
};

const avatarImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  objectFit: 'cover',
};

const scheduleGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 24,
  padding: '0 32px',
};

const calendarStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: 0,
  padding: 16,
};

const calendarHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: '#111111',
  marginBottom: 14,
};

const iconButtonStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  border: '1px solid #E2E8F0',
  background: '#FFFFFF',
  color: '#111111',
  borderRadius: 0,
  cursor: 'pointer',
};

const weekdaysStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  color: '#8A99A8',
  fontSize: 12,
  textAlign: 'center',
  marginBottom: 8,
};

const daysGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 4,
};

const emptyDayStyle: React.CSSProperties = {
  minHeight: 36,
};

const dayStyle: React.CSSProperties = {
  minHeight: 36,
  border: 'none',
  borderRadius: 8,
  backgroundColor: 'transparent',
  color: '#17202A',
  cursor: 'pointer',
};

const selectedDayStyle: React.CSSProperties = {
  backgroundColor: '#FFC629',
  color: '#111111',
  fontWeight: 800,
};

const disabledDayStyle: React.CSSProperties = {
  color: '#B5BDC7',
  cursor: 'not-allowed',
};

const timeTitleStyle: React.CSSProperties = {
  color: '#111111',
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  marginTop: 0,
};

const timeGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
  gap: 10,
};

const timeSlotStyle = (selected: boolean, disabled = false): React.CSSProperties => ({
  border: `1px solid ${disabled ? '#D7DCE1' : selected ? '#FFC629' : '#E2E8F0'}`,
  backgroundColor: disabled ? '#F1F3F5' : selected ? '#FFC629' : '#F8FAFC',
  color: disabled ? '#9AA3AE' : '#111111',
  borderRadius: 0,
  padding: '10px 10px',
  fontWeight: 700,
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.72 : 1,
  display: 'grid',
  gap: 2,
  placeItems: 'center',
});

const timeSlotLabelStyle: React.CSSProperties = {
  color: '#8A94A2',
  fontSize: 10,
  fontWeight: 600,
};

const summaryGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
  gap: 12,
  padding: '0 32px',
};

const summaryItemStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: 0,
  padding: 16,
  display: 'grid',
  gap: 6,
  color: '#17202A',
};

const summaryIconStyle: React.CSSProperties = {
  color: colors.doradoClasico,
};

const paymentNoticeStyle: React.CSSProperties = {
  marginTop: 18,
  marginLeft: 32,
  marginRight: 32,
  padding: 14,
  borderRadius: 0,
  backgroundColor: '#F0FDF4',
  border: '1px solid #BBF7D0',
  color: '#14532D',
  display: 'flex',
  gap: 10,
  alignItems: 'center',
};

const footerActionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  margin: '24px 32px 32px',
  flexWrap: 'wrap',
};

const confirmButtonsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 12,
  flexWrap: 'wrap',
};

const buttonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 0,
  padding: '13px 22px',
  backgroundColor: '#FFC629',
  color: '#111111',
  fontWeight: 800,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: 'transparent',
  color: '#111111',
  border: '1px solid #D7DCE1',
};

const errorStyle: React.CSSProperties = {
  backgroundColor: '#FEF2F2',
  border: '1px solid #FCA5A5',
  color: '#B91C1C',
  borderRadius: 0,
  padding: 12,
  margin: '0 32px 18px',
};

const mutedTextStyle: React.CSSProperties = {
  color: '#6B7280',
};

const emptyStateStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: 0,
  padding: 48,
  color: '#111111',
  textAlign: 'center',
};
