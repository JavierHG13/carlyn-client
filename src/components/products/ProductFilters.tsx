import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTimes, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../styles/colors';

interface ProductFiltersProps {
  categories: string[];
  onFilterChange: (filters: { search: string; category: string; minPrice: number; maxPrice: number }) => void;
  initialFilters?: { search: string; category: string; minPrice: number; maxPrice: number };
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  onFilterChange,
  initialFilters = { search: '', category: '', minPrice: 0, maxPrice: 0 },
}) => {
  const [search, setSearch] = useState(initialFilters.search);
  const [category, setCategory] = useState(initialFilters.category);
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice);
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    onFilterChange({ search: debouncedSearch, category, minPrice, maxPrice });
  }, [debouncedSearch, category, minPrice, maxPrice]);

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice(0);
    setMaxPrice(0);
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    border: '1px solid #EDF2F7',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  };

  const searchContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const searchInputContainerStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
  };

  const searchInputStyle: React.CSSProperties = {
    border: 'none',
    background: 'none',
    outline: 'none',
    marginLeft: '8px',
    width: '100%',
    fontSize: '14px',
  };

  const filterButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: colors.grafito,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  };

  const clearButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: '#E2E8F0',
    color: '#475569',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  };

  const filtersPanelStyle: React.CSSProperties = {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #EDF2F7',
    display: showFilters ? 'grid' : 'none',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  };

  const priceInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  };

  return (
    <div style={containerStyle}>
      <div style={searchContainerStyle}>
        <div style={searchInputContainerStyle}>
          <FontAwesomeIcon icon={faSearch} style={{ color: '#9AA6B2' }} />
          <input
            type="text"
            placeholder="Buscar productos por nombre o SKU..."
            style={searchInputStyle}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <button style={filterButtonStyle} onClick={() => setShowFilters(!showFilters)}>
          <FontAwesomeIcon icon={faFilter} />
          {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
        
        {(search || category || minPrice > 0 || maxPrice > 0) && (
          <button style={clearButtonStyle} onClick={clearFilters}>
            <FontAwesomeIcon icon={faTimes} />
            Limpiar
          </button>
        )}
      </div>

      <div style={filtersPanelStyle}>
        <div>
          <label style={{ fontSize: '13px', color: '#718096', marginBottom: '4px', display: 'block' }}>
            Categoría
          </label>
          <select
            style={selectStyle}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '13px', color: '#718096', marginBottom: '4px', display: 'block' }}>
            Precio mínimo
          </label>
          <div style={{ position: 'relative' }}>
            <FontAwesomeIcon icon={faDollarSign} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0', fontSize: '12px' }} />
            <input
              type="number"
              min="0"
              step="1"
              style={{ ...priceInputStyle, paddingLeft: '28px' }}
              placeholder="0"
              value={minPrice || ''}
              onChange={(e) => setMinPrice(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '13px', color: '#718096', marginBottom: '4px', display: 'block' }}>
            Precio máximo
          </label>
          <div style={{ position: 'relative' }}>
            <FontAwesomeIcon icon={faDollarSign} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0', fontSize: '12px' }} />
            <input
              type="number"
              min="0"
              step="1"
              style={{ ...priceInputStyle, paddingLeft: '28px' }}
              placeholder="Sin límite"
              value={maxPrice || ''}
              onChange={(e) => setMaxPrice(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};