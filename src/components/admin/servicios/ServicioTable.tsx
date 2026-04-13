import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEdit,
    faTrash,
    faToggleOn,
    faToggleOff,
    faClock,
    faDollarSign,
    faEye,
    faChartLine,
    faCheckCircle,
    faTimesCircle,
    faImage,
    faChevronLeft,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import type { Servicio } from '../../../types/servicio';
import { colors } from '../../../styles/colors';

interface ServicioTableProps {
    servicios: Servicio[];
    loading: boolean;
    onEdit: (servicio: Servicio) => void;
    onDelete: (servicio: Servicio) => void;
    onToggleStatus: (servicio: Servicio) => void;
    onViewStats: (servicio: Servicio) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const ServicioTable: React.FC<ServicioTableProps> = ({
    servicios,
    loading,
    onEdit,
    onDelete,
    onToggleStatus,
    onViewStats,
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

    const tableContainerStyle: React.CSSProperties = {
        overflowX: 'auto',
        borderRadius: '12px',
        border: '1px solid #EDF2F7',
        backgroundColor: 'white',
    };

    const tableStyle: React.CSSProperties = {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '1000px',
    };

    const thStyle: React.CSSProperties = {
        textAlign: 'left',
        padding: '16px',
        backgroundColor: '#F8FAFC',
        borderBottom: '2px solid #EDF2F7',
        color: '#475569',
        fontSize: '13px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    };

    const tdStyle: React.CSSProperties = {
        padding: '16px',
        borderBottom: '1px solid #EDF2F7',
        fontSize: '14px',
        verticalAlign: 'middle',
    };

    const imageStyle: React.CSSProperties = {
        width: '50px',
        height: '50px',
        borderRadius: '8px',
        objectFit: 'cover',
        backgroundColor: '#F1F5F9',
    };

    const noImageStyle: React.CSSProperties = {
        width: '50px',
        height: '50px',
        borderRadius: '8px',
        backgroundColor: '#F1F5F9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94A3B8',
        fontSize: '20px',
    };

    const statusBadgeStyle = (activo: boolean): React.CSSProperties => ({
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: activo ? '#D1FAE5' : '#FEE2E2',
        color: activo ? '#10B981' : '#EF4444',
    });

    const priceStyle: React.CSSProperties = {
        fontWeight: 600,
        color: colors.doradoClasico,
    };

    const actionButtonStyle = (color: string): React.CSSProperties => ({
        padding: '6px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: 'transparent',
        color: color,
        cursor: 'pointer',
        fontSize: '14px',
        margin: '0 2px',
        width: '32px',
        height: '32px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s',
    });

    const paginationStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '12px',
        marginTop: '20px',
    };

    const paginationButtonStyle = (disabled: boolean): React.CSSProperties => ({
        padding: '8px 12px',
        border: '1px solid #E2E8F0',
        borderRadius: '6px',
        backgroundColor: 'white',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    });

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '60px' }}>
                Cargando servicios...
            </div>
        );
    }

    return (
        <div>
            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Imagen</th>
                            <th style={thStyle}>Nombre</th>
                            <th style={thStyle}>Descripción</th>
                            <th style={thStyle}>Duración</th>
                            <th style={thStyle}>Precio</th>
                            <th style={thStyle}>Estado</th>
                            <th style={thStyle}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicios.map((servicio) => (
                            <tr key={servicio.id}>
                                <td style={tdStyle}>
                                    {servicio.imagen_url && !imageErrors[servicio.id] ? (
                                        <img
                                            src={servicio.imagen_url}
                                            alt={servicio.nombre}
                                            style={imageStyle}
                                            onError={() => setImageErrors(prev => ({ ...prev, [servicio.id]: true }))}
                                        />
                                    ) : (
                                        <div style={noImageStyle}>
                                            <FontAwesomeIcon icon={faImage} />
                                        </div>
                                    )}
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ fontWeight: 500 }}>{servicio.nombre}</div>
                                </td>
                                <td style={tdStyle}>
                                    {servicio.descripcion ? (
                                        <span style={{ fontSize: '13px', color: '#718096' }}>
                                            {servicio.descripcion.length > 60
                                                ? `${servicio.descripcion.substring(0, 60)}...`
                                                : servicio.descripcion}
                                        </span>
                                    ) : (
                                        <span style={{ color: '#A0AEC0' }}>—</span>
                                    )}
                                </td>
                                <td style={tdStyle}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <FontAwesomeIcon icon={faClock} style={{ color: '#718096', fontSize: '12px' }} />
                                        {servicio.duracion} min
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <span style={priceStyle}>${servicio.precio}</span>
                                </td>
                                <td style={tdStyle}>
                                    <span style={statusBadgeStyle(servicio.activo)}>
                                        <FontAwesomeIcon icon={servicio.activo ? faCheckCircle : faTimesCircle} style={{ fontSize: '10px' }} />
                                        {servicio.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button
                                            style={actionButtonStyle(colors.azulAcero)}
                                            onClick={() => onViewStats(servicio)}
                                            title="Ver estadísticas"
                                        >
                                            <FontAwesomeIcon icon={faChartLine} />
                                        </button>
                                        <button
                                            style={actionButtonStyle(colors.doradoClasico)}
                                            onClick={() => onEdit(servicio)}
                                            title="Editar"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            style={actionButtonStyle(servicio.activo ? '#F59E0B' : '#10B981')}
                                            onClick={() => onToggleStatus(servicio)}
                                            title={servicio.activo ? 'Desactivar' : 'Activar'}
                                        >
                                            <FontAwesomeIcon icon={servicio.activo ? faToggleOff : faToggleOn} />
                                        </button>
                                        <button
                                            style={actionButtonStyle('#EF4444')}
                                            onClick={() => onDelete(servicio)}
                                            title="Eliminar"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div style={paginationStyle}>
                    <button
                        style={paginationButtonStyle(currentPage === 1)}
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                        Anterior
                    </button>
                    <span style={{ fontSize: '14px', color: '#718096' }}>
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        style={paginationButtonStyle(currentPage === totalPages)}
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            )}
        </div>
    );
};