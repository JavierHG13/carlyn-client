import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '../../../services/axios';
import {
    faScissors,
    faUserTie,
    faCalendarAlt,
    faClock,
    faArrowRight,
    faArrowLeft,
    faCheckCircle,
    faSpinner,
    faDollarSign,
    faInfoCircle,
    faChevronLeft,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../../styles/colors';

interface Servicio {
    id: number;
    nombre: string;
    descripcion: string | null;
    duracion: number;
    precio: number;
}

interface Barbero {
    barbero_id: number;
    nombre: string;
    especialidad: string;
    calificacion: number;
    foto: string | null;
}

interface HorarioDisponible {
    hora: string;
}

export const AgendarCita: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, isAuthenticated } = useAuth();

    // Obtener servicio desde URL
    const servicioId = searchParams.get('servicioId');
    const servicioNombre = searchParams.get('servicioNombre');
    const servicioPrecio = searchParams.get('precio');
    const servicioDuracion = searchParams.get('duracion');

    const [step, setStep] = useState(1);
    const [barberos, setBarberos] = useState<Barbero[]>([]);
    const [horarios, setHorarios] = useState<HorarioDisponible[]>([]);

    const [selectedBarbero, setSelectedBarbero] = useState<Barbero | null>(null);
    const [selectedFecha, setSelectedFecha] = useState('');
    const [selectedHora, setSelectedHora] = useState('');

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Estado para el calendario - CORREGIDO
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [disabledDates, setDisabledDates] = useState<string[]>([]);

    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const diasSemana = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

    const servicioSeleccionado: Servicio | null = servicioId ? {
        id: parseInt(servicioId),
        nombre: servicioNombre || '',
        descripcion: null,
        duracion: parseInt(servicioDuracion || '30'),
        precio: parseFloat(servicioPrecio || '0'),
    } : null;

    // Verificar autenticación
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { redirectTo: `/agendar-cita?servicioId=${servicioId}` } });
        }
    }, [isAuthenticated, navigate, servicioId]);

    // Cargar barberos
    useEffect(() => {
        const fetchBarberos = async () => {
            setLoading(true);
            try {
                const response = await api.get('/barbero');
                setBarberos(response.data.data || []);
            } catch (err) {
                console.error('Error cargando barberos:', err);
                setError('Error al cargar los barberos');
            } finally {
                setLoading(false);
            }
        };
        fetchBarberos();
    }, []);

    // Cargar fechas deshabilitadas cuando se selecciona un barbero
    useEffect(() => {
        if (selectedBarbero && step === 2) {
            const fetchDisabledDates = async () => {
                try {
                    const response = await api.get(
                        `/citas/fechas-disponibles?barberoId=${selectedBarbero.barbero_id}`
                    );
                    setDisabledDates(response.data.fechasNoDisponibles || []);
                } catch (err) {
                    console.error('Error cargando fechas:', err);
                }
            };
            fetchDisabledDates();
        }
    }, [selectedBarbero, step]);

    // Cargar horarios al seleccionar barbero y fecha
    useEffect(() => {
        if (selectedBarbero && selectedFecha && step === 2) {
            const fetchHorarios = async () => {
                setLoading(true);
                try {
                    const response = await api.get(
                        `/citas/horarios-disponibles?barberoId=${selectedBarbero.barbero_id}&fecha=${selectedFecha}`
                    );
                    setHorarios(response.data.disponibles || []);
                    setSelectedHora('');
                } catch (err) {
                    console.error('Error cargando horarios:', err);
                    setError('Error al cargar los horarios');
                } finally {
                    setLoading(false);
                }
            };
            fetchHorarios();
        }
    }, [selectedBarbero, selectedFecha, step]);

    // Funciones del calendario
    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
    };

    const isDateDisabled = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        if (date < hoy) return true;
        if (disabledDates.includes(dateStr)) return true;
        
        return false;
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleDateSelect = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        if (!isDateDisabled(date)) {
            setSelectedFecha(dateStr);
        }
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const days = [];
        
        let startOffset = firstDay === 0 ? 6 : firstDay - 1;
        
        for (let i = 0; i < startOffset; i++) {
            days.push(<div key={`empty-${i}`} style={emptyDayStyle} />);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dateStr = date.toISOString().split('T')[0];
            const isSelected = dateStr === selectedFecha;
            const isDisabled = isDateDisabled(date);
            const isToday = new Date().toISOString().split('T')[0] === dateStr;
            
            days.push(
                <button
                    key={day}
                    style={{
                        ...dayStyle,
                        ...(isSelected && selectedDayStyle),
                        ...(isDisabled && disabledDayStyle),
                        ...(isToday && !isSelected && todayStyle),
                    }}
                    onClick={() => !isDisabled && handleDateSelect(date)}
                    disabled={isDisabled}
                >
                    {day}
                </button>
            );
        }
        
        return days;
    };

    const handleSubmit = async () => {
        if (!servicioSeleccionado || !selectedBarbero || !selectedFecha || !selectedHora) {
            setError('Completa todos los campos');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const response = await api.post('/citas', {
                clienteId: user?.id,
                barberoId: selectedBarbero.barbero_id,
                servicioId: servicioSeleccionado.id,
                fecha: selectedFecha,
                horaInicio: selectedHora,
                estadoId: 1,
            });

            if (response.status >= 200 && response.status < 300) {
                navigate('/mis-citas', {
                    state: { success: true, citaId: response.data.data.id }
                });
            } else {
                setError(response.data.message || 'Error al agendar la cita');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error de conexión. Intenta nuevamente.');
        } finally {
            setSubmitting(false);
        }
    };

    // Estilos
    const containerStyle: React.CSSProperties = {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px 20px',
        minHeight: '100vh',
        backgroundColor: colors.blancoHueso,
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 4px 30px rgba(0,0,0,0.08)',
    };

    const stepIndicatorStyle = (active: boolean, completed: boolean): React.CSSProperties => ({
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        backgroundColor: active ? colors.doradoClasico : completed ? '#10B981' : '#E2E8F0',
        color: (active || completed) ? 'white' : '#718096',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: '18px',
        margin: '0 auto',
    });

    const optionCardStyle = (isSelected: boolean): React.CSSProperties => ({
        padding: '20px',
        border: `2px solid ${isSelected ? colors.doradoClasico : '#E2E8F0'}`,
        borderRadius: '16px',
        cursor: 'pointer',
        backgroundColor: isSelected ? `${colors.doradoClasico}08` : 'white',
        transition: 'all 0.2s ease',
    });

    const buttonStyle: React.CSSProperties = {
        padding: '14px 28px',
        backgroundColor: colors.doradoClasico,
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'opacity 0.2s',
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    // Estilos del calendario
    const calendarContainerStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        padding: '16px',
        width: '100%',
    };

    const calendarHeaderStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '0 8px',
    };

    const monthTitleStyle: React.CSSProperties = {
        fontSize: '16px',
        fontWeight: 600,
        color: colors.negroSuave,
    };

    const navButtonStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '8px',
        color: colors.azulAcero,
    };

    const weekdaysStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        marginBottom: '8px',
    };

    const weekdayStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '8px',
        fontSize: '12px',
        fontWeight: 600,
        color: '#718096',
    };

    const daysGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px',
    };

    const emptyDayStyle: React.CSSProperties = {
        padding: '10px',
    };

    const dayStyle: React.CSSProperties = {
        padding: '10px',
        textAlign: 'center',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        border: 'none',
        background: 'transparent',
        transition: 'all 0.2s',
    };

    const selectedDayStyle: React.CSSProperties = {
        backgroundColor: colors.doradoClasico,
        color: 'white',
    };

    const disabledDayStyle: React.CSSProperties = {
        color: '#CBD5E0',
        cursor: 'not-allowed',
        backgroundColor: '#F8FAFC',
    };

    const todayStyle: React.CSSProperties = {
        border: `1px solid ${colors.doradoClasico}`,
        color: colors.doradoClasico,
    };

    if (!servicioSeleccionado) {
        return (
            <div style={containerStyle}>
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <FontAwesomeIcon icon={faInfoCircle} style={{ fontSize: '48px', color: '#EF4444' }} />
                    <h2 style={{ marginTop: '16px' }}>Servicio no encontrado</h2>
                    <button onClick={() => navigate('/servicios')} style={buttonStyle}>
                        Ver servicios
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <motion.div style={cardStyle} initial="hidden" animate="visible" variants={fadeInUp}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', fontFamily: 'Playfair Display, serif' }}>
                    Agendar Cita
                </h1>
                <p style={{ color: '#718096', marginBottom: '24px' }}>
                    Completa los siguientes pasos para reservar tu cita
                </p>

                {/* Resumen del servicio seleccionado */}
                <div style={{
                    backgroundColor: `${colors.doradoClasico}10`,
                    padding: '16px 20px',
                    borderRadius: '16px',
                    marginBottom: '32px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                }}>
                    <div>
                        <div style={{ fontSize: '12px', color: colors.doradoClasico, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Servicio seleccionado
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '18px' }}>{servicioSeleccionado.nombre}</div>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: colors.doradoClasico }}>
                        ${servicioSeleccionado.precio.toFixed(2)}
                    </div>
                </div>

                {/* Steps */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: '22px',
                        left: '20%',
                        right: '20%',
                        height: '2px',
                        backgroundColor: '#E2E8F0',
                        zIndex: 0,
                    }} />

                    {[
                        { step: 1, label: 'Barbero', icon: faUserTie },
                        { step: 2, label: 'Fecha/Hora', icon: faCalendarAlt },
                        { step: 3, label: 'Confirmar', icon: faCheckCircle },
                    ].map((s) => (
                        <div key={s.step} style={{ textAlign: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
                            <div style={stepIndicatorStyle(step === s.step, step > s.step)}>
                                {step > s.step ? <FontAwesomeIcon icon={faCheckCircle} /> : s.step}
                            </div>
                            <div style={{ fontSize: '12px', marginTop: '8px', color: step >= s.step ? colors.doradoClasico : '#718096' }}>
                                <FontAwesomeIcon icon={s.icon} style={{ marginRight: '4px' }} />
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>

                {error && (
                    <div style={{ backgroundColor: '#FEE2E2', color: '#EF4444', padding: '12px', borderRadius: '10px', marginBottom: '20px' }}>
                        {error}
                    </div>
                )}

                {/* Step 1: Seleccionar Barbero */}
                {step === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>Selecciona un barbero</h3>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '32px', color: colors.doradoClasico }} />
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                                {barberos.map((barbero) => (
                                    <div
                                        key={barbero.barbero_id}
                                        style={optionCardStyle(selectedBarbero?.barbero_id === barbero.barbero_id)}
                                        onClick={() => setSelectedBarbero(barbero)}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                backgroundColor: `${colors.doradoClasico}20`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '24px',
                                            }}>
                                                {barbero.foto ? (
                                                    <img src={barbero.foto} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                                ) : (
                                                    barbero.nombre.charAt(0)
                                                )}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ fontWeight: 600 }}>{barbero.nombre}</h4>
                                                <p style={{ fontSize: '13px', color: '#718096' }}>{barbero.especialidad}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            style={{ ...buttonStyle, width: '100%', justifyContent: 'center', marginTop: '24px' }}
                            onClick={() => setStep(2)}
                            disabled={!selectedBarbero}
                        >
                            Continuar <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </motion.div>
                )}

                {/* Step 2: Seleccionar Fecha y Hora */}
                {step === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>Selecciona fecha y hora</h3>

                        {/* Calendario visual */}
                        <div style={calendarContainerStyle}>
                            <div style={calendarHeaderStyle}>
                                <button onClick={handlePrevMonth} style={navButtonStyle}>
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                                <span style={monthTitleStyle}>
                                    {meses[currentMonth]} {currentYear}
                                </span>
                                <button onClick={handleNextMonth} style={navButtonStyle}>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            </div>
                            
                            <div style={weekdaysStyle}>
                                {diasSemana.map((dia, idx) => (
                                    <div key={idx} style={weekdayStyle}>{dia}</div>
                                ))}
                            </div>
                            
                            <div style={daysGridStyle}>
                                {renderCalendar()}
                            </div>
                        </div>

                        {/* Horarios disponibles - solo los que no están reservados */}
                        {selectedFecha && (
                            <div style={{ marginTop: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Horarios disponibles</label>
                                {loading ? (
                                    <div style={{ textAlign: 'center', padding: '40px' }}>
                                        <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '32px', color: colors.doradoClasico }} />
                                    </div>
                                ) : horarios.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: '#EF4444', padding: '20px', backgroundColor: '#FEF2F2', borderRadius: '12px' }}>
                                        No hay horarios disponibles para esta fecha
                                    </p>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                                        {horarios.map((h) => (
                                            <button
                                                key={h.hora}
                                                style={{
                                                    padding: '12px',
                                                    backgroundColor: selectedHora === h.hora ? colors.doradoClasico : '#F8FAFC',
                                                    color: selectedHora === h.hora ? 'white' : '#475569',
                                                    border: `1px solid ${selectedHora === h.hora ? colors.doradoClasico : '#E2E8F0'}`,
                                                    borderRadius: '10px',
                                                    cursor: 'pointer',
                                                    fontWeight: 500,
                                                    transition: 'all 0.2s',
                                                }}
                                                onClick={() => setSelectedHora(h.hora)}
                                            >
                                                {h.hora.slice(0, 5)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button style={{ ...buttonStyle, backgroundColor: '#E2E8F0', color: '#475569' }} onClick={() => setStep(1)}>
                                <FontAwesomeIcon icon={faArrowLeft} /> Atrás
                            </button>
                            <button
                                style={{ ...buttonStyle, flex: 1, justifyContent: 'center' }}
                                onClick={() => setStep(3)}
                                disabled={!selectedFecha || !selectedHora}
                            >
                                Continuar <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Confirmar */}
                {step === 3 && servicioSeleccionado && selectedBarbero && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>Confirmar cita</h3>

                        <div style={{ backgroundColor: '#F8FAFC', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <span style={{ color: '#718096' }}>Servicio:</span>
                                <strong>{servicioSeleccionado.nombre}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <span style={{ color: '#718096' }}>Barbero:</span>
                                <strong>{selectedBarbero.nombre}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <span style={{ color: '#718096' }}>Fecha:</span>
                                <strong>{new Date(selectedFecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <span style={{ color: '#718096' }}>Hora:</span>
                                <strong>{selectedHora.slice(0, 5)} hs</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #E2E8F0', marginTop: '8px' }}>
                                <span style={{ fontWeight: 600 }}>Total:</span>
                                <span style={{ fontSize: '24px', fontWeight: 700, color: colors.doradoClasico }}>
                                    ${servicioSeleccionado.precio.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button style={{ ...buttonStyle, backgroundColor: '#E2E8F0', color: '#475569' }} onClick={() => setStep(2)}>
                                <FontAwesomeIcon icon={faArrowLeft} /> Atrás
                            </button>
                            <button
                                style={{ ...buttonStyle, flex: 1, justifyContent: 'center' }}
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <><FontAwesomeIcon icon={faSpinner} spin /> Procesando...</>
                                ) : (
                                    <><FontAwesomeIcon icon={faCheckCircle} /> Confirmar Cita</>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};