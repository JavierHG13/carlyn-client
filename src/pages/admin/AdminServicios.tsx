import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSearch,
  faFilter,
  faSpinner,
  faScissors,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { ServicioTable } from '../../components/admin/servicios/ServicioTable';
import { ServicioModal } from '../../components/admin/servicios/ServicioModal';
import { ServicioStatsModal } from '../../components/admin/servicios/ServicioStatsModal';
import { servicioService } from '../../services/servicioService';
import type { Servicio, CreateServicioData } from '../../types/servicio';
import { colors } from '../../styles/colors';

export const AdminServicios: React.FC = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactivos, setShowInactivos] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadServicios();
  }, [showInactivos, searchTerm]);

  const loadServicios = async () => {
    try {
      setLoading(true);
      const data = await servicioService.getAll({
        activo: showInactivos ? undefined : true,
        search: searchTerm || undefined,
      });
      setServicios(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading servicios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadServicios();
  };

  const clearSearch = () => {
    setSearchTerm('');
    loadServicios();
  };

  const handleCreate = async (data: CreateServicioData) => {
    try {
      setModalLoading(true);
      await servicioService.create(data);
      await loadServicios();
      setModalOpen(false);
    } catch (error) {
      console.error('Error creating servicio:', error);
      throw error;
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdate = async (data: CreateServicioData) => {
    if (!selectedServicio) return;
    try {
      setModalLoading(true);
      await servicioService.update(selectedServicio.id, data);
      await loadServicios();
      setModalOpen(false);
      setSelectedServicio(null);
    } catch (error) {
      console.error('Error updating servicio:', error);
      throw error;
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (servicio: Servicio) => {
    const action = servicio.activo ? 'desactivar' : 'eliminar permanentemente';
    if (!window.confirm(`¿Estás seguro de ${action} el servicio "${servicio.nombre}"?`)) return;

    try {
      if (servicio.activo) {
        await servicioService.deactivate(servicio.id);
      } else {
        await servicioService.deletePermanently(servicio.id);
      }
      await loadServicios();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al eliminar el servicio');
    }
  };

  const handleToggleStatus = async (servicio: Servicio) => {
    try {
      if (servicio.activo) {
        await servicioService.deactivate(servicio.id);
      } else {
        await servicioService.activate(servicio.id);
      }
      await loadServicios();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Error al cambiar el estado del servicio');
    }
  };

  // Paginación
  const paginatedServicios = servicios.slice(
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

  const addButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: colors.doradoClasico,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

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

  if (loading && servicios.length === 0) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '32px', color: colors.doradoClasico }} />
          <p style={{ marginTop: '16px', color: colors.azulAcero }}>Cargando servicios...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            <FontAwesomeIcon icon={faScissors} style={{ color: colors.doradoClasico }} />
            Gestión de Servicios
          </h1>

          <div style={searchContainerStyle}>
            <div style={searchInputContainerStyle}>
              <FontAwesomeIcon icon={faSearch} style={{ color: '#9AA6B2' }} />
              <input
                type="text"
                placeholder="Buscar servicios..."
                style={searchInputStyle}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
            <button style={addButtonStyle} onClick={() => {
              setSelectedServicio(null);
              setModalOpen(true);
            }}>
              <FontAwesomeIcon icon={faPlus} />
              Nuevo Servicio
            </button>
          </div>
        </div>

        <ServicioTable
          servicios={paginatedServicios}
          loading={loading}
          onEdit={(s) => {
            setSelectedServicio(s);
            setModalOpen(true);
          }}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onViewStats={(s) => {
            setSelectedServicio(s);
            setStatsModalOpen(true);
          }}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <ServicioModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedServicio(null);
          }}
          onSave={selectedServicio ? handleUpdate : handleCreate}
          servicio={selectedServicio}
          loading={modalLoading}
        />

        <ServicioStatsModal
          isOpen={statsModalOpen}
          onClose={() => {
            setStatsModalOpen(false);
            setSelectedServicio(null);
          }}
          servicio={selectedServicio}
        />
      </div>
    </AdminLayout>
  );
};