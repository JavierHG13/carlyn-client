// src/pages/admin/AdminUsers.tsx
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { UsersTable } from '../../components/admin/UsersTable';
import { UserModal } from '../../components/admin/UserModal';
import { UserDetailsModal } from '../../components/admin/UserDetailsModal';
import { userService } from '../../services/userService';
import type { User, CreateUserData, UpdateUserData } from '../../types/user';
import { colors } from '../../styles/colors';


export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [filters, setFilters] = useState({
    search: '',
    rol: '',
    page: 1,
    limit: 10,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getAll(filters);
      
      setUsers(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages
      });
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Error al cargar los usuarios. Por favor, intenta de nuevo.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (data: CreateUserData) => {
    try {
      setModalLoading(true);
      await userService.create(data);
      await loadUsers();
      setModalOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error al crear el usuario');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateUser = async (data: UpdateUserData) => {
    if (!selectedUser) return;
    try {
      setModalLoading(true);
      await userService.update(selectedUser.id, data);
      await loadUsers();
      setModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error al actualizar el usuario');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`¿Estás seguro de eliminar al usuario ${user.nombre}?`)) return;
    
    try {
      await userService.delete(user.id);
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error al eliminar el usuario');
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await userService.toggleStatus(user.id);
      await loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Error al cambiar el estado del usuario');
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (error) {
    return (
      <AdminLayout>
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: '#FEE2E2',
          borderRadius: '12px',
          color: '#EF4444'
        }}>
          <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Error</h3>
          <p style={{ marginBottom: '24px' }}>{error}</p>
          <button 
            onClick={loadUsers}
            style={{
              padding: '10px 24px',
              backgroundColor: '#EF4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Reintentar
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <UsersTable
        users={users}
        loading={loading}
        onEdit={(user) => {
          setSelectedUser(user);
          setModalOpen(true);
        }}
        onDelete={handleDeleteUser}
        onToggleStatus={handleToggleStatus}
        onViewDetails={(user) => {
          setSelectedUser(user);
          setDetailsModalOpen(true);
        }}
        totalUsers={pagination.total}
        onSearch={(term) => setFilters(prev => ({ ...prev, search: term, page: 1 }))}
        onFilterRole={(role) => setFilters(prev => ({ ...prev, rol: role, page: 1 }))}
        onPageChange={handlePageChange}
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
      />

      <UserModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={(data) => {
          if (selectedUser) {
            handleUpdateUser(data);
          } else {
            handleCreateUser(data as CreateUserData);
          }
        }}
        user={selectedUser}
        loading={modalLoading}
      />

      <UserDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </AdminLayout>
  );
};