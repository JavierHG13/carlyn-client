import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faPlus,
  faEdit,
  faTrash,
  faSave,
  faTimes,
  faSync,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { AdminLayout } from '../../layouts/AdminLayout';
import { colors } from '../../styles/colors';
import { localService, type Local, type LocalFormData } from '../../services/localService';

const emptyForm: LocalFormData = {
  nombre: '',
  direccion: '',
  ciudad: '',
  estado: '',
  codigo_postal: '',
  telefono: '',
  email: '',
  hora_apertura: '09:00',
  hora_cierre: '19:00',
  activo: true,
  es_principal: false,
};

export const AdminLocales: React.FC = () => {
  const [locales, setLocales] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLocal, setSelectedLocal] = useState<Local | null>(null);
  const [form, setForm] = useState<LocalFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLocales();
  }, [showInactive]);

  const loadLocales = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await localService.getAll(showInactive ? undefined : true);
      setLocales(data);
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al cargar sucursales');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setSelectedLocal(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (local: Local) => {
    setSelectedLocal(local);
    setForm({
      nombre: local.nombre || '',
      direccion: local.direccion || '',
      ciudad: local.ciudad || '',
      estado: local.estado || '',
      codigo_postal: local.codigo_postal || '',
      telefono: local.telefono || '',
      email: local.email || '',
      hora_apertura: (local.hora_apertura || '09:00').slice(0, 5),
      hora_cierre: (local.hora_cierre || '19:00').slice(0, 5),
      activo: local.activo ?? true,
      es_principal: local.es_principal ?? false,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.nombre.trim() || !form.direccion.trim()) {
      setError('Nombre y direccion son obligatorios');
      return;
    }

    try {
      setSaving(true);
      setError('');
      if (selectedLocal) {
        await localService.update(selectedLocal.id, form);
      } else {
        await localService.create(form);
      }
      setModalOpen(false);
      await loadLocales();
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'No se pudo guardar la sucursal');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (local: Local) => {
    if (!window.confirm(`¿Desactivar la sucursal "${local.nombre}"?`)) return;
    try {
      await localService.deactivate(local.id);
      await loadLocales();
    } catch (err: any) {
      alert(err.response?.data?.mensaje || 'No se pudo desactivar la sucursal');
    }
  };

  const pageStyle: React.CSSProperties = { width: '100%' };
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '24px',
  };
  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 600,
    color: colors.negroSuave,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };
  const buttonStyle = (bg: string, color = 'white'): React.CSSProperties => ({
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: bg,
    color,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 500,
  });
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  };
  const cardStyle: React.CSSProperties = {
    border: '1px solid #EDF2F7',
    borderRadius: '8px',
    padding: '18px',
    backgroundColor: 'white',
  };
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '14px',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    color: colors.azulAcero,
    fontWeight: 500,
  };
  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };
  const modalStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    width: '100%',
    maxWidth: '760px',
    maxHeight: '90vh',
    overflowY: 'auto',
  };

  return (
    <AdminLayout>
      <div style={pageStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: colors.doradoClasico }} />
            Gestión de Sucursales
          </h1>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button style={buttonStyle('#E2E8F0', '#475569')} onClick={() => setShowInactive(!showInactive)}>
              <FontAwesomeIcon icon={faSync} />
              {showInactive ? 'Solo activas' : 'Ver todas'}
            </button>
            <button style={buttonStyle(colors.doradoClasico)} onClick={openCreate}>
              <FontAwesomeIcon icon={faPlus} />
              Nueva Sucursal
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#FEE2E2', color: '#B91C1C', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>Cargando sucursales...</div>
        ) : (
          <div style={gridStyle}>
            {locales.map((local) => (
              <div key={local.id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0, color: colors.negroSuave, fontSize: '18px' }}>{local.nombre}</h3>
                    <p style={{ color: '#718096', margin: '6px 0 0', fontSize: '13px' }}>{local.direccion}</p>
                  </div>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    height: '24px',
                    padding: '0 8px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    color: local.activo ? '#047857' : '#B91C1C',
                    backgroundColor: local.activo ? '#D1FAE5' : '#FEE2E2',
                  }}>
                    <FontAwesomeIcon icon={local.activo ? faCheckCircle : faTimesCircle} />
                    {local.activo ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <div style={{ marginTop: '14px', color: '#475569', fontSize: '13px', lineHeight: 1.7 }}>
                  <div>{[local.ciudad, local.estado, local.codigo_postal].filter(Boolean).join(', ') || 'Sin ciudad registrada'}</div>
                  <div>{local.telefono || 'Sin telefono'}</div>
                  <div>{(local.hora_apertura || '').slice(0, 5)} - {(local.hora_cierre || '').slice(0, 5)}</div>
                  {local.es_principal && <strong style={{ color: colors.doradoClasico }}>Sucursal principal</strong>}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button style={buttonStyle(colors.azulAcero)} onClick={() => openEdit(local)}>
                    <FontAwesomeIcon icon={faEdit} />
                    Editar
                  </button>
                  {local.activo && (
                    <button style={buttonStyle('#EF4444')} onClick={() => handleDeactivate(local)}>
                      <FontAwesomeIcon icon={faTrash} />
                      Desactivar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {modalOpen && (
          <div style={modalOverlayStyle} onClick={() => setModalOpen(false)}>
            <form style={modalStyle} onSubmit={handleSubmit} onClick={(event) => event.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', color: colors.negroSuave }}>
                  {selectedLocal ? 'Editar Sucursal' : 'Nueva Sucursal'}
                </h2>
                <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setModalOpen(false)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {[
                  ['nombre', 'Nombre *'],
                  ['direccion', 'Dirección *'],
                  ['ciudad', 'Ciudad'],
                  ['estado', 'Estado'],
                  ['codigo_postal', 'Código postal'],
                  ['telefono', 'Teléfono'],
                  ['email', 'Email'],
                ].map(([field, label]) => (
                  <div key={field}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      style={inputStyle}
                      value={(form as any)[field] || ''}
                      onChange={(event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))}
                    />
                  </div>
                ))}
                <div>
                  <label style={labelStyle}>Hora apertura</label>
                  <input type="time" style={inputStyle} value={form.hora_apertura || '09:00'} onChange={(event) => setForm((prev) => ({ ...prev, hora_apertura: event.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Hora cierre</label>
                  <input type="time" style={inputStyle} value={form.hora_cierre || '19:00'} onChange={(event) => setForm((prev) => ({ ...prev, hora_cierre: event.target.value }))} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '18px', marginTop: '18px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!form.activo} onChange={(event) => setForm((prev) => ({ ...prev, activo: event.target.checked }))} />
                  Activa
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!form.es_principal} onChange={(event) => setForm((prev) => ({ ...prev, es_principal: event.target.checked }))} />
                  Principal
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" style={buttonStyle('#E2E8F0', '#475569')} onClick={() => setModalOpen(false)}>Cancelar</button>
                <button type="submit" style={buttonStyle(colors.doradoClasico)} disabled={saving}>
                  <FontAwesomeIcon icon={faSave} />
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
