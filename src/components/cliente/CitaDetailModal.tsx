import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes,
    faCalendarAlt,
    faClock,
    faUserTie,
    faCut,
    faDollarSign,
    faPhone,
    faEnvelope,
    faInfoCircle,
    faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import type { CitaCliente } from '../../types/misCitas';
import { colors } from '../../styles/colors';

interface CitaDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    cita: CitaCliente | null;
}

export const CitaDetailModal: React.FC<CitaDetailModalProps> = ({ isOpen, onClose, cita }) => {
    if (!isOpen || !cita) return null;

    const formatFecha = (fecha: string) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getEstadoBadge = () => {
        const config: Record<string, { bg: string; color: string }> = {
            'Pendiente': { bg: '#FEF3C7', color: '#F59E0B' },
            'Confirmada': { bg: '#DBEAFE', color: '#3B82F6' },
            'Completada': { bg: '#D1FAE5', color: '#10B981' },
            'Cancelada': { bg: '#FEE2E2', color: '#EF4444' },
            'No_asistio': { bg: '#FEE2E2', color: '#EF4444' },
        };
        const style = config[cita.estado_nombre] || config['Pendiente'];
        return (
            <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 500,
                backgroundColor: style.bg,
                color: style.color,
            }}>
                {cita.estado_nombre}
            </span>
        );
    };

    const modalOverlayStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    };

    const modalContentStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '24px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
    };

    const sectionStyle: React.CSSProperties = {
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: '#F8FAFC',
        borderRadius: '12px',
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontSize: '14px',
        fontWeight: 600,
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: colors.negroSuave,
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 600 }}>Detalles de la Cita</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <FontAwesomeIcon icon={faTimes} style={{ fontSize: '20px', color: '#718096' }} />
                    </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <div style={{ fontSize: '14px', color: '#718096' }}>Cita #{cita.id}</div>
                        <div style={{ fontSize: '18px', fontWeight: 600, marginTop: '4px' }}>
                            {formatFecha(cita.fecha)} - {cita.hora_inicio.slice(0, 5)} hs
                        </div>
                    </div>
                    {getEstadoBadge()}
                </div>

                <div style={sectionStyle}>
                    <h4 style={sectionTitleStyle}>
                        <FontAwesomeIcon icon={faCut} style={{ color: colors.doradoClasico }} />
                        Servicio
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#718096' }}>Nombre</span>
                        <span style={{ fontWeight: 500 }}>{cita.servicio_nombre}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#718096' }}>Duración</span>
                        <span>{cita.servicio_duracion} minutos</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#718096' }}>Precio</span>
                        <span style={{ fontWeight: 600, color: colors.doradoClasico }}>${cita.servicio_precio.toFixed(2)}</span>
                    </div>
                </div>

                <div style={sectionStyle}>
                    <h4 style={sectionTitleStyle}>
                        <FontAwesomeIcon icon={faUserTie} style={{ color: colors.doradoClasico }} />
                        Barbero
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#718096' }}>Nombre</span>
                        <span style={{ fontWeight: 500 }}>{cita.barbero_nombre}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#718096' }}>Especialidad</span>
                        <span>{cita.barbero_especialidad}</span>
                    </div>
                </div>

                {cita.notas && (
                    <div style={sectionStyle}>
                        <h4 style={sectionTitleStyle}>
                            <FontAwesomeIcon icon={faInfoCircle} style={{ color: colors.doradoClasico }} />
                            Notas
                        </h4>
                        <p style={{ margin: 0, lineHeight: 1.5 }}>{cita.notas}</p>
                    </div>
                )}

                {cita.motivo_cancelacion && (
                    <div style={{ ...sectionStyle, backgroundColor: '#FEE2E2' }}>
                        <h4 style={{ ...sectionTitleStyle, color: '#EF4444' }}>
                            <FontAwesomeIcon icon={faTimesCircle} />
                            Motivo de cancelación
                        </h4>
                        <p style={{ margin: 0, color: '#EF4444' }}>{cita.motivo_cancelacion}</p>
                    </div>
                )}

                <div style={sectionStyle}>
                    <h4 style={sectionTitleStyle}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: colors.doradoClasico }} />
                        Ubicación
                    </h4>
                    <p style={{ margin: 0 }}>Barbería Carlyn</p>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#718096' }}>Av. Principal 123, Santiago</p>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: colors.grafito,
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: 500,
                        }}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};