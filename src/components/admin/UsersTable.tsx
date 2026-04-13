// src/components/admin/UsersTable.tsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faToggleOn,
  faToggleOff,
  faEnvelope,
  faPhone,
  faCalendar,
  faCheckCircle,
  faTimesCircle,
  faSearch,
  faFilter,
  faDownload,
  faPlus,
  faEye,
  faUserCircle
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
  totalUsers: number;
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
  totalUsers,
  onSearch,
  onFilterRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

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

  const getRoleBadge = (rol: string) => {
    const roleColors: { [key: string]: { color: string; bg: string } } = {
      'Admin': { color: '#EF4444', bg: '#FEE2E2' },
      'Barbero': { color: '#10B981', bg: '#D1FAE5' },
      'Cliente': { color: '#3B82F6', bg: '#DBEAFE' },
    };

    const config = roleColors[rol] || { color: '#718096', bg: '#EDF2F7' };

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 8px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: config.bg,
        color: config.color,
      }}>
        {rol}
      </span>
    );
  };

  const getStatusBadge = (activo: boolean) => {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: activo ? '#D1FAE5' : '#FEE2E2',
        color: activo ? '#10B981' : '#EF4444',
      }}>
        <FontAwesomeIcon icon={activo ? faCheckCircle : faTimesCircle} style={{ fontSize: '10px' }} />
        {activo ? 'Activo' : 'Inactivo'}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
    fontSize: '20px',
    fontWeight: 600,
    color: colors.negroSuave,
  };

  const filtersStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const searchContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: '8px 16px',
    borderRadius: '8px',
    width: '300px',
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

  const selectStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: `1px solid #E2E8F0`,
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'white',
    minWidth: '150px',
  };

  const tableContainerStyle: React.CSSProperties = {
    overflowX: 'auto',
    borderRadius: '12px',
    border: '1px solid #EDF2F7',
    backgroundColor: 'white',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '1000px',
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '16px',
    backgroundColor: '#F8FAFC',
    borderBottom: `2px solid #EDF2F7`,
    color: '#475569',
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const tdStyle: React.CSSProperties = {
    padding: '16px',
    borderBottom: `1px solid #EDF2F7`,
    fontSize: '14px',
  };

  const actionButtonStyle = (color: string): React.CSSProperties => ({
    padding: '6px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: color,
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    margin: '0 2px',
    width: '32px',
    height: '32px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const userInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const avatarStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: colors.doradoClasico,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#718096',
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ color: colors.azulAcero, fontSize: '16px' }}>Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Gestión de Usuarios</h2>
        
        <div style={filtersStyle}>
          <div style={searchContainerStyle}>
            <FontAwesomeIcon icon={faSearch} style={{ color: '#9AA6B2' }} />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              style={searchInputStyle}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <select
            style={selectStyle}
            value={selectedRole}
            onChange={handleRoleFilter}
          >
            <option value="">Todos los roles</option>
            <option value="Admin">Administradores</option>
            <option value="Barbero">Barberos</option>
            <option value="Cliente">Clientes</option>
          </select>

          <button style={{
            padding: '8px 16px',
            backgroundColor: colors.grafito,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <FontAwesomeIcon icon={faDownload} />
            Exportar
          </button>

          <button style={{
            padding: '8px 16px',
            backgroundColor: colors.doradoClasico,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <FontAwesomeIcon icon={faPlus} />
            Nuevo Usuario
          </button>
        </div>
      </div>

      <div style={tableContainerStyle}>
        {users.length === 0 ? (
          <div style={emptyStateStyle}>
            <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
            <h3 style={{ marginBottom: '8px', color: colors.negroSuave }}>No hay usuarios</h3>
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
                <th style={thStyle}>Fecha Registro</th>
                <th style={thStyle}>Última Actualización</th>
                <th style={thStyle}>Acciones</th>
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
                        <div style={{ fontWeight: 500 }}>{user.nombre}</div>
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                        <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '12px', color: '#718096' }} />
                        <span style={{ fontSize: '13px' }}>{user.email}</span>
                      </div>
                      {user.telefono && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FontAwesomeIcon icon={faPhone} style={{ fontSize: '12px', color: '#718096' }} />
                          <span style={{ fontSize: '13px' }}>{user.telefono}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    {getRoleBadge(user.rol)}
                  </td>
                  <td style={tdStyle}>
                    {getStatusBadge(user.activo)}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FontAwesomeIcon icon={faCalendar} style={{ fontSize: '12px', color: '#718096' }} />
                      <span style={{ fontSize: '13px' }}>
                        {formatDate(user.created_at)}
                      </span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: '13px' }}>
                      {formatDate(user.updated_at)}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        style={actionButtonStyle(colors.azulAcero)}
                        onClick={() => onViewDetails(user)}
                        title="Ver detalles"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        style={actionButtonStyle(colors.doradoClasico)}
                        onClick={() => onEdit(user)}
                        title="Editar"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        style={actionButtonStyle(user.activo ? '#10B981' : '#EF4444')}
                        onClick={() => onToggleStatus(user)}
                        title={user.activo ? 'Desactivar' : 'Activar'}
                      >
                        <FontAwesomeIcon icon={user.activo ? faToggleOn : faToggleOff} />
                      </button>
                      <button
                        style={actionButtonStyle('#EF4444')}
                        onClick={() => onDelete(user)}
                        title="Eliminar"
                      >
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

      {/* Paginación */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '16px',
        marginTop: '20px',
      }}>
        <span style={{ fontSize: '14px', color: '#718096' }}>
          Mostrando {users.length} de {totalUsers} usuarios
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{
            padding: '6px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '13px',
          }}>
            Anterior
          </button>
          <button style={{
            padding: '6px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            backgroundColor: colors.doradoClasico,
            color: 'white',
            cursor: 'pointer',
            fontSize: '13px',
          }}>
            1
          </button>
          <button style={{
            padding: '6px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '13px',
          }}>
            2
          </button>
          <button style={{
            padding: '6px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '13px',
          }}>
            3
          </button>
          <button style={{
            padding: '6px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '13px',
          }}>
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};