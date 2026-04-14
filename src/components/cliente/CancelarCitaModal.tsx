import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../styles/colors';

interface CancelarCitaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (motivo: string) => Promise<void>;
    citaInfo?: { id: number; servicio: string; fecha: string; hora: string };
    loading?: boolean;
}

export const CancelarCitaModal: React.FC<CancelarCitaModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    citaInfo,
    loading = false,
}) => {
    const [motivo, setMotivo] = useState('');

    if (!isOpen) return null;

    const handleConfirm = async () => {
        await onConfirm(motivo);
        setMotivo('');
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
        maxWidth: '450px',
        position: 'relative',
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#EF4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                        Cancelar Cita
                    </h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <FontAwesomeIcon icon={faTimes} style={{ fontSize: '18px', color: '#718096' }} />
                    </button>
                </div>

                {citaInfo && (
                    <div style={{ backgroundColor: '#FEE2E2', padding: '12px', borderRadius: '12px', marginBottom: '20px' }}>
                        <div style={{ fontWeight: 500 }}>{citaInfo.servicio}</div>
                        <div style={{ fontSize: '13px', marginTop: '4px' }}>{citaInfo.fecha} - {citaInfo.hora} hs</div>
                    </div>
                )}

                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: colors.azulAcero }}>
                    Motivo de cancelación
                </label>
                <textarea
                    style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        fontSize: '14px',
                        resize: 'vertical',
                        minHeight: '80px',
                        marginBottom: '20px',
                    }}
                    placeholder="Ej. Cambio de horario, no podré asistir, etc."
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                />

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: '#E2E8F0',
                            color: '#475569',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: 500,
                        }}
                    >
                        Volver
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: '#EF4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                        }}
                    >
                        {loading ? <><FontAwesomeIcon icon={faSpinner} spin /> Cancelando...</> : 'Confirmar cancelación'}
                    </button>
                </div>
            </div>
        </div>
    );
};