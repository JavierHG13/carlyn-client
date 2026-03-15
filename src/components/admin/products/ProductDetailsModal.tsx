import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes,
    faBox,
    faTag,
    faBarcode,
    faDollarSign,
    faExclamationTriangle,
    faCheckCircle,
    faTimesCircle,
    faCalendar,
    faInfoCircle,
    faEdit,
} from '@fortawesome/free-solid-svg-icons';
import type { Product } from '../../../types/product';
import { colors } from '../../../styles/colors';

interface ProductDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
    isOpen,
    onClose,
    product,
}) => {
    if (!isOpen || !product) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStockStatus = () => {
        if (product.stock <= 0) {
            return { label: 'Sin stock', color: '#EF4444', icon: faTimesCircle };
        } else if (product.stock <= product.stock_minimo) {
            return { label: 'Stock bajo', color: '#F59E0B', icon: faExclamationTriangle };
        } else {
            return { label: 'Stock normal', color: '#10B981', icon: faCheckCircle };
        }
    };

    const stockStatus = getStockStatus();

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
        borderRadius: '12px',
        padding: '24px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
    };

    const modalHeaderStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    };

    const modalTitleStyle: React.CSSProperties = {
        fontSize: '20px',
        fontWeight: 600,
        color: colors.negroSuave,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    };

    const closeButtonStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        color: '#718096',
    };

    const infoGridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px',
        marginBottom: '24px',
    };

    const infoItemStyle = (bgColor: string = '#F8FAFC'): React.CSSProperties => ({
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '16px',
        backgroundColor: bgColor,
        borderRadius: '10px',
    });

    const infoIconStyle = (color: string): React.CSSProperties => ({
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        backgroundColor: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        fontSize: '18px',
    });

    const infoContentStyle: React.CSSProperties = {
        flex: 1,
    };

    const infoLabelStyle: React.CSSProperties = {
        fontSize: '12px',
        color: '#718096',
        marginBottom: '4px',
    };

    const infoValueStyle: React.CSSProperties = {
        fontSize: '16px',
        fontWeight: 500,
        color: colors.negroSuave,
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

    const footerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: '1px solid #EDF2F7',
    };

    const buttonStyle: React.CSSProperties = {
        padding: '8px 16px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        backgroundColor: colors.grafito,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <div style={modalHeaderStyle}>
                    <h3 style={modalTitleStyle}>
                        <FontAwesomeIcon icon={faBox} style={{ color: colors.doradoClasico }} />
                        Detalles del Producto
                    </h3>
                    <button style={closeButtonStyle} onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div style={infoGridStyle}>
                    {/* Nombre */}
                    <div style={infoItemStyle()}>
                        <div style={infoIconStyle(colors.doradoClasico)}>
                            <FontAwesomeIcon icon={faBox} />
                        </div>
                        <div style={infoContentStyle}>
                            <div style={infoLabelStyle}>Nombre del Producto</div>
                            <div style={infoValueStyle}>{product.nombre}</div>
                        </div>
                    </div>

                    {/* SKU y Categoría */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={infoItemStyle()}>
                            <div style={infoIconStyle('#3B82F6')}>
                                <FontAwesomeIcon icon={faBarcode} />
                            </div>
                            <div>
                                <div style={infoLabelStyle}>SKU</div>
                                <div style={{ fontWeight: 500 }}>
                                    {product.sku || <span style={{ color: '#A0AEC0' }}>—</span>}
                                </div>
                            </div>
                        </div>

                        <div style={infoItemStyle()}>
                            <div style={infoIconStyle('#8B5CF6')}>
                                <FontAwesomeIcon icon={faTag} />
                            </div>
                            <div>
                                <div style={infoLabelStyle}>Categoría</div>
                                <div style={{ fontWeight: 500 }}>
                                    {product.categoria || <span style={{ color: '#A0AEC0' }}>—</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Descripción */}
                    {product.descripcion && (
                        <div style={infoItemStyle()}>
                            <div style={infoIconStyle('#718096')}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                            </div>
                            <div style={infoContentStyle}>
                                <div style={infoLabelStyle}>Descripción</div>
                                <div style={infoValueStyle}>{product.descripcion}</div>
                            </div>
                        </div>
                    )}

                    {/* Precio y Stock */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={infoItemStyle()}>
                            <div style={infoIconStyle('#10B981')}>
                                <FontAwesomeIcon icon={faDollarSign} />
                            </div>
                            <div>
                                <div style={infoLabelStyle}>Precio</div>
                                <div style={{ fontWeight: 600, fontSize: '18px', color: colors.doradoClasico }}>
                                    ${(Number(product.precio) || 0).toFixed(2)}
                                </div>
                            </div>
                        </div>

                        <div style={infoItemStyle(stockStatus.color + '10')}>
                            <div style={infoIconStyle(stockStatus.color)}>
                                <FontAwesomeIcon icon={stockStatus.icon} />
                            </div>
                            <div>
                                <div style={infoLabelStyle}>Stock</div>
                                <div>
                                    <span style={{ fontWeight: 600, fontSize: '18px' }}>{product.stock}</span>
                                    <span style={{ fontSize: '13px', color: '#718096', marginLeft: '4px' }}>
                                        / min: {product.stock_minimo}
                                    </span>
                                </div>
                                <div style={{ fontSize: '12px', color: stockStatus.color, marginTop: '2px' }}>
                                    {stockStatus.label}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estado */}
                    <div style={infoItemStyle()}>
                        <div style={infoIconStyle(product.activo ? '#10B981' : '#EF4444')}>
                            <FontAwesomeIcon icon={product.activo ? faCheckCircle : faTimesCircle} />
                        </div>
                        <div style={infoContentStyle}>
                            <div style={infoLabelStyle}>Estado</div>
                            <div>
                                <span style={statusBadgeStyle(product.activo)}>
                                    <FontAwesomeIcon icon={product.activo ? faCheckCircle : faTimesCircle} />
                                    {product.activo ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Fechas */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={infoItemStyle()}>
                            <div style={infoIconStyle('#718096')}>
                                <FontAwesomeIcon icon={faCalendar} />
                            </div>
                            <div>
                                <div style={infoLabelStyle}>Fecha Creación</div>
                                <div style={{ fontSize: '13px' }}>{formatDate(product.created_at)}</div>
                            </div>
                        </div>

                        <div style={infoItemStyle()}>
                            <div style={infoIconStyle('#718096')}>
                                <FontAwesomeIcon icon={faCalendar} />
                            </div>
                            <div>
                                <div style={infoLabelStyle}>Última Actualización</div>
                                <div style={{ fontSize: '13px' }}>{formatDate(product.updated_at)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={footerStyle}>
                    <button style={buttonStyle} onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};