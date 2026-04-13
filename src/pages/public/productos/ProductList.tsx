import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../../../components/common/Breadcrumb';
import { ProductFilters } from '../../../components/products/ProductFilters';
import { ProductCard } from '../../../components/products/ProductCard';
import { Pagination } from '../../../components/common/Pagination';
import { productService } from '../../../services/productService';
import type { Product, ProductFilters as FiltersType } from '../../../types/product';
import { colors } from '../../../styles/colors';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });
  const [activeFilters, setActiveFilters] = useState({
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 0,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [pagination.page, activeFilters]);

  const loadCategories = async () => {
    try {
      const cats = await productService.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      const filters: FiltersType = {
        page: pagination.page,
        limit: pagination.limit,
        q: activeFilters.search || undefined,
        categoria: activeFilters.category || undefined,
      };
      
      const response = await productService.list(filters);
      
      // Aplicar filtros de precio en cliente (si el backend no los soporta)
      let filteredData = response.data;
      if (activeFilters.minPrice > 0) {
        filteredData = filteredData.filter(p => p.precio >= activeFilters.minPrice);
      }
      if (activeFilters.maxPrice > 0) {
        filteredData = filteredData.filter(p => p.precio <= activeFilters.maxPrice);
      }
      
      setProducts(filteredData);
      setPagination({
        ...response.pagination,
        total: response.pagination.total,
      });
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (filters: { search: string; category: string; minPrice: number; maxPrice: number }) => {
    setActiveFilters(filters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px',
    minHeight: '100vh',
    backgroundColor: colors.blancoHueso,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 700,
    color: colors.negroSuave,
    marginBottom: '8px',
    fontFamily: 'Playfair Display, serif',
  };

  const resultsStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#718096',
    marginBottom: '24px',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: 'white',
    borderRadius: '12px',
    color: '#718096',
  };

  const loadingStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '60px',
    color: colors.azulAcero,
  };

  return (
    <div style={containerStyle}>
      <Breadcrumb />
      
      <h1 style={titleStyle}>Nuestros Productos</h1>
      <p style={resultsStyle}>
        {!loading && `${pagination.total} producto${pagination.total !== 1 ? 's' : ''} encontrado${pagination.total !== 1 ? 's' : ''}`}
      </p>
      
      <ProductFilters
        categories={categories}
        onFilterChange={handleFilterChange}
        initialFilters={activeFilters}
      />
      
      {loading ? (
        <div style={loadingStyle}>
          Cargando productos...
        </div>
      ) : products.length === 0 ? (
        <div style={emptyStateStyle}>
          No se encontraron productos con los filtros seleccionados.
        </div>
      ) : (
        <>
          <div style={gridStyle}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};