// src/pages/admin/AdminUsers.tsx
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
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
  const [totalUsers, setTotalUsers] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    rol: '',
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll(filters);
      setUsers(response.data);
      setTotalUsers(response.total);
    } catch (error) {
      console.error('Error loading users:', error);
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
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await userService.toggleStatus(user.id);
      await loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleSearch = (term: string) => {
    setFilters(prev => ({ ...prev, search: term, page: 1 }));
  };

  const handleFilterRole = (role: string) => {
    setFilters(prev => ({ ...prev, rol: role, page: 1 }));
  };

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
        totalUsers={totalUsers}
        onSearch={handleSearch}
        onFilterRole={handleFilterRole}
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