import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faDollarSign,
  faBox,
  faTag,
  faCheckCircle,
  faTimesCircle,
  faCalendar,
  faInfoCircle,
  faShoppingCart,
  faStar,
  faTruck,
  faShieldAlt,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';
import { Breadcrumb } from '../../../components/common/Breadcrumb';
import { productService } from '../../../services/productService';
import type { Product } from '../../../types/product';
import { colors } from '../../../styles/colors';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getById(Number(id));
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
      navigate('/productos');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px',
    minHeight: '100vh',
    backgroundColor: colors.blancoHueso,
  };

  const backButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: `1px solid ${colors.azulAcero}`,
    borderRadius: '8px',
    color: colors.azulAcero,
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '24px',
    transition: 'all 0.2s',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  };

  const contentStyle: React.CSSProperties = {
    padding: '32px',
  };

  const headerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    marginBottom: '32px',
  };

  const infoSectionStyle: React.CSSProperties = {
    flex: 1,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 700,
    color: colors.negroSuave,
    marginBottom: '16px',
    fontFamily: 'Playfair Display, serif',
  };

  const skuStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#718096',
    marginBottom: '16px',
    fontFamily: 'monospace',
  };

  const priceStyle: React.CSSProperties = {
    fontSize: '36px',
    fontWeight: 700,
    color: colors.doradoClasico,
    marginBottom: '16px',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '15px',
    color: '#475569',
    lineHeight: 1.6,
    marginBottom: '24px',
  };

  const metaGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#F8FAFC',
    borderRadius: '12px',
  };

  const metaItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const metaIconStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: `${colors.doradoClasico}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.doradoClasico,
  };

  const stockBadgeStyle = (stock: number): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '30px',
    fontSize: '14px',
    fontWeight: 500,
    backgroundColor: stock > 0 ? '#D1FAE5' : '#FEE2E2',
    color: stock > 0 ? '#10B981' : '#EF4444',
  });

  const quantityContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  };

  const quantityButtonStyle: React.CSSProperties = {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: `1px solid #E2E8F0`,
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '18px',
  };

  const quantityInputStyle: React.CSSProperties = {
    width: '60px',
    height: '36px',
    textAlign: 'center',
    border: `1px solid #E2E8F0`,
    borderRadius: '8px',
    fontSize: '14px',
  };

  const addToCartStyle: React.CSSProperties = {
    padding: '14px 28px',
    backgroundColor: colors.doradoClasico,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'opacity 0.2s',
  };

  const featuresGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    marginTop: '32px',
    paddingTop: '32px',
    borderTop: '1px solid #EDF2F7',
  };

  const featureItemStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '16px',
  };

  const featureIconStyle: React.CSSProperties = {
    fontSize: '32px',
    color: colors.doradoClasico,
    marginBottom: '12px',
  };

  const loadingStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '80px',
    color: colors.azulAcero,
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          Cargando producto...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          Producto no encontrado
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Breadcrumb />
      
      <button style={backButtonStyle} onClick={() => navigate('/productos')}>
        <FontAwesomeIcon icon={faArrowLeft} />
        Volver a productos
      </button>
      
      <div style={cardStyle}>
        <div style={contentStyle}>
          <div style={headerStyle}>
            <div style={infoSectionStyle}>
              <h1 style={titleStyle}>{product.nombre}</h1>
              
              {product.sku && (
                <div style={skuStyle}>SKU: {product.sku}</div>
              )}
              
              <div style={priceStyle}>${product.precio}</div>
              
              {product.descripcion && (
                <p style={descriptionStyle}>{product.descripcion}</p>
              )}
              
              <div style={metaGridStyle}>
                {product.categoria && (
                  <div style={metaItemStyle}>
                    <div style={metaIconStyle}>
                      <FontAwesomeIcon icon={faTag} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#718096' }}>Categoría</div>
                      <div style={{ fontWeight: 500 }}>{product.categoria}</div>
                    </div>
                  </div>
                )}
                
                <div style={metaItemStyle}>
                  <div style={metaIconStyle}>
                    <FontAwesomeIcon icon={faBox} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>Stock disponible</div>
                    <div style={{ fontWeight: 500 }}>{product.stock} unidades</div>
                  </div>
                </div>
              </div>
              
              <div style={stockBadgeStyle(product.stock)}>
                <FontAwesomeIcon icon={product.stock > 0 ? faCheckCircle : faTimesCircle} />
                {product.stock > 0 ? 'En stock' : 'Agotado'}
              </div>
            </div>
            
            <div>
              <div style={quantityContainerStyle}>
                <button
                  style={quantityButtonStyle}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={product.stock === 0}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  style={quantityInputStyle}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                  disabled={product.stock === 0}
                />
                <button
                  style={quantityButtonStyle}
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={product.stock === 0}
                >
                  +
                </button>
              </div>
              
              <button
                style={addToCartStyle}
                disabled={product.stock === 0}
                onClick={() => alert(`Agregado ${quantity} x ${product.nombre} al carrito`)}
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                Agregar al carrito
              </button>
            </div>
          </div>
          
          <div style={featuresGridStyle}>
            <div style={featureItemStyle}>
              <FontAwesomeIcon icon={faTruck} style={featureIconStyle} />
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>Envío a domicilio</div>
              <div style={{ fontSize: '13px', color: '#718096' }}>Entrega en 24-48 horas</div>
            </div>
            
            <div style={featureItemStyle}>
              <FontAwesomeIcon icon={faShieldAlt} style={featureIconStyle} />
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>Garantía de calidad</div>
              <div style={{ fontSize: '13px', color: '#718096' }}>Productos originales</div>
            </div>
            
            <div style={featureItemStyle}>
              <FontAwesomeIcon icon={faUndo} style={featureIconStyle} />
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>Devoluciones</div>
              <div style={{ fontSize: '13px', color: '#718096' }}>30 días de garantía</div>
            </div>
          </div>
          
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #EDF2F7', fontSize: '13px', color: '#718096', display: 'flex', justifyContent: 'space-between' }}>
            <span>
              <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '4px' }} />
              Creado: {formatDate(product.created_at)}
            </span>
            <span>
              <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '4px' }} />
              Actualizado: {formatDate(product.updated_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};