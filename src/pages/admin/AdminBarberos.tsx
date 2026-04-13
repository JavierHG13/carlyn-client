import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserTie,
  faSearch,
  faFilter,
  faSpinner,
  faTimes,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { BarberosTable } from '../../components/admin/barberos/BarberosTable';
import { BarberoModal } from '../../components/admin/barberos/barberoModal';
import { BarberoDetailsModal } from '../../components/admin/barberos/BarberoDetailsModal';
import { BarberoStatsModal } from '../../components/admin/barberos/BarberoStatsModal';
import { barberoService } from '../../services/barberoService';
import type { Barbero, BarberoFormData } from '../../types/barbero';
import { colors } from '../../styles/colors';

export const AdminBarberos: React.FC = () => {
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [filteredBarberos, setFilteredBarberos] = useState<Barbero[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactivos, setShowInactivos] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [selectedBarbero, setSelectedBarbero] = useState<Barbero | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadBarberos();
  }, []);

  useEffect(() => {
    filterBarberos();
  }, [searchTerm, showInactivos, barberos]);

  const loadBarberos = async () => {
    try {
      setLoading(true);
      const data = await barberoService.getAll();
      setBarberos(data);
    } catch (error) {
      console.error('Error loading barberos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBarberos = () => {
    let filtered = [...barberos];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(b =>
        b.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.especialidad?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (!showInactivos) {
      filtered = filtered.filter(b => b.activo);
    }

    setFilteredBarberos(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  };

  const handleUpdateBarbero = async (data: BarberoFormData) => {
    if (!selectedBarbero) return;
    try {
      setModalLoading(true);
      await barberoService.updatePerfil(selectedBarbero.barbero_id, data);
      await loadBarberos();
      setModalOpen(false);
      setSelectedBarbero(null);
    } catch (error) {
      console.error('Error updating barbero:', error);
      throw error;
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleStatus = async (barbero: Barbero) => {
    try {
      await barberoService.toggleStatus(barbero.barbero_id, !barbero.activo);
      await loadBarberos();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Error al cambiar el estado del barbero');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Paginación
  const paginatedBarberos = filteredBarberos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const searchContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const searchInputContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
  };

  const searchInputStyle: React.CSSProperties = {
    border: 'none',
    background: 'none',
    outline: 'none',
    marginLeft: '8px',
    width: '250px',
    fontSize: '14px',
  };

  const filterButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    backgroundColor: active ? colors.doradoClasico : colors.grafito,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  });

  const clearButtonStyle: React.CSSProperties = {
    padding: '8px 12px',
    backgroundColor: '#E2E8F0',
    color: '#475569',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  if (loading && barberos.length === 0) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '32px', color: colors.doradoClasico }} />
          <p style={{ marginTop: '16px', color: colors.azulAcero }}>Cargando barberos...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            <FontAwesomeIcon icon={faUserTie} style={{ color: colors.doradoClasico }} />
            Gestión de Barberos
          </h1>

          <div style={searchContainerStyle}>
            <div style={searchInputContainerStyle}>
              <FontAwesomeIcon icon={faSearch} style={{ color: '#9AA6B2' }} />
              <input
                type="text"
                placeholder="Buscar barbero..."
                style={searchInputStyle}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={clearSearch} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={faTimes} style={{ color: '#9AA6B2' }} />
                </button>
              )}
            </div>
            <button style={filterButtonStyle(showInactivos)} onClick={() => setShowInactivos(!showInactivos)}>
              <FontAwesomeIcon icon={faFilter} />
              {showInactivos ? 'Mostrando todos' : 'Solo activos'}
            </button>
          </div>
        </div>

        <BarberosTable
          barberos={paginatedBarberos}
          loading={loading}
          onEdit={(b) => {
            setSelectedBarbero(b);
            setModalOpen(true);
          }}
          onToggleStatus={handleToggleStatus}
          onViewDetails={(b) => {
            setSelectedBarbero(b);
            setDetailsModalOpen(true);
          }}
          onViewStats={(b) => {
            setSelectedBarbero(b);
            setStatsModalOpen(true);
          }}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <BarberoModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedBarbero(null);
          }}
          onSave={handleUpdateBarbero}
          barbero={selectedBarbero}
          loading={modalLoading}
        />

        <BarberoDetailsModal
          isOpen={detailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false);
            setSelectedBarbero(null);
          }}
          barbero={selectedBarbero}
        />

        <BarberoStatsModal
          isOpen={statsModalOpen}
          onClose={() => {
            setStatsModalOpen(false);
            setSelectedBarbero(null);
          }}
          barbero={selectedBarbero}
        />
      </div>
    </AdminLayout>
  );
};