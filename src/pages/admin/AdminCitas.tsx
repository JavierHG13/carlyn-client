import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faCalendarDay,
  faHistory,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { CitasTable } from '../../components/admin/citas/CitasTable';
import { CitaFilters } from '../../components/admin/citas/CitaFilters';
import { CitaDetailsModal } from '../../components/admin/citas/CitaDetailsModal';
import { CitaModal } from '../../components/admin/citas/CitaModal';
import { CancelCitaModal } from '../../components/admin/citas/CancelCitaModal';
import { citaService } from '../../services/citasService';
import { barberoService } from '../../services/barberoService';
import { servicioService } from '../../services/servicioService';
import type { Cita } from '../../types/citas';
import { colors } from '../../styles/colors';

type CitasView = 'proximas' | 'historial';

const fallbackEstados = [
  { id: 1, nombre: 'Pendiente' },
  { id: 2, nombre: 'Confirmada' },
  { id: 3, nombre: 'Completada' },
  { id: 4, nombre: 'Cancelada' },
  { id: 5, nombre: 'No_asistio' },
];

export const AdminCitas: React.FC = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [barberos, setBarberos] = useState<Array<{ id: number; nombre: string }>>([]);
  const [servicios, setServicios] = useState<Array<{ id: number; nombre: string; precio: number; duracion: number }>>([]);
  const [estados, setEstados] = useState<Array<{ id: number; nombre: string }>>(fallbackEstados);
  const [activeView, setActiveView] = useState<CitasView>('proximas');
  const [selectedEstadoId, setSelectedEstadoId] = useState(0);

  const [filters, setFilters] = useState({
    q: '',
    telefono: '',
    fechaInicio: '',
    fechaFin: '',
    estadoId: 0,
    barberoId: 0,
  });

  useEffect(() => {
    loadBarberos();
    loadServicios();
    loadEstados();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadCitas();
    }, 400);

    return () => clearTimeout(timeout);
  }, [currentPage, filters, activeView]);

  const loadCitas = async () => {
    try {
      setLoading(true);

      const response = await citaService.search({
        ...filters,
        page: currentPage,
        limit: 15,
        scope: activeView,
        estadoId: filters.estadoId || undefined,
        barberoId: filters.barberoId || undefined,
      });

      setCitas(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.total);
    } catch (error) {
      console.error('Error loading citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBarberos = async () => {
    try {
      const data = await barberoService.getAll();
      setBarberos(data.map(b => ({
        id: b.barbero_id,
        nombre: b.nombre
      })));
    } catch (error) {
      console.error('Error loading barberos:', error);
    }
  };

  const loadServicios = async () => {
    try {
      const data = await servicioService.getAll();
      setServicios(data.map(s => ({
        id: s.id,
        nombre: s.nombre,
        precio: s.precio,
        duracion: s.duracion
      })));
    } catch (error) {
      console.error('Error loading servicios:', error);
    }
  };

  const loadEstados = async () => {
    try {
      const data = await citaService.getEstados();
      if (Array.isArray(data) && data.length > 0) {
        setEstados(data);
      }
    } catch (error) {
      console.error('Error loading estados:', error);
    }
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 600,
    color: colors.negroSuave,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const viewCopy = {
    proximas: {
      label: 'Citas proximas',
      title: 'Agenda actual',
      description: 'Solo se muestran citas pendientes o confirmadas que aun estan por ocurrir.',
      empty: 'No hay citas proximas con los filtros actuales',
    },
    historial: {
      label: 'Historial',
      title: 'Historial de citas',
      description: 'Consulta citas pasadas, completadas, canceladas, no asistidas o pendientes antiguas.',
      empty: 'No hay registros en el historial con los filtros actuales',
    },
  };

  const terminalEstados = new Set(['Completada', 'Cancelada', 'No_asistio']);
  const stateSummary = estados.map((estado) => ({
    ...estado,
    count: citas.filter((cita) => cita.estado_id === estado.id || cita.estado_nombre === estado.nombre).length,
  }));

  const handleFilterChange = (newFilters: typeof filters) => {
    if (JSON.stringify(filters) === JSON.stringify(newFilters)) return;
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleViewChange = (view: CitasView) => {
    if (activeView === view) return;
    setActiveView(view);
    setSelectedEstadoId(0);
    setFilters((prev) => ({ ...prev, fechaInicio: '', fechaFin: '', estadoId: 0 }));
    setCurrentPage(1);
  };

  const handleEstadoQuickFilter = (estadoId: number) => {
    setSelectedEstadoId(estadoId);
    setFilters((prev) => ({ ...prev, estadoId }));
    setCurrentPage(1);
  };

  const handleCreateCita = async (data: any) => {
    try {
      setModalLoading(true);
      await citaService.create(data);
      await loadCitas();
      setModalOpen(false);
    } catch (error) {
      console.error('Error creating cita:', error);
      throw error;
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateCita = async (data: any) => {
    if (!selectedCita) return;
    try {
      setModalLoading(true);
      await citaService.update(selectedCita.id, data);
      await loadCitas();
      setModalOpen(false);
      setSelectedCita(null);
    } catch (error) {
      console.error('Error updating cita:', error);
      throw error;
    } finally {
      setModalLoading(false);
    }
  };

  const handleCancelCita = async (motivo: string) => {
    if (!selectedCita) return;
    try {
      setModalLoading(true);
      await citaService.cancel(selectedCita.id, motivo);
      await loadCitas();
      setCancelModalOpen(false);
      setSelectedCita(null);
    } catch (error) {
      console.error('Error cancelling cita:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCompleteCita = async (cita: Cita) => {
    if (!window.confirm(`¿Marcar la cita #${cita.id} como completada?`)) return;
    try {
      await citaService.complete(cita.id);
      await loadCitas();
    } catch (error) {
      console.error('Error completing cita:', error);
    }
  };

  const headerRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  };

  const viewTabsStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '999px',
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)',
  };

  const viewTabStyle = (active: boolean): React.CSSProperties => ({
    border: active ? `1px solid ${colors.negroSuave}` : '1px solid transparent',
    backgroundColor: active ? colors.negroSuave : 'transparent',
    color: active ? '#FFFFFF' : colors.azulAcero,
    borderRadius: '999px',
    padding: '10px 16px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 700,
    fontSize: '14px',
  });

  const contextPanelStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '16px',
    padding: '18px 20px',
    marginBottom: '18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)',
  };

  const quickFiltersStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    alignItems: 'center',
  };

  const quickFilterButtonStyle = (active: boolean): React.CSSProperties => ({
    border: active ? `1px solid ${colors.doradoClasico}` : '1px solid #E2E8F0',
    backgroundColor: active ? '#FFF7E0' : '#FFFFFF',
    color: active ? colors.doradoClasico : colors.azulAcero,
    borderRadius: '999px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '13px',
  });

  if (loading && citas.length === 0) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '32px' }} />
          <p>Cargando citas...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={headerRowStyle}>
        <h1 style={titleStyle}>
          <FontAwesomeIcon icon={faCalendarCheck} style={{ color: colors.doradoClasico }} />
          Gestion de Citas
        </h1>

        <div style={viewTabsStyle} aria-label="Vista de citas">
          <button style={viewTabStyle(activeView === 'proximas')} onClick={() => handleViewChange('proximas')}>
            <FontAwesomeIcon icon={faCalendarDay} />
            Proximas
          </button>
          <button style={viewTabStyle(activeView === 'historial')} onClick={() => handleViewChange('historial')}>
            <FontAwesomeIcon icon={faHistory} />
            Historial
          </button>
        </div>
      </div>

      <div style={contextPanelStyle}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: colors.doradoClasico, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {viewCopy[activeView].label}
          </div>
          <h2 style={{ margin: '6px 0', fontSize: '22px', color: colors.negroSuave }}>{viewCopy[activeView].title}</h2>
          <p style={{ margin: 0, color: colors.azulAcero }}>{viewCopy[activeView].description}</p>
        </div>
      </div>

      {activeView === 'historial' && (
        <div style={{ ...contextPanelStyle, padding: '14px 16px' }}>
          <div style={{ color: colors.azulAcero, fontWeight: 700 }}>Clasificar por estado</div>
          <div style={quickFiltersStyle}>
            <button style={quickFilterButtonStyle(selectedEstadoId === 0)} onClick={() => handleEstadoQuickFilter(0)}>
              Todos
            </button>
            {stateSummary.map((estado) => (
              <button
                key={estado.id}
                style={quickFilterButtonStyle(selectedEstadoId === estado.id)}
                onClick={() => handleEstadoQuickFilter(estado.id)}
                title={terminalEstados.has(estado.nombre) ? 'Estado terminal' : 'Estado abierto'}
              >
                {estado.nombre.replace('_', ' ')} {estado.count > 0 ? `(${estado.count})` : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      <CitaFilters
        key={activeView}
        onFilterChange={handleFilterChange}
        barberos={barberos}
        estados={estados}
        estadoIdValue={selectedEstadoId}
        onEstadoChange={setSelectedEstadoId}
      />

      <CitasTable
        citas={citas}
        loading={loading}
        onView={(cita) => {
          setSelectedCita(cita);
          setDetailsModalOpen(true);
        }}
        onEdit={(cita) => {
          setSelectedCita(cita);
          setModalOpen(true);
        }}
        onCancel={(cita) => {
          setSelectedCita(cita);
          setCancelModalOpen(true);
        }}
        onComplete={handleCompleteCita}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        emptyMessage={viewCopy[activeView].empty}
      />

      <CitaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={selectedCita ? handleUpdateCita : handleCreateCita}
        cita={selectedCita}
        loading={modalLoading}
        barberos={barberos}
        servicios={servicios}
        estados={estados}
      />

      <CitaDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        cita={selectedCita}
      />

      <CancelCitaModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelCita}
        citaInfo={selectedCita || undefined}
        loading={modalLoading}
      />
    </AdminLayout>
  );
};
