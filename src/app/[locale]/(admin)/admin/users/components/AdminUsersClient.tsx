'use client';

import { useState } from 'react';
import { useAdminUsers, useUpdateUserRole, useDeleteUser } from '../hooks/useAdminUsers';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DynamicTable, Column } from '@/components/shared/DynamicTable';
import { Pagination } from '@/components/shared/Pagination';
import { Search, Shield, ShieldAlert, Trash2 } from 'lucide-react';
import { Role } from '@/types/user';
import { useTranslations } from 'next-intl';

export function AdminUsersClient() {
  const t = useTranslations('admin.users');
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const updateRoleMutation = useUpdateUserRole();
  const deleteMutation = useDeleteUser();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const timer = setTimeout(() => {
      setDebouncedSearch(e.target.value);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  };

  const { data, isLoading, isError } = useAdminUsers({
    page,
    limit: 10,
    role: roleFilter === 'ALL' ? undefined : roleFilter,
    search: debouncedSearch || undefined,
  });

  const handleRoleToggle = (userId: string, currentRole: Role) => {
    const newRole: Role = currentRole === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    if (window.confirm(t('confirmRoleChange', { defaultMessage: 'Are you sure you want to change this user\'s role to {role}?', role: newRole }))) {
      updateRoleMutation.mutate({ id: userId, role: newRole });
    }
  };

  const handleDelete = (userId: string) => {
    if (window.confirm(t('confirmDelete', { defaultMessage: 'Are you sure you want to delete this user? This action cannot be undone.' }))) {
      deleteMutation.mutate(userId);
    }
  };

  const columns: Column<any>[] = [
    {
      key: 'user',
      header: t('table.user', { defaultMessage: 'User' }),
      className: 'px-6 py-4 font-medium flex items-center gap-3',
      render: (user: any) => (
        <>
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
            {(user.name || user.email || '?').charAt(0).toUpperCase()}
          </div>
          {user.name || t('unnamedUser', { defaultMessage: 'Unnamed User' })}
        </>
      )
    },
    { key: 'email', header: t('table.email', { defaultMessage: 'Email' }), className: 'px-6 py-4 text-muted-foreground' },
    { key: 'phone', header: t('table.phone', { defaultMessage: 'Phone' }), className: 'px-6 py-4 text-muted-foreground', render: (user: any) => user.phone || '-' },
    { 
      key: 'joined', 
      header: t('table.joined', { defaultMessage: 'Joined' }), 
      className: 'px-6 py-4 text-muted-foreground',
      render: (user: any) => format(new Date(user.createdAt), 'MMM dd, yyyy')
    },
    {
      key: 'role',
      header: t('table.role', { defaultMessage: 'Role' }),
      className: 'px-6 py-4',
      render: (user: any) => (
        <Badge variant={user.role === 'ADMIN' ? 'default' : 'outline'} className={user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100' : ''}>
          {user.role}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: t('table.actions', { defaultMessage: 'Actions' }),
      className: 'px-6 py-4 text-center',
      render: (user: any) => (
        <div className="flex items-center justify-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            title={t('changeRole', { defaultMessage: 'Change to {role}', role: user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN' })}
            onClick={() => handleRoleToggle(user.id, user.role)}
            className={user.role === 'ADMIN' ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-100' : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100'}
            disabled={updateRoleMutation.isPending}
          >
            {user.role === 'ADMIN' ? <ShieldAlert className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            title={t('deleteUser', { defaultMessage: 'Delete User' })}
            onClick={() => handleDelete(user.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rtl:end-3 rtl:start-auto" />
          <Input 
            placeholder={t('searchPlaceholder', { defaultMessage: 'Search by name or email...' })} 
            value={search}
            onChange={handleSearchChange}
            className="ps-9"
          />
        </div>
        
        <Select value={roleFilter} onValueChange={(val) => { if(val) { setRoleFilter(val); setPage(1); } }}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t('filterRole', { defaultMessage: 'Filter by role' })} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('roles.all', { defaultMessage: 'All Roles' })}</SelectItem>
            <SelectItem value="CUSTOMER">{t('roles.customer', { defaultMessage: 'Customer' })}</SelectItem>
            <SelectItem value="ADMIN">{t('roles.admin', { defaultMessage: 'Admin' })}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DynamicTable 
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        keyExtractor={(item) => item.id}
        emptyMessage={isError ? t('errorLoading', { defaultMessage: 'Error loading users' }) : t('noUsersFound', { defaultMessage: 'No users found.' })}
      />

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
          <span className="text-sm text-muted-foreground">
            {t('pageInfo', { defaultMessage: 'Page {page} of {totalPages}', page: data.page, totalPages: data.totalPages })}
          </span>
          <Pagination 
            page={data.page} 
            totalPages={data.totalPages} 
            onPageChange={setPage} 
          />
        </div>
      )}
    </div>
  );
}
