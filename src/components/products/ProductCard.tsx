import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faDollarSign, faBox, faTag } from '@fortawesome/free-solid-svg-icons';
import type { Product } from '../../types/product';
import { colors } from '../../styles/colors';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  const contentStyle: React.CSSProperties = {
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  const nameStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: colors.negroSuave,
    marginBottom: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#718096',
    marginBottom: '16px',
    lineHeight: 1.5,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  };

  const priceStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    color: colors.doradoClasico,
    marginBottom: '12px',
  };

  const metaContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  };

  const metaItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#718096',
  };

  const stockStyle = (stock: number): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 500,
    backgroundColor: stock > 0 ? '#D1FAE5' : '#FEE2E2',
    color: stock > 0 ? '#10B981' : '#EF4444',
  });

  const buttonStyle: React.CSSProperties = {
    padding: '10px',
    backgroundColor: colors.grafito,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background-color 0.2s',
    marginTop: 'auto',
  };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      }}
      onClick={() => navigate(`/productos/${product.id}`)}
    >
      <div style={contentStyle}>
        <h3 style={nameStyle}>{product.nombre}</h3>
        
        {product.descripcion && (
          <p style={descriptionStyle}>{product.descripcion}</p>
        )}
        
        <div style={priceStyle}>
          ${product.precio}
        </div>
        
        <div style={metaContainerStyle}>
          {product.categoria && (
            <span style={metaItemStyle}>
              <FontAwesomeIcon icon={faTag} style={{ fontSize: '12px' }} />
              {product.categoria}
            </span>
          )}
          {product.sku && (
            <span style={metaItemStyle}>
              <FontAwesomeIcon icon={faBox} style={{ fontSize: '12px' }} />
              SKU: {product.sku}
            </span>
          )}
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <span style={stockStyle(product.stock)}>
            {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
          </span>
        </div>
        
        <button style={buttonStyle}>
          <FontAwesomeIcon icon={faEye} />
          Ver detalles
        </button>
      </div>
    </div>
  );
};