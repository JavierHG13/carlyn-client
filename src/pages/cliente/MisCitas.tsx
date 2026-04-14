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
    faFilter,
} from '@fortawesome/free-solid-svg-icons';
import { misCitasService } from '../../services/misCitasService';
import  type { CitaCliente, ResumenCitas } from '../../types/misCitas';
import { CitaCard } from '../../components/cliente/CitaCard';
import { CitaDetailModal } from '../../components/cliente/CitaDetailModal';
import { CancelarCitaModal } from '../../components/cliente/CancelarCitaModal';
import { colors } from '../../styles/colors';

export const MisCitas: React.FC = () => {
    const navigate = useNavigate();
    const [citas, setCitas] = useState<CitaCliente[]>([]);
    const [resumen, setResumen] = useState<ResumenCitas | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('todas');
    const [selectedCita, setSelectedCita] = useState<CitaCliente | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);

    useEffect(() => {
        loadCitas();
    }, []);

    const loadCitas = async () => {
        try {
            setLoading(true);
            const data = await misCitasService.getAll();
            setCitas(data);
            const resumenData = await misCitasService.getResumen();
            setResumen(resumenData);
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
                    const fechaCita = new Date(c.fecha);
                    return fechaCita >= hoy && (c.estado_nombre === 'Pendiente' || c.estado_nombre === 'Confirmada');
                });
            default:
                return citas;
        }
    };

    const citasFiltradas = filtrarCitas();

    const containerStyle: React.CSSProperties = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        minHeight: '100vh',
        backgroundColor: colors.blancoHueso,
    };

    const headerStyle: React.CSSProperties = {
        textAlign: 'center',
        marginBottom: '40px',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '36px',
        fontWeight: 700,
        color: colors.negroSuave,
        marginBottom: '8px',
        fontFamily: 'Playfair Display, serif',
    };

    const statsGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
    };

    const statCardStyle = (color: string): React.CSSProperties => ({
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '20px',
        textAlign: 'center',
        border: `1px solid ${color}20`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    });

    const statValueStyle: React.CSSProperties = {
        fontSize: '32px',
        fontWeight: 700,
        marginBottom: '4px',
    };

    const filtersStyle: React.CSSProperties = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '32px',
        justifyContent: 'center',
    };

    const filterButtonStyle = (isActive: boolean): React.CSSProperties => ({
        padding: '10px 20px',
        borderRadius: '30px',
        border: `1px solid ${isActive ? colors.doradoClasico : '#E2E8F0'}`,
        backgroundColor: isActive ? colors.doradoClasico : 'white',
        color: isActive ? 'white' : '#475569',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'all 0.2s',
    });

    const emptyStateStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '60px',
        backgroundColor: 'white',
        borderRadius: '24px',
        color: '#718096',
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <div style={{ textAlign: 'center', padding: '80px' }}>
                    <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '48px', color: colors.doradoClasico }} />
                    <p style={{ marginTop: '20px', color: colors.azulAcero }}>Cargando tus citas...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                style={headerStyle}
            >
                <h1 style={titleStyle}>
                    Mis Citas
                </h1>
                <p style={{ color: '#718096' }}>
                    Gestiona y da seguimiento a tus citas agendadas
                </p>
            </motion.div>

            {/* Estadísticas */}
            {resumen && (
                <div style={statsGridStyle}>
                    <div style={statCardStyle('#3B82F6')}>
                        <div style={{ ...statValueStyle, color: '#3B82F6' }}>{resumen.total}</div>
                        <div style={{ fontSize: '13px', color: '#718096' }}>Total</div>
                    </div>
                    <div style={statCardStyle('#F59E0B')}>
                        <div style={{ ...statValueStyle, color: '#F59E0B' }}>{resumen.pendientes + resumen.confirmadas}</div>
                        <div style={{ fontSize: '13px', color: '#718096' }}>Activas</div>
                    </div>
                    <div style={statCardStyle('#10B981')}>
                        <div style={{ ...statValueStyle, color: '#10B981' }}>{resumen.completadas}</div>
                        <div style={{ fontSize: '13px', color: '#718096' }}>Completadas</div>
                    </div>
                    <div style={statCardStyle('#EF4444')}>
                        <div style={{ ...statValueStyle, color: '#EF4444' }}>{resumen.canceladas}</div>
                        <div style={{ fontSize: '13px', color: '#718096' }}>Canceladas</div>
                    </div>
                </div>
            )}

            {/* Filtros */}
            <div style={filtersStyle}>
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
                            padding: '12px 24px',
                            backgroundColor: colors.doradoClasico,
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: 500,
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
        </div>
    );
};