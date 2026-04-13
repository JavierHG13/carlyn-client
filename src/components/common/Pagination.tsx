import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../styles/colors';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push(-1); // Separador
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const buttonStyle = (isActive: boolean = false): React.CSSProperties => ({
    padding: '8px 12px',
    minWidth: '40px',
    border: `1px solid ${isActive ? colors.doradoClasico : '#E2E8F0'}`,
    borderRadius: '6px',
    backgroundColor: isActive ? colors.doradoClasico : 'white',
    color: isActive ? 'white' : '#475569',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
  });

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginTop: '32px',
    flexWrap: 'wrap',
  };

  if (totalPages <= 1) return null;

  return (
    <div style={containerStyle}>
      <button
        style={buttonStyle()}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      
      {getPageNumbers().map((page, index) => (
        page === -1 ? (
          <span key={`separator-${index}`} style={{ padding: '0 4px', color: '#A0AEC0' }}>...</span>
        ) : (
          <button
            key={page}
            style={buttonStyle(page === currentPage)}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      ))}
      
      <button
        style={buttonStyle()}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};