import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faSpinner,
  faPlus,
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

  const [filters, setFilters] = useState({
    q: '',
    telefono: '',
    fechaInicio: '',
    fechaFin: '',
    estadoId: 0,
    barberoId: 0,
  });

  // 🔹 Cargar datos base (una sola vez)
  useEffect(() => {
    loadBarberos();
    loadServicios();
  }, []);

  // 🔹 Cargar citas con debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadCitas();
    }, 400);

    return () => clearTimeout(timeout);
  }, [currentPage, filters]);

  const loadCitas = async () => {
    try {
      setLoading(true);

      const response = await citaService.search({
        ...filters,
        page: currentPage,
        limit: 15,
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
        id: b.id, // ⚠️ asegúrate que sea "id" y no "barbero_id"
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

  // 🔹 Evitar renders innecesarios
  const handleFilterChange = (newFilters: typeof filters) => {
    if (JSON.stringify(filters) === JSON.stringify(newFilters)) return;
    setFilters(newFilters);
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
      <h1>
        <FontAwesomeIcon icon={faCalendarCheck} /> Gestión de Citas
      </h1>

      <p>Total: {totalItems} | Página {currentPage} de {totalPages}</p>

      <CitaFilters
        onFilterChange={handleFilterChange}
        barberos={barberos}
        estados={[
          { id: 1, nombre: 'Pendiente' },
          { id: 2, nombre: 'Confirmada' },
          { id: 3, nombre: 'Completada' },
          { id: 4, nombre: 'Cancelada' },
          { id: 5, nombre: 'No_asistio' },
        ]}
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
        onPageChange={setCurrentPage}
      />

      <CitaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={selectedCita ? handleUpdateCita : handleCreateCita}
        cita={selectedCita}
        loading={modalLoading}
        barberos={barberos}
        servicios={servicios}
        estados={[]}
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