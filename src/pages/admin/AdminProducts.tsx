import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBox,
    faPlus,
    faSearch,
    faFilter,
    faDownload,
    faUpload,
    faEdit,
    faTrash,
    faEye,
    faToggleOn,
    faToggleOff,
    faExclamationTriangle,
    faCheckCircle,
    faTimesCircle,
    faTag,
    faBarcode,
    faDollarSign,
    faPackage,
    faAlertCircle,
    faSync,
    faFileCsv,
    faInfoCircle,
    faChevronLeft,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { productService } from '../../services/productService';
import type { Product, ProductFilters } from '../../types/product';
import { ProductModal } from '../../components/admin/products/ProductModal';
import { ProductDetailsModal } from '../../components/admin/products/ProductDetailsModal';
import { ImportModal } from '../../components/admin/products/ImportModal';
import { colors } from '../../styles/colors';

export const AdminProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });
    const [filters, setFilters] = useState<ProductFilters>({
        q: '',
        categoria: '',
        activo: undefined,
        page: 1,
        limit: 10,
    });
    const [categories, setCategories] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, [filters]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.list(filters);
            setProducts(response.data);
            setPagination(response.pagination);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const cats = await productService.getUniqueCategories();
            setCategories(cats);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const handleCreateProduct = async (data: any) => {
        try {
            setModalLoading(true);
            await productService.create(data);
            await loadProducts();
            setModalOpen(false);
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        } finally {
            setModalLoading(false);
        }
    };

    const handleUpdateProduct = async (data: any) => {
        if (!selectedProduct) return;
        try {
            setModalLoading(true);
            await productService.update(selectedProduct.id, data);
            await loadProducts();
            setModalOpen(false);
            setSelectedProduct(null);
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteProduct = async (product: Product) => {
        if (!window.confirm(`¿Estás seguro de eliminar el producto "${product.nombre}"?`)) return;

        try {
            await productService.delete(product.id);
            await loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error al eliminar el producto');
        }
    };

    const handleToggleStatus = async (product: Product) => {
        try {
            await productService.update(product.id, { activo: !product.activo });
            await loadProducts();
        } catch (error) {
            console.error('Error toggling product status:', error);
            alert('Error al cambiar el estado del producto');
        }
    };

    const handleExport = async () => {
        try {
            await productService.exportCsv({
                q: filters.q,
                categoria: filters.categoria,
                activo: filters.activo,
            });
        } catch (error) {
            console.error('Error exporting products:', error);
            alert('Error al exportar productos');
        }
    };

    const handleImport = async (file: File, csvText?: string) => {
        try {
            let result;
            if (csvText) {
                result = await productService.importFromText(csvText);
            } else {
                result = await productService.importFromFile(file);
            }

            await loadProducts();
            return result;
        } catch (error) {
            console.error('Error importing products:', error);
            throw error;
        }
    };

    const getStockStatus = (product: Product) => {
        if (product.stock <= 0) {
            return { label: 'Sin stock', color: '#EF4444', bg: '#FEE2E2' };
        } else if (product.stock <= product.stock_minimo) {
            return { label: 'Stock bajo', color: '#F59E0B', bg: '#FEF3C7' };
        } else {
            return { label: 'Stock normal', color: '#10B981', bg: '#D1FAE5' };
        }
    };

    const containerStyle: React.CSSProperties = {
        width: '100%',
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '24px',
        fontWeight: 600,
        color: colors.negroSuave,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    };

    const actionButtonsStyle: React.CSSProperties = {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
    };

    const buttonStyle = (bgColor: string, textColor: string = 'white'): React.CSSProperties => ({
        padding: '10px 20px',
        backgroundColor: bgColor,
        color: textColor,
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'opacity 0.2s',
    });

    const filtersBarStyle: React.CSSProperties = {
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '20px',
        border: '1px solid #EDF2F7',
        display: showFilters ? 'block' : 'none',
    };

    const searchContainerStyle: React.CSSProperties = {
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap',
    };

    const searchInputStyle: React.CSSProperties = {
        flex: 1,
        minWidth: '250px',
        padding: '10px 16px',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
    };

    const selectStyle: React.CSSProperties = {
        padding: '10px 16px',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        minWidth: '150px',
    };

    const tableContainerStyle: React.CSSProperties = {
        overflowX: 'auto',
        borderRadius: '12px',
        border: '1px solid #EDF2F7',
        backgroundColor: 'white',
    };

    const tableStyle: React.CSSProperties = {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '1200px',
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
    });

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

    const stockBadgeStyle = (status: ReturnType<typeof getStockStatus>): React.CSSProperties => ({
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: status.bg,
        color: status.color,
    });

    return (
        <AdminLayout>
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <h1 style={titleStyle}>
                        <FontAwesomeIcon icon={faBox} style={{ color: colors.doradoClasico }} />
                        Gestión de Productos
                    </h1>

                    <div style={actionButtonsStyle}>
                        <button
                            style={buttonStyle(colors.grafito)}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FontAwesomeIcon icon={faFilter} />
                            Filtros
                        </button>
                        <button
                            style={buttonStyle(colors.grafito)}
                            onClick={handleExport}
                        >
                            <FontAwesomeIcon icon={faDownload} />
                            Exportar CSV
                        </button>
                        <button
                            style={buttonStyle(colors.grafito)}
                            onClick={() => setImportModalOpen(true)}
                        >
                            <FontAwesomeIcon icon={faUpload} />
                            Importar CSV
                        </button>
                        <button
                            style={buttonStyle(colors.doradoClasico)}
                            onClick={() => {
                                setSelectedProduct(null);
                                setModalOpen(true);
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            Nuevo Producto
                        </button>
                    </div>
                </div>

                {/* Filtros */}
                <div style={filtersBarStyle}>
                    <div style={searchContainerStyle}>
                        <div style={{ flex: 1, display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <FontAwesomeIcon icon={faSearch} style={{ color: '#9AA6B2' }} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o SKU..."
                                style={searchInputStyle}
                                value={filters.q || ''}
                                onChange={(e) => setFilters({ ...filters, q: e.target.value, page: 1 })}
                            />
                        </div>

                        <select
                            style={selectStyle}
                            value={filters.categoria || ''}
                            onChange={(e) => setFilters({ ...filters, categoria: e.target.value, page: 1 })}
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <select
                            style={selectStyle}
                            value={filters.activo === undefined ? '' : String(filters.activo)}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFilters({
                                    ...filters,
                                    activo: value === '' ? undefined : value === 'true',
                                    page: 1,
                                });
                            }}
                        >
                            <option value="">Todos los estados</option>
                            <option value="true">Activos</option>
                            <option value="false">Inactivos</option>
                        </select>

                        <button
                            style={buttonStyle('#E2E8F0', '#475569')}
                            onClick={() => setFilters({ q: '', categoria: '', activo: undefined, page: 1, limit: 10 })}
                        >
                            <FontAwesomeIcon icon={faSync} />
                            Limpiar
                        </button>
                    </div>
                </div>

                {/* Tabla de productos */}
                <div style={tableContainerStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>SKU</th>
                                <th style={thStyle}>Nombre</th>
                                <th style={thStyle}>Categoría</th>
                                <th style={thStyle}>Precio</th>
                                <th style={thStyle}>Stock</th>
                                <th style={thStyle}>Estado</th>
                                <th style={thStyle}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                                        Cargando productos...
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
                                        <FontAwesomeIcon icon={faBox} style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
                                        <p>No hay productos para mostrar</p>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => {
                                    const stockStatus = getStockStatus(product);
                                    return (
                                        <tr key={product.id}>
                                            <td style={tdStyle}>
                                                {product.sku ? (
                                                    <span style={{ fontFamily: 'monospace' }}>{product.sku}</span>
                                                ) : (
                                                    <span style={{ color: '#A0AEC0' }}>—</span>
                                                )}
                                            </td>
                                            <td style={tdStyle}>
                                                <div>
                                                    <div style={{ fontWeight: 500 }}>{product.nombre}</div>
                                                    {product.descripcion && (
                                                        <div style={{ fontSize: '12px', color: '#718096' }}>
                                                            {product.descripcion.substring(0, 50)}
                                                            {product.descripcion.length > 50 ? '...' : ''}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td style={tdStyle}>
                                                {product.categoria ? (
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        padding: '4px 8px',
                                                        backgroundColor: `${colors.doradoClasico}15`,
                                                        color: colors.doradoClasico,
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
                                                    }}>
                                                        <FontAwesomeIcon icon={faTag} style={{ fontSize: '10px' }} />
                                                        {product.categoria}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#A0AEC0' }}>—</span>
                                                )}
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{ fontWeight: 600, color: colors.doradoClasico }}>
                                                    ${(Number(product.precio) || 0).toFixed(2)}
                                                </span>
                                            </td>
                                            <td style={tdStyle}>
                                                <div>
                                                    <span style={{ fontWeight: 600, fontSize: '16px' }}>
                                                        {product.stock}
                                                    </span>
                                                    <span style={{ fontSize: '12px', color: '#718096', marginLeft: '4px' }}>
                                                        / min: {product.stock_minimo}
                                                    </span>
                                                    <div style={{ marginTop: '4px' }}>
                                                        <span style={stockBadgeStyle(stockStatus)}>
                                                            <FontAwesomeIcon icon={
                                                                stockStatus.label === 'Sin stock' ? faTimesCircle :
                                                                    stockStatus.label === 'Stock bajo' ? faExclamationTriangle :
                                                                        faCheckCircle
                                                            } style={{ fontSize: '10px' }} />
                                                            {stockStatus.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={statusBadgeStyle(product.activo)}>
                                                    <FontAwesomeIcon icon={product.activo ? faCheckCircle : faTimesCircle} style={{ fontSize: '10px' }} />
                                                    {product.activo ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    <button
                                                        style={actionButtonStyle(colors.azulAcero)}
                                                        onClick={() => {
                                                            setSelectedProduct(product);
                                                            setDetailsModalOpen(true);
                                                        }}
                                                        title="Ver detalles"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>
                                                    <button
                                                        style={actionButtonStyle(colors.doradoClasico)}
                                                        onClick={() => {
                                                            setSelectedProduct(product);
                                                            setModalOpen(true);
                                                        }}
                                                        title="Editar"
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    <button
                                                        style={actionButtonStyle(product.activo ? '#10B981' : '#EF4444')}
                                                        onClick={() => handleToggleStatus(product)}
                                                        title={product.activo ? 'Desactivar' : 'Activar'}
                                                    >
                                                        <FontAwesomeIcon icon={product.activo ? faToggleOn : faToggleOff} />
                                                    </button>
                                                    <button
                                                        style={actionButtonStyle('#EF4444')}
                                                        onClick={() => handleDeleteProduct(product)}
                                                        title="Eliminar"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {pagination.totalPages > 1 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '20px',
                    }}>
                        <span style={{ fontSize: '14px', color: '#718096' }}>
                            Mostrando {products.length} de {pagination.total} productos
                        </span>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                                disabled={pagination.page === 1}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '6px',
                                    backgroundColor: 'white',
                                    cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                                    opacity: pagination.page === 1 ? 0.5 : 1,
                                }}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>

                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                let pageNum;
                                if (pagination.totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (pagination.page <= 3) {
                                    pageNum = i + 1;
                                } else if (pagination.page >= pagination.totalPages - 2) {
                                    pageNum = pagination.totalPages - 4 + i;
                                } else {
                                    pageNum = pagination.page - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setFilters({ ...filters, page: pageNum })}
                                        style={{
                                            padding: '8px 12px',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '6px',
                                            backgroundColor: pageNum === pagination.page ? colors.doradoClasico : 'white',
                                            color: pageNum === pagination.page ? 'white' : '#475569',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
                                disabled={pagination.page === pagination.totalPages}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '6px',
                                    backgroundColor: 'white',
                                    cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer',
                                    opacity: pagination.page === pagination.totalPages ? 0.5 : 1,
                                }}
                            >
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Modales */}
                <ProductModal
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setSelectedProduct(null);
                    }}
                    onSave={selectedProduct ? handleUpdateProduct : handleCreateProduct}
                    product={selectedProduct}
                    loading={modalLoading}
                />

                <ProductDetailsModal
                    isOpen={detailsModalOpen}
                    onClose={() => {
                        setDetailsModalOpen(false);
                        setSelectedProduct(null);
                    }}
                    product={selectedProduct}
                />

                <ImportModal
                    isOpen={importModalOpen}
                    onClose={() => setImportModalOpen(false)}
                    onImport={handleImport}
                />
            </div>
        </AdminLayout>
    );
};