import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarAlt,
    faClock,
    faUserTie,
    faCut,
    faDollarSign,
    faMapMarkerAlt,
    faPhone,
    faCheckCircle,
    faTimesCircle,
    faClock as faClockIcon,
    faInfoCircle,
    faTrash,
    faEye,
    faChevronDown,
    faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import type { CitaCliente } from '../../types/misCitas';
import { colors } from '../../styles/colors';

interface CitaCardProps {
    cita: CitaCliente;
    onCancelar: (citaId: number) => void;
    onVerDetalle: (cita: CitaCliente) => void;
}

export const CitaCard: React.FC<CitaCardProps> = ({ cita, onCancelar, onVerDetalle }) => {
    const [expanded, setExpanded] = useState(false);

    const getEstadoConfig = (estado: string) => {
        const config: Record<string, { bg: string; color: string; icon: any; text: string }> = {
            'Pendiente': { bg: '#FEF3C7', color: '#F59E0B', icon: faClockIcon, text: 'Pendiente' },
            'Confirmada': { bg: '#DBEAFE', color: '#3B82F6', icon: faCheckCircle, text: 'Confirmada' },
            'Completada': { bg: '#D1FAE5', color: '#10B981', icon: faCheckCircle, text: 'Completada' },
            'Cancelada': { bg: '#FEE2E2', color: '#EF4444', icon: faTimesCircle, text: 'Cancelada' },
            'No_asistio': { bg: '#FEE2E2', color: '#EF4444', icon: faTimesCircle, text: 'No Asistió' },
        };
        return config[estado] || config['Pendiente'];
    };

    const formatFecha = (fecha: string) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const estadoConfig = getEstadoConfig(cita.estado_nombre);
    const puedeCancelar = cita.estado_nombre === 'Pendiente' || cita.estado_nombre === 'Confirmada';
    const esPasada = new Date(cita.fecha) < new Date();

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: `1px solid ${cita.estado_nombre === 'Cancelada' ? '#FEE2E2' : '#EDF2F7'}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
    };

    const headerStyle: React.CSSProperties = {
        padding: '20px',
        borderBottom: `1px solid ${estadoConfig.bg}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
    };

    const badgeStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '30px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: estadoConfig.bg,
        color: estadoConfig.color,
    };

    const contentStyle: React.CSSProperties = {
        padding: '20px',
    };

    const infoRowStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
        flexWrap: 'wrap',
    };

    const infoIconStyle: React.CSSProperties = {
        width: '32px',
        color: colors.doradoClasico,
        fontSize: '16px',
    };

    const buttonStyle = (bgColor: string, textColor: string = 'white'): React.CSSProperties => ({
        padding: '10px 20px',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: bgColor,
        color: textColor,
        transition: 'all 0.2s',
    });

    return (
        <motion.div
            style={cardStyle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }}
        >
            <div style={headerStyle}>
                <div>
                    <div style={{ fontSize: '14px', color: '#718096' }}>Cita #{cita.id}</div>
                    <div style={{ fontWeight: 600, fontSize: '16px', marginTop: '4px' }}>
                        {formatFecha(cita.fecha)} - {cita.hora_inicio.slice(0, 5)} hs
                    </div>
                </div>
                <div style={badgeStyle}>
                    <FontAwesomeIcon icon={estadoConfig.icon} />
                    {estadoConfig.text}
                </div>
            </div>

            <div style={contentStyle}>
                <div style={infoRowStyle}>
                    <FontAwesomeIcon icon={faCut} style={infoIconStyle} />
                    <div>
                        <div style={{ fontSize: '12px', color: '#718096' }}>Servicio</div>
                        <div style={{ fontWeight: 500 }}>{cita.servicio_nombre}</div>
                    </div>
                </div>

                <div style={infoRowStyle}>
                    <FontAwesomeIcon icon={faUserTie} style={infoIconStyle} />
                    <div>
                        <div style={{ fontSize: '12px', color: '#718096' }}>Barbero</div>
                        <div style={{ fontWeight: 500 }}>{cita.barbero_nombre}</div>
                        <div style={{ fontSize: '12px', color: '#718096' }}>{cita.barbero_especialidad}</div>
                    </div>
                </div>

                <div style={infoRowStyle}>
                    <FontAwesomeIcon icon={faDollarSign} style={infoIconStyle} />
                    <div>
                        <div style={{ fontSize: '12px', color: '#718096' }}>Precio</div>
                        <div style={{ fontWeight: 600, color: colors.doradoClasico }}>
                            ${cita.servicio_precio}
                        </div>
                    </div>
                </div>

                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #EDF2F7' }}
                    >
                        {cita.notas && (
                            <div style={{ marginBottom: '12px' }}>
                                <div style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>Notas adicionales</div>
                                <div style={{ fontSize: '14px' }}>{cita.notas}</div>
                            </div>
                        )}
                        {cita.motivo_cancelacion && (
                            <div style={{ marginBottom: '12px' }}>
                                <div style={{ fontSize: '12px', color: '#EF4444', marginBottom: '4px' }}>Motivo de cancelación</div>
                                <div style={{ fontSize: '14px', color: '#EF4444' }}>{cita.motivo_cancelacion}</div>
                            </div>
                        )}
                        <div style={{ fontSize: '12px', color: '#718096', marginTop: '8px' }}>
                            Agendada el {new Date(cita.created_at).toLocaleDateString()}
                        </div>
                    </motion.div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <button
                        style={buttonStyle('#F1F5F9', '#475569')}
                        onClick={() => setExpanded(!expanded)}
                    >
                        <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} />
                        {expanded ? 'Ver menos' : 'Ver detalles'}
                    </button>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            style={buttonStyle('#E2E8F0', '#475569')}
                            onClick={() => onVerDetalle(cita)}
                        >
                            <FontAwesomeIcon icon={faEye} />
                            Detalles
                        </button>

                        {puedeCancelar && !esPasada && (
                            <button
                                style={buttonStyle('#EF4444')}
                                onClick={() => onCancelar(cita.id)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};