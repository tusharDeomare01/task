'use client';

import React, { useState, useEffect } from 'react';
import { User, UserFormData } from '@/types/user';
import { userApi } from '@/lib/api';
import { UserForm } from '@/components/UserForm';
import { UserTable } from '@/components/UserTable';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { useToast } from '@/components/ui/toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const fetchUsers = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await userApi.getAll();
      setUsers(data);
    } catch (error) {
      showToast('Failed to fetch users', 'error');
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);
      const newUser = await userApi.create(data);
      setUsers((prev) => [...prev, newUser]);
      setIsFormOpen(false);
      showToast('User created successfully', 'success');
    } catch (error) {
      showToast('Failed to create user', 'error');
      console.error('Error creating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (!selectedUser) return;

    try {
      setIsSubmitting(true);
      const updatedUser = await userApi.update(selectedUser.id, data);
      setUsers((prev) =>
        prev.map((user) => (user.id === selectedUser.id ? updatedUser : user))
      );
      setIsFormOpen(false);
      setSelectedUser(null);
      showToast('User updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update user', 'error');
      console.error('Error updating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setIsSubmitting(true);
      await userApi.delete(selectedUser.id);
      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      showToast('User deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete user', 'error');
      console.error('Error deleting user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateDialog = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const closeFormDialog = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your users with ease
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Total Users: <span className="font-semibold text-gray-900">{users.length}</span>
            </p>
            <Button onClick={openCreateDialog} size="lg">
              <Plus className="w-5 h-5" />
              Add New User
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <UserTable
            users={users}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            isLoading={isLoading}
          />
        </div>

        <Dialog open={isFormOpen} onOpenChange={closeFormDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedUser ? 'Edit User' : 'Create New User'}
              </DialogTitle>
            </DialogHeader>
            <UserForm
              initialData={selectedUser || undefined}
              onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
              onCancel={closeFormDialog}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>

        <DeleteConfirmDialog
          user={selectedUser}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteUser}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
