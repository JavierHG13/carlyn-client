import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarCheck,
    faCalendarDay,
    faCheckCircle,
    faClock,
    faTimesCircle,
    faSpinner,
    faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import { misCitasService } from '../../services/misCitasService';
import { paymentService } from '../../services/paymentService';
import type { CitaCliente } from '../../types/misCitas';
import { CitaCard } from '../../components/cliente/CitaCard';
import { CitaDetailModal } from '../../components/cliente/CitaDetailModal';
import { CancelarCitaModal } from '../../components/cliente/CancelarCitaModal';
import { ReagendarCitaModal } from '../../components/cliente/ReagendarCitaModal';
import { colors } from '../../styles/colors';

const parseDateKey = (fecha: string) => {
    const [year, month, day] = String(fecha).slice(0, 10).split('-').map(Number);
    return new Date(year, (month || 1) - 1, day || 1);
};

export const MisCitas: React.FC = () => {
    const navigate = useNavigate();
    const [citas, setCitas] = useState<CitaCliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('todas');
    const [selectedCita, setSelectedCita] = useState<CitaCliente | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [rescheduleLoading, setRescheduleLoading] = useState(false);
    const [payingCitaId, setPayingCitaId] = useState<number | null>(null);

    useEffect(() => {
        loadCitas();
    }, []);

    const loadCitas = async () => {
        try {
            setLoading(true);
            const data = await misCitasService.getAll();
            const ordered = [...data].sort((a, b) => {
                const dateA = new Date(`${String(a.fecha).slice(0, 10)}T${a.hora_inicio}`).getTime();
                const dateB = new Date(`${String(b.fecha).slice(0, 10)}T${b.hora_inicio}`).getTime();
                return dateB - dateA;
            });
            setCitas(ordered);
        } catch (error) {
            console.error('Error loading citas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = async (citaId: number, motivo: string) => {
        setCancelLoading(true);
        try {
            await misCitasService.cancelar(citaId, motivo);
            await loadCitas();
            setCancelModalOpen(false);
            setSelectedCita(null);
        } catch (error) {
            console.error('Error canceling cita:', error);
            alert('Error al cancelar la cita');
        } finally {
            setCancelLoading(false);
        }
    };

    const handleReagendar = async (fecha: string, horaInicio: string) => {
        if (!selectedCita) return;
        setRescheduleLoading(true);
        try {
            await misCitasService.reagendar(selectedCita.id, { fecha, horaInicio });
            await loadCitas();
            setRescheduleModalOpen(false);
            setSelectedCita(null);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al reagendar la cita');
        } finally {
            setRescheduleLoading(false);
        }
    };

    const handlePagarCita = async (cita: CitaCliente) => {
        setPayingCitaId(cita.id);
        try {
            const preference = await paymentService.createExistingAppointmentPreference(cita.id);
            const checkoutUrl = preference.initPoint || preference.sandboxInitPoint;
            if (!checkoutUrl) throw new Error('Mercado Pago no devolvió una URL de pago');
            window.location.href = checkoutUrl;
        } catch (error: any) {
            alert(error.response?.data?.message || error.message || 'No pudimos iniciar el pago de la cita.');
        } finally {
            setPayingCitaId(null);
        }
    };

    const filtrarCitas = (): CitaCliente[] => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        switch (filter) {
            case 'pendientes':
                return citas.filter(c => c.estado_nombre === 'Pendiente' || c.estado_nombre === 'Confirmada');
            case 'completadas':
                return citas.filter(c => c.estado_nombre === 'Completada');
            case 'canceladas':
                return citas.filter(c => c.estado_nombre === 'Cancelada');
            case 'proximas':
                return citas.filter(c => {
                    const fechaCita = parseDateKey(c.fecha);
                    return fechaCita >= hoy && (c.estado_nombre === 'Pendiente' || c.estado_nombre === 'Confirmada');
                });
            default:
                return citas;
        }
    };

    const citasFiltradas = filtrarCitas();

    const pageStyle: React.CSSProperties = {
        minHeight: '100vh',
        backgroundColor: colors.blancoHueso,
        padding: '38px 20px 54px',
    };

    const containerStyle: React.CSSProperties = {
        maxWidth: '1040px',
        margin: '0 auto',
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: '18px',
        marginBottom: '22px',
        flexWrap: 'wrap',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '34px',
        fontWeight: 700,
        color: colors.negroSuave,
        margin: '0 0 6px',
        fontFamily: 'Playfair Display, serif',
    };

    const filtersStyle: React.CSSProperties = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        padding: '12px',
        marginBottom: '18px',
        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
    };

    const filterButtonStyle = (isActive: boolean): React.CSSProperties => ({
        padding: '9px 14px',
        borderRadius: 8,
        border: `1px solid ${isActive ? colors.doradoClasico : '#E2E8F0'}`,
        backgroundColor: isActive ? colors.doradoClasico : 'white',
        color: isActive ? 'white' : '#475569',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 600,
        transition: 'all 0.2s',
    });

    const emptyStateStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '52px',
        backgroundColor: 'white',
        borderRadius: 8,
        border: '1px solid #E5E7EB',
        color: '#718096',
    };

    const primaryButtonStyle: React.CSSProperties = {
        border: 'none',
        borderRadius: 8,
        backgroundColor: colors.doradoClasico,
        color: 'white',
        padding: '12px 16px',
        fontWeight: 700,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    if (loading) {
        return (
            <div style={pageStyle}>
                <div style={containerStyle}>
                <div style={{ textAlign: 'center', padding: '80px' }}>
                    <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '48px', color: colors.doradoClasico }} />
                    <p style={{ marginTop: '20px', color: colors.azulAcero }}>Cargando tus citas...</p>
                </div>
                </div>
            </div>
        );
    }

    return (
        <main style={pageStyle}>
        <div style={containerStyle}>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                style={headerStyle}
            >
                <div>
                    <h1 style={titleStyle}>Mis citas</h1>
                    <p style={{ color: '#718096', margin: 0 }}>
                        Revisa tus reservas, consulta detalles y administra cambios cuando estén disponibles.
                    </p>
                </div>
            </motion.div>

            {/* Filtros */}
            <div style={filtersStyle}>
                <div style={{ color: colors.azulAcero, fontSize: 14, fontWeight: 700, padding: '0 4px' }}>
                    Historial
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <button style={filterButtonStyle(filter === 'todas')} onClick={() => setFilter('todas')}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '6px' }} />
                    Todas
                </button>
                <button style={filterButtonStyle(filter === 'proximas')} onClick={() => setFilter('proximas')}>
                    <FontAwesomeIcon icon={faCalendarDay} style={{ marginRight: '6px' }} />
                    Próximas
                </button>
                <button style={filterButtonStyle(filter === 'pendientes')} onClick={() => setFilter('pendientes')}>
                    <FontAwesomeIcon icon={faClock} style={{ marginRight: '6px' }} />
                    Activas
                </button>
                <button style={filterButtonStyle(filter === 'completadas')} onClick={() => setFilter('completadas')}>
                    <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '6px' }} />
                    Completadas
                </button>
                <button style={filterButtonStyle(filter === 'canceladas')} onClick={() => setFilter('canceladas')}>
                    <FontAwesomeIcon icon={faTimesCircle} style={{ marginRight: '6px' }} />
                    Canceladas
                </button>
                </div>
            </div>

            {/* Lista de citas */}
            {citasFiltradas.length === 0 ? (
                <motion.div
                    style={emptyStateStyle}
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <FontAwesomeIcon icon={faCalendarCheck} style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                    <h3>No tienes citas {filter !== 'todas' ? 'en esta categoría' : 'agendadas'}</h3>
                    <p>Agenda tu primera cita y disfruta de nuestros servicios</p>
                    <button
                        onClick={() => navigate('/servicios')}
                        style={{
                            marginTop: '20px',
                            ...primaryButtonStyle,
                        }}
                    >
                        Ver servicios
                    </button>
                </motion.div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {citasFiltradas.map((cita) => (
                        <CitaCard
                            key={cita.id}
                            cita={cita}
                            onCancelar={(id) => {
                                const citaToCancel = citas.find(c => c.id === id);
                                if (citaToCancel) {
                                    setSelectedCita(citaToCancel);
                                    setCancelModalOpen(true);
                                }
                            }}
                            onVerDetalle={(cita) => {
                                setSelectedCita(cita);
                                setDetailModalOpen(true);
                            }}
                            onReagendar={(cita) => {
                                setSelectedCita(cita);
                                setRescheduleModalOpen(true);
                            }}
                            onPagarAnticipo={handlePagarCita}
                            paying={payingCitaId === cita.id}
                        />
                    ))}
                </div>
            )}

            {/* Modales */}
            <CitaDetailModal
                isOpen={detailModalOpen}
                onClose={() => {
                    setDetailModalOpen(false);
                    setSelectedCita(null);
                }}
                cita={selectedCita}
            />

            <CancelarCitaModal
                isOpen={cancelModalOpen}
                onClose={() => {
                    setCancelModalOpen(false);
                    setSelectedCita(null);
                }}
                onConfirm={(motivo) => handleCancelar(selectedCita!.id, motivo)}
                citaInfo={selectedCita ? {
                    id: selectedCita.id,
                    servicio: selectedCita.servicio_nombre,
                    fecha: new Date(selectedCita.fecha).toLocaleDateString(),
                    hora: selectedCita.hora_inicio.slice(0, 5),
                } : undefined}
                loading={cancelLoading}
            />

            <ReagendarCitaModal
                isOpen={rescheduleModalOpen}
                onClose={() => {
                    setRescheduleModalOpen(false);
                    setSelectedCita(null);
                }}
                onConfirm={handleReagendar}
                cita={selectedCita}
                loading={rescheduleLoading}
            />
        </div>
        </main>
    );
};
