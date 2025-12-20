import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCustomConfirm } from '../components/CustomConfirm';

export default function UsersList() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showConfirm, ConfirmComponent } = useCustomConfirm();

    // State
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('Todos');
    const [currentPage, setCurrentPage] = useState(1);
    const [openMenuId, setOpenMenuId] = useState(null);
    const itemsPerPage = 10;

    // Check if user has admin access
    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }
        loadUsers();
    }, [isAdmin, navigate]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await usersAPI.list();
            setUsers(data);
        } catch (err) {
            console.error('Error loading users:', err);
            setError('Erro ao carregar usuários. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Filter users
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesSearch =
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole = roleFilter === 'Todos' || u.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleRoleFilterChange = (role) => {
        setRoleFilter(role);
        setCurrentPage(1);
    };

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const handleCreateUser = () => {
        navigate('/users/create');
    };

    const handleEditUser = (id) => {
        navigate(`/users/edit/${id}`);
    };

    const handleDeleteUser = async (userToDelete) => {
        if (userToDelete.id === user.id) {
            setError('Você não pode excluir sua própria conta.');
            return;
        }

        showConfirm({
            title: 'Excluir Usuário',
            message: `Tem certeza que deseja excluir o usuário "${userToDelete.name}"? Esta ação não pode ser desfeita.`,
            type: 'danger',
            confirmText: 'Sim, Excluir',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                try {
                    await usersAPI.delete(userToDelete.id);
                    await loadUsers();
                    const newTotalPages = Math.ceil((users.length - 1) / itemsPerPage);
                    if (currentPage > newTotalPages && newTotalPages > 0) {
                        setCurrentPage(newTotalPages);
                    }
                } catch (err) {
                    console.error('Error deleting user:', err);
                    setError('Erro ao excluir usuário. Tente novamente.');
                }
            }
        });
    };

    // Helper functions
    const getRoleLabel = (role) => {
        const roleMap = {
            'ADMIN': 'Administrador',
            'MANAGER': 'Gerente',
            'MEMBER': 'Membro'
        };
        return roleMap[role] || role;
    };

    const getRoleBadge = (role) => {
        const badgeMap = {
            'ADMIN': 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 ring-purple-600/20',
            'MANAGER': 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 ring-blue-600/20',
            'MEMBER': 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 ring-green-600/20'
        };
        return badgeMap[role] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    };

    const getStatusBadge = (isActive) => {
        return isActive
            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Nunca';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (!isAdmin) {
        return null;
    }

    return (
        <>
            <ConfirmComponent />
            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
                    {/* Page Heading */}
                    <div className="flex flex-wrap justify-between items-end gap-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                                Usuários
                            </h1>
                            <p className="text-base font-normal text-slate-500 dark:text-text-secondary">
                                Gerencie usuários, permissões e controle de acesso do sistema.
                            </p>
                        </div>
                        <button
                            onClick={handleCreateUser}
                            className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold leading-normal shadow-lg shadow-blue-500/20"
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span className="truncate">Novo Usuário</span>
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                            <div className="flex">
                                <span className="material-symbols-outlined text-red-400">error</span>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between bg-gray-100 dark:bg-surface-dark p-2 rounded-xl border border-gray-200 dark:border-border-dark">
                        {/* Search */}
                        <div className="flex w-full lg:max-w-md items-center rounded-lg bg-white dark:bg-[#233648] h-10 border border-transparent focus-within:border-primary transition-colors">
                            <div className="text-gray-400 dark:text-text-secondary pl-3 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </div>
                            <input
                                className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-text-secondary focus:ring-0 text-sm h-full px-3"
                                placeholder="Buscar por nome ou email..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>

                        {/* Role Filter */}
                        <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
                            {['Todos', 'ADMIN', 'MANAGER', 'MEMBER'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => handleRoleFilterChange(role)}
                                    className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-3 border transition-colors ${roleFilter === role
                                        ? 'bg-primary border-primary text-white'
                                        : 'bg-white dark:bg-[#233648] border-gray-200 dark:border-border-dark text-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-[#324d67]'
                                        }`}
                                >
                                    <span className="text-xs font-medium">{role === 'Todos' ? 'Todos' : getRoleLabel(role)}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="w-full">
                        <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-border-dark bg-white dark:bg-[#192633] shadow-xl shadow-black/5 dark:shadow-black/20">
                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="text-center">
                                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                                        <p className="mt-4 text-gray-500 dark:text-gray-400">Carregando usuários...</p>
                                    </div>
                                </div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <span className="material-symbols-outlined text-gray-400 dark:text-gray-600" style={{ fontSize: '64px' }}>person_off</span>
                                    <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Nenhum usuário encontrado</p>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {searchTerm || roleFilter !== 'Todos'
                                            ? 'Tente ajustar os filtros de busca'
                                            : 'Comece criando o primeiro usuário'}
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-[#233648] border-b border-gray-200 dark:border-border-dark">
                                                <th className="px-6 py-4 text-gray-500 dark:text-text-secondary text-xs font-semibold uppercase tracking-wider">
                                                    Usuário
                                                </th>
                                                <th className="px-6 py-4 text-gray-500 dark:text-text-secondary text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
                                                    Email
                                                </th>
                                                <th className="px-6 py-4 text-gray-500 dark:text-text-secondary text-xs font-semibold uppercase tracking-wider">
                                                    Função
                                                </th>
                                                <th className="px-6 py-4 text-gray-500 dark:text-text-secondary text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">
                                                    Último Acesso
                                                </th>
                                                <th className="px-6 py-4 text-gray-500 dark:text-text-secondary text-xs font-semibold uppercase tracking-wider text-right">
                                                    Ações
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-border-dark">
                                            {paginatedUsers.map((u) => (
                                                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-[#233648]/50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                                                                {getInitials(u.name)}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                                    {u.name}
                                                                    {u.id === user.id && (
                                                                        <span className="ml-2 text-xs text-primary">(Você)</span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-gray-500 dark:text-text-secondary md:hidden">
                                                                    {u.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 hidden md:table-cell">
                                                        <p className="text-sm text-gray-500 dark:text-text-secondary">{u.email}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getRoleBadge(u.role)}`}>
                                                            {getRoleLabel(u.role)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 hidden lg:table-cell">
                                                        <p className="text-sm text-gray-500 dark:text-text-secondary">
                                                            {formatDate(u.updatedAt)}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="relative">
                                                            <button
                                                                onClick={() => toggleMenu(u.id)}
                                                                className="flex size-8 items-center justify-center rounded-full text-gray-400 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-[#324d67] hover:text-slate-900 dark:hover:text-white transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined">more_vert</span>
                                                            </button>
                                                            {openMenuId === u.id && (
                                                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1d2832] border border-slate-200 dark:border-[#233648] rounded-lg shadow-xl py-1 z-50">
                                                                    <button
                                                                        onClick={() => { handleEditUser(u.id); setOpenMenuId(null); }}
                                                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#2c3b4a] flex items-center gap-2"
                                                                    >
                                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                                        Editar
                                                                    </button>
                                                                    {u.id !== user.id && (
                                                                        <>
                                                                            <div className="border-t border-slate-100 dark:border-[#233648] my-1"></div>
                                                                            <button
                                                                                onClick={() => { handleDeleteUser(u); setOpenMenuId(null); }}
                                                                                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                                                            >
                                                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                                                                Excluir
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between border-t border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#192633] px-6 py-3">
                                    <div className="flex flex-1 justify-between sm:hidden">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center rounded-md border border-gray-300 dark:border-border-dark bg-white dark:bg-[#233648] px-4 py-2 text-sm font-medium ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 dark:text-text-secondary hover:bg-gray-50 dark:hover:bg-[#324d67]'}`}
                                        >
                                            Anterior
                                        </button>
                                        <span className="flex items-center text-sm text-gray-500 dark:text-text-secondary">
                                            {currentPage} / {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-border-dark bg-white dark:bg-[#233648] px-4 py-2 text-sm font-medium ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 dark:text-text-secondary hover:bg-gray-50 dark:hover:bg-[#324d67]'}`}
                                        >
                                            Próximo
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-text-secondary">
                                                Mostrando <span className="font-medium text-slate-900 dark:text-white">{filteredUsers.length === 0 ? 0 : startIndex + 1}</span> a{' '}
                                                <span className="font-medium text-slate-900 dark:text-white">{Math.min(endIndex, filteredUsers.length)}</span> de{' '}
                                                <span className="font-medium text-slate-900 dark:text-white">{filteredUsers.length}</span> usuários
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-border-dark ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 dark:text-text-secondary hover:bg-gray-50 dark:hover:bg-[#324d67]'}`}
                                            >
                                                Anterior
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-border-dark ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 dark:text-text-secondary hover:bg-gray-50 dark:hover:bg-[#324d67]'}`}
                                            >
                                                Próximo
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
