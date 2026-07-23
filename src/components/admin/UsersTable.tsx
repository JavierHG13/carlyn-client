// src/components/admin/UsersTable.tsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faCheckCircle,
  faDownload,
  faEdit,
  faEnvelope,
  faEye,
  faPhone,
  faPlus,
  faSearch,
  faTimesCircle,
  faTrash,
  faUserCircle,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import type { User } from '../../types/user';
import { colors } from '../../styles/colors';

interface UsersTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onViewDetails: (user: User) => void;
  onCreate: () => void;
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  onFilterRole: (role: string) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails,
  onCreate,
  totalUsers,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  onFilterRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');

  const roleCounts = users.reduce<Record<string, number>>((acc, user) => {
    acc[user.rol] = (acc[user.rol] || 0) + 1;
    return acc;
  }, {});
  const activeUsers = users.filter((user) => user.activo).length;
  const inactiveUsers = users.length - activeUsers;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleRoleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedRole(value);
    onFilterRole(value);
  };

  const handleExport = () => {
    const headers = ['ID', 'Nombre', 'Email', 'Telefono', 'Rol', 'Estado', 'Creado'];
    const rows = users.map((user) => [
      user.id,
      user.nombre,
      user.email,
      user.telefono || '',
      user.rol,
      user.activo ? 'Activo' : 'Inactivo',
      formatDate(user.created_at),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'usuarios_barberia_carlyn.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getRoleBadge = (rol: string) => {
    const roleColors: Record<string, { color: string; bg: string; border: string }> = {
      Admin: { color: '#B42318', bg: '#FEF3F2', border: '#FECDCA' },
      Barbero: { color: '#067647', bg: '#ECFDF3', border: '#ABEFC6' },
      Cliente: { color: '#175CD3', bg: '#EFF8FF', border: '#B2DDFF' },
    };

    const config = roleColors[rol] || { color: '#475467', bg: '#F2F4F7', border: '#E4E7EC' };

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 10px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 700,
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
      }}>
        {rol}
      </span>
    );
  };

  const getStatusBadge = (activo: boolean) => (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 10px',
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 700,
      backgroundColor: activo ? '#ECFDF3' : '#FEF3F2',
      color: activo ? '#067647' : '#B42318',
      border: activo ? '1px solid #ABEFC6' : '1px solid #FECDCA',
    }}>
      <FontAwesomeIcon icon={activo ? faCheckCircle : faTimesCircle} style={{ fontSize: 11 }} />
      {activo ? 'Activo' : 'Inactivo'}
    </span>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1);

  const containerStyle: React.CSSProperties = {
    width: '100%',
  };

  const headerCardStyle: React.CSSProperties = {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 22,
    padding: '24px',
    marginBottom: 20,
    boxShadow: '0 16px 36px rgba(15, 23, 42, 0.06)',
  };

  const headerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'minmax(260px, 1fr) minmax(420px, auto)',
    alignItems: 'center',
    gap: 20,
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontFamily: 'Playfair Display, serif',
    fontSize: 28,
    fontWeight: 700,
    color: colors.negroSuave,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  };

  const subtitleStyle: React.CSSProperties = {
    margin: '8px 0 0',
    color: '#667085',
    fontSize: 15,
  };

  const filtersStyle: React.CSSProperties = {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  };

  const searchContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: '0 14px',
    borderRadius: 12,
    width: 340,
    height: 44,
    border: '1px solid #D9E1EC',
  };

  const searchInputStyle: React.CSSProperties = {
    border: 'none',
    background: 'none',
    outline: 'none',
    marginLeft: 10,
    width: '100%',
    fontSize: 14,
    color: '#101828',
  };

  const selectStyle: React.CSSProperties = {
    height: 44,
    padding: '0 14px',
    border: '1px solid #D9E1EC',
    borderRadius: 12,
    fontSize: 14,
    outline: 'none',
    backgroundColor: '#FFFFFF',
    minWidth: 160,
  };

  const buttonStyle = (variant: 'dark' | 'gold'): React.CSSProperties => ({
    height: 44,
    padding: '0 16px',
    backgroundColor: variant === 'dark' ? colors.grafito : colors.doradoClasico,
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
    fontSize: 14,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontWeight: 800,
  });

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 14,
    marginTop: 20,
  };

  const statCardStyle: React.CSSProperties = {
    border: '1px solid #E2E8F0',
    borderRadius: 16,
    padding: '16px 18px',
    background: '#FBFCFE',
  };

  const tableContainerStyle: React.CSSProperties = {
    overflowX: 'auto',
    borderRadius: 22,
    border: '1px solid #E2E8F0',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 16px 36px rgba(15, 23, 42, 0.05)',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 1100,
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '18px 20px',
    backgroundColor: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0',
    color: '#475467',
    fontSize: 12,
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  };

  const tdStyle: React.CSSProperties = {
    padding: '18px 20px',
    borderBottom: '1px solid #EEF2F6',
    fontSize: 14,
    color: '#102A43',
    verticalAlign: 'middle',
  };

  const actionButtonStyle = (color: string, bg = '#FFFFFF'): React.CSSProperties => ({
    width: 36,
    height: 36,
    borderRadius: 10,
    border: '1px solid #E2E8F0',
    backgroundColor: bg,
    color,
    cursor: 'pointer',
    fontSize: 14,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const userInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  };

  const avatarStyle: React.CSSProperties = {
    width: 46,
    height: 46,
    borderRadius: '50%',
    backgroundColor: colors.doradoClasico,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontWeight: 900,
    fontSize: 17,
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.24)',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '70px 20px',
    color: '#667085',
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 70, color: colors.azulAcero }}>
        Cargando usuarios...
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <section style={headerCardStyle}>
        <div style={headerStyle}>
          <div>
            <h2 style={titleStyle}>
              <FontAwesomeIcon icon={faUsers} style={{ color: colors.doradoClasico }} />
              Gestion de Usuarios
            </h2>
            <p style={subtitleStyle}>Administra clientes, barberos y perfiles internos desde un solo lugar.</p>
          </div>

          <div style={filtersStyle}>
            <div style={searchContainerStyle}>
              <FontAwesomeIcon icon={faSearch} style={{ color: '#98A2B3' }} />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                style={searchInputStyle}
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <select style={selectStyle} value={selectedRole} onChange={handleRoleFilter}>
              <option value="">Todos los roles</option>
              <option value="Admin">Administradores</option>
              <option value="Barbero">Barberos</option>
              <option value="Cliente">Clientes</option>
            </select>

            <button type="button" style={buttonStyle('dark')} onClick={handleExport}>
              <FontAwesomeIcon icon={faDownload} />
              Exportar
            </button>

            <button type="button" style={buttonStyle('gold')} onClick={onCreate}>
              <FontAwesomeIcon icon={faPlus} />
              Nuevo Usuario
            </button>
          </div>
        </div>

        <div style={statsGridStyle}>
          {[
            { label: 'Total visible', value: totalUsers, detail: 'usuarios registrados' },
            { label: 'Activos', value: activeUsers, detail: 'en esta pagina' },
            { label: 'Clientes', value: roleCounts.Cliente || 0, detail: 'cuentas de cliente' },
            { label: 'Barberos/Admin', value: (roleCounts.Barbero || 0) + (roleCounts.Admin || 0), detail: 'equipo interno' },
          ].map((stat) => (
            <div key={stat.label} style={statCardStyle}>
              <div style={{ color: '#667085', fontSize: 13, fontWeight: 800 }}>{stat.label}</div>
              <div style={{ color: '#101828', fontSize: 28, fontWeight: 900, marginTop: 6 }}>{stat.value}</div>
              <div style={{ color: '#98A2B3', fontSize: 13, marginTop: 3 }}>{stat.detail}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={tableContainerStyle}>
        {users.length === 0 ? (
          <div style={emptyStateStyle}>
            <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: 48, marginBottom: 16, opacity: 0.45 }} />
            <h3 style={{ marginBottom: 8, color: colors.negroSuave }}>No hay usuarios</h3>
            <p>No se encontraron usuarios con los filtros aplicados.</p>
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Usuario</th>
                <th style={thStyle}>Contacto</th>
                <th style={thStyle}>Rol</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Registro</th>
                <th style={thStyle}>Actualizacion</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={tdStyle}>
                    <div style={userInfoStyle}>
                      <div style={avatarStyle}>
                        {user.foto ? (
                          <img src={user.foto} alt={user.nombre} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          user.nombre.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#101828' }}>{user.nombre}</div>
                        <div style={{ color: '#98A2B3', fontSize: 12 }}>ID #{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'grid', gap: 7 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: 12, color: '#667085' }} />
                        <span style={{ fontSize: 13 }}>{user.email}</span>
                      </div>
                      {user.telefono && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <FontAwesomeIcon icon={faPhone} style={{ fontSize: 12, color: '#667085' }} />
                          <span style={{ fontSize: 13 }}>{user.telefono}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={tdStyle}>{getRoleBadge(user.rol)}</td>
                  <td style={tdStyle}>{getStatusBadge(user.activo)}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FontAwesomeIcon icon={faCalendar} style={{ fontSize: 12, color: '#667085' }} />
                      <span style={{ fontSize: 13 }}>{formatDate(user.created_at)}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: 13 }}>{formatDate(user.updated_at)}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 8 }}>
                      <button style={actionButtonStyle('#344054')} onClick={() => onViewDetails(user)} title="Ver detalles">
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        style={actionButtonStyle(user.activo ? '#B42318' : '#067647', user.activo ? '#FEF3F2' : '#ECFDF3')}
                        onClick={() => onToggleStatus(user)}
                        title={user.activo ? 'Desactivar' : 'Activar'}
                      >
                        <FontAwesomeIcon icon={user.activo ? faTimesCircle : faCheckCircle} />
                      </button>
                      <button style={actionButtonStyle(colors.doradoClasico)} onClick={() => onEdit(user)} title="Editar">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button style={actionButtonStyle('#EF4444', '#FEF3F2')} onClick={() => onDelete(user)} title="Eliminar">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        marginTop: 18,
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 14, color: '#667085' }}>
          Mostrando {users.length} de {totalUsers} usuarios
          {inactiveUsers > 0 ? ` · ${inactiveUsers} inactivos visibles` : ''}
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            style={{
              padding: '8px 12px',
              border: '1px solid #E2E8F0',
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
              color: currentPage <= 1 ? '#98A2B3' : '#344054',
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            Anterior
          </button>
          {pageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              style={{
                minWidth: 36,
                height: 36,
                border: page === currentPage ? `1px solid ${colors.doradoClasico}` : '1px solid #E2E8F0',
                borderRadius: 10,
                backgroundColor: page === currentPage ? colors.doradoClasico : '#FFFFFF',
                color: page === currentPage ? '#FFFFFF' : '#344054',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 900,
              }}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            style={{
              padding: '8px 12px',
              border: '1px solid #E2E8F0',
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              color: currentPage >= totalPages ? '#98A2B3' : '#344054',
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};
