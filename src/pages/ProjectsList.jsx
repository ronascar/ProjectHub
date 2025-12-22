import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectsAPI, clientsAPI } from '../services/api';
import { useCustomConfirm } from '../components/CustomConfirm';
import TeamManagementModal from '../components/TeamManagementModal';

export default function ProjectsList() {
    const navigate = useNavigate();
    const { showConfirm, ConfirmComponent } = useCustomConfirm();

    // State
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [currentPage, setCurrentPage] = useState(1);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [teamModalProject, setTeamModalProject] = useState(null);
    const itemsPerPage = 5;

    // Load projects from API
    useEffect(() => {
        loadProjects();
        loadClients();
    }, []);

    const loadProjects = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await projectsAPI.list();
            setProjects(data);
        } catch (err) {
            console.error('Error loading projects:', err);
            setError('Erro ao carregar projetos. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const loadClients = async () => {
        try {
            const data = await clientsAPI.list();
            setClients(data);
        } catch (err) {
            console.error('Error loading clients:', err);
        }
    };

    // Filter projects
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch =
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (project.client?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

            const statusMap = {
                'Todos': true,
                'Em Andamento': project.status === 'IN_PROGRESS',
                'Atrasado': project.status === 'ON_HOLD' || (project.dueDate && new Date(project.dueDate) < new Date() && project.status !== 'COMPLETED'),
                'Concluído': project.status === 'COMPLETED',
                'Planejamento': project.status === 'PLANNING'
            };
            const matchesStatus = statusMap[statusFilter];

            return matchesSearch && matchesStatus;
        });
    }, [projects, searchTerm, statusFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (status) => {
        setStatusFilter(status);
        setCurrentPage(1);
    };

    // Pagination handlers
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    // Toggle action menu
    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    // Action handlers
    const handleViewProject = (id) => {
        navigate(`/projects/details/${id}`);
    };

    const handleEditProject = (id) => {
        navigate(`/projects/edit/${id}`);
    };

    const handleDeleteProject = async (project) => {
        showConfirm({
            title: 'Excluir Projeto',
            message: `Tem certeza que deseja excluir o projeto "${project.name}"? Esta ação não pode ser desfeita.`,
            type: 'danger',
            confirmText: 'Sim, Excluir',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                try {
                    await projectsAPI.delete(project.id);
                    // Reload projects after deletion
                    await loadProjects();
                    // Reset to first page if current page is now empty
                    const newTotalPages = Math.ceil((projects.length - 1) / itemsPerPage);
                    if (currentPage > newTotalPages && newTotalPages > 0) {
                        setCurrentPage(newTotalPages);
                    }
                } catch (err) {
                    console.error('Error deleting project:', err);
                    setError('Erro ao excluir projeto. Tente novamente.');
                }
            }
        });
    };

    // Quick update handlers
    const handleStatusChange = async (projectId, newStatus) => {
        try {
            const updatedProject = await projectsAPI.quickUpdate(projectId, { status: newStatus });
            // Update local state
            setProjects(projects.map(p => p.id === projectId ? { ...p, ...updatedProject } : p));
        } catch (err) {
            console.error('Error updating status:', err);
            setError('Erro ao atualizar status. Tente novamente.');
        }
    };

    const handleClientChange = async (projectId, newClientId) => {
        try {
            const updatedProject = await projectsAPI.quickUpdate(projectId, { clientId: newClientId });
            // Update local state
            setProjects(projects.map(p => p.id === projectId ? { ...p, ...updatedProject } : p));
        } catch (err) {
            console.error('Error updating client:', err);
            setError('Erro ao atualizar cliente. Tente novamente.');
        }
    };

    const handleManageTeam = (project) => {
        setTeamModalProject(project);
        setOpenMenuId(null);
    };

    // Helper functions
    const getStatusLabel = (status) => {
        const statusMap = {
            'PLANNING': 'Planejamento',
            'IN_PROGRESS': 'Em Andamento',
            'ON_HOLD': 'Pausado',
            'COMPLETED': 'Concluído',
            'CANCELLED': 'Cancelado'
        };
        return statusMap[status] || status;
    };

    const isProjectOverdue = (project) => {
        if (!project.dueDate || project.status === 'COMPLETED') return false;
        return new Date(project.dueDate) < new Date();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Sem prazo';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <>
            <ConfirmComponent />
            {teamModalProject && (
                <TeamManagementModal
                    project={teamModalProject}
                    onClose={() => setTeamModalProject(null)}
                    onUpdate={loadProjects}
                />
            )}
            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
                    {/* Page Heading & Primary Action */}
                    <div className="flex flex-wrap justify-between items-end gap-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                                Projetos
                            </h1>
                            <p className="text-base font-normal text-slate-500 dark:text-text-secondary">
                                Gerencie todos os seus projetos, prazos e equipes em um só lugar.
                            </p>
                        </div>
                        <Link
                            to="/projects/create"
                            className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold leading-normal shadow-lg shadow-blue-500/20"
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span className="truncate">Novo Projeto</span>
                        </Link>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <span className="material-symbols-outlined text-red-400">error</span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Toolbar: Search & Filters */}
                    <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between bg-gray-100 dark:bg-surface-dark p-2 rounded-xl border border-gray-200 dark:border-border-dark">
                        {/* Search Bar */}
                        <div className="flex w-full lg:max-w-md items-center rounded-lg bg-white dark:bg-[#233648] h-10 border border-transparent focus-within:border-primary transition-colors">
                            <div className="text-gray-400 dark:text-text-secondary pl-3 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </div>
                            <input
                                className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-text-secondary focus:ring-0 text-sm h-full px-3"
                                placeholder="Buscar por nome, cliente ou ID..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>

                        {/* Filter Chips */}
                        <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
                            {['Todos', 'Em Andamento', 'Atrasado', 'Concluído', 'Planejamento'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusFilterChange(status)}
                                    className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-3 pr-2 border transition-colors ${statusFilter === status
                                        ? 'bg-primary border-primary text-white'
                                        : 'bg-white dark:bg-[#233648] border-gray-200 dark:border-border-dark text-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-[#324d67]'
                                        }`}
                                >
                                    <span className="text-xs font-medium">{status}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Projects Table */}
                    <div className="w-full">
                        <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-border-dark bg-white dark:bg-[#192633] shadow-xl shadow-black/5 dark:shadow-black/20">
                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="text-center">
                                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                                        <p className="mt-4 text-gray-500 dark:text-gray-400">Carregando projetos...</p>
                                    </div>
                                </div>
                            ) : filteredProjects.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <span className="material-symbols-outlined text-gray-400 dark:text-gray-600" style={{ fontSize: '64px' }}>folder_off</span>
                                    <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Nenhum projeto encontrado</p>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {searchTerm || statusFilter !== 'Todos'
                                            ? 'Tente ajustar os filtros de busca'
                                            : 'Comece criando seu primeiro projeto'}
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-[#233648] border-b border-gray-200 dark:border-border-dark">
                                                <th className="px-6 py-4 text-gray-500 dark:text-text-secondary text-xs font-semibold uppercase tracking-wider w-[20%]">
                                                    Nome do Projeto
                                                </th>
                                                <th className="px-6 py-4 text-gray-500 dark:text-text-secondary text-xs font-semibold uppercase tracking-wider w-[12%] hidden sm:table-cell">
                                                    Cliente
                                                </th>
                                                <th className="px-6 py-4 text-gray-500 dark:text-text-secondary text-xs font-semibold uppercase tracking-wider w-[12%] hidden lg:table-cell">
                                                    Equipe
                                                </th>
                                                <th className="px-6 py-4 text-gray-500 dark:text-text-secondary text-xs font-semibold uppercase tracking-wider w-[15%]">
                                                    Progresso
                                                </th>
                                                <th className="px-6 py-4 text-gray-500 dark:text-text-secondary text-xs font-semibold uppercase tracking-wider w-[13%]">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-gray-500 dark:text-text-secondary text-xs font-semibold uppercase tracking-wider w-[13%] hidden md:table-cell">
                                                    Prazo
                                                </th>
                                                <th className="px-6 py-4 text-gray-500 dark:text-text-secondary text-xs font-semibold uppercase tracking-wider w-[10%] text-right">
                                                    Ações
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-border-dark">
                                            {paginatedProjects.map((project) => {
                                                const isOverdue = isProjectOverdue(project);
                                                return (
                                                    <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-[#233648]/50 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className="p-2 rounded-lg"
                                                                    style={{
                                                                        backgroundColor: `${project.color}20`,
                                                                        color: project.color
                                                                    }}
                                                                >
                                                                    <span className="material-symbols-outlined">folder</span>
                                                                </div>
                                                                <div>
                                                                    <Link
                                                                        to={`/projects/details/${project.id}`}
                                                                        className="text-sm font-medium leading-normal text-slate-900 dark:text-white group-hover:text-primary transition-colors cursor-pointer block"
                                                                    >
                                                                        {project.name}
                                                                    </Link>
                                                                    <p className="text-xs mt-0.5 text-gray-500 dark:text-text-secondary md:hidden">
                                                                        {project.client?.name || 'Sem cliente'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 hidden sm:table-cell">
                                                            <select
                                                                value={project.client?.id || ''}
                                                                onChange={(e) => handleClientChange(project.id, e.target.value)}
                                                                className="text-sm bg-transparent border-none text-gray-500 dark:text-text-secondary hover:text-slate-900 dark:hover:text-white focus:ring-0 cursor-pointer p-0 [&>option]:bg-white [&>option]:dark:bg-gray-800 [&>option]:text-slate-900 [&>option]:dark:text-white"
                                                            >
                                                                <option value="" className="bg-white dark:bg-gray-800 text-slate-900 dark:text-white">Sem cliente</option>
                                                                {clients.map(client => (
                                                                    <option key={client.id} value={client.id} className="bg-white dark:bg-gray-800 text-slate-900 dark:text-white">
                                                                        {client.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td className="px-6 py-4 hidden lg:table-cell">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex -space-x-2">
                                                                    {(project.members || []).slice(0, 3).map((member, idx) => (
                                                                        member.user.avatar ? (
                                                                            <img
                                                                                key={idx}
                                                                                src={member.user.avatar}
                                                                                alt={member.user.name}
                                                                                className="w-7 h-7 rounded-full border-2 border-white dark:border-surface-dark object-cover"
                                                                                title={member.user.name}
                                                                            />
                                                                        ) : (
                                                                            <div
                                                                                key={idx}
                                                                                className="w-7 h-7 rounded-full border-2 border-white dark:border-surface-dark bg-primary/20 flex items-center justify-center"
                                                                                title={member.user.name}
                                                                            >
                                                                                <span className="text-primary font-semibold text-xs">
                                                                                    {member.user.name.charAt(0).toUpperCase()}
                                                                                </span>
                                                                            </div>
                                                                        )
                                                                    ))}
                                                                    {(project.members || []).length > 3 && (
                                                                        <div className="w-7 h-7 rounded-full border-2 border-white dark:border-surface-dark bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                                                                                +{(project.members || []).length - 3}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <button
                                                                    onClick={() => handleManageTeam(project)}
                                                                    className="p-1 text-gray-400 hover:text-primary transition-colors"
                                                                    title="Gerenciar equipe"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px]">group_add</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col gap-1.5 w-full max-w-[140px]">
                                                                <div className="flex justify-between text-xs">
                                                                    <span className="font-medium text-slate-900 dark:text-white">{project.progress || 0}%</span>
                                                                </div>
                                                                <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-[#324d67] overflow-hidden">
                                                                    <div
                                                                        className={`h-full rounded-full ${(project.progress || 0) >= 75 ? 'bg-green-500' :
                                                                            (project.progress || 0) >= 50 ? 'bg-primary' :
                                                                                (project.progress || 0) >= 25 ? 'bg-orange-500' :
                                                                                    'bg-red-500'
                                                                            }`}
                                                                        style={{ width: `${project.progress || 0}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <select
                                                                value={project.status}
                                                                onChange={(e) => handleStatusChange(project.id, e.target.value)}
                                                                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset border-none cursor-pointer [&>option]:bg-white [&>option]:dark:bg-gray-800 [&>option]:text-slate-900 [&>option]:dark:text-white ${project.status === 'COMPLETED' ? 'bg-green-400/10 text-green-400 ring-green-400/30' :
                                                                        isOverdue ? 'bg-red-400/10 text-red-400 ring-red-400/30' :
                                                                            project.status === 'PLANNING' ? 'bg-orange-400/10 text-orange-400 ring-orange-400/30' :
                                                                                'bg-blue-400/10 text-blue-400 ring-blue-400/30'
                                                                    }`}
                                                            >
                                                                <option value="PLANNING" className="bg-white dark:bg-gray-800 text-slate-900 dark:text-white">Planejamento</option>
                                                                <option value="IN_PROGRESS" className="bg-white dark:bg-gray-800 text-slate-900 dark:text-white">Em Andamento</option>
                                                                <option value="ON_HOLD" className="bg-white dark:bg-gray-800 text-slate-900 dark:text-white">Pausado</option>
                                                                <option value="REVIEW" className="bg-white dark:bg-gray-800 text-slate-900 dark:text-white">Em Revisão</option>
                                                                <option value="COMPLETED" className="bg-white dark:bg-gray-800 text-slate-900 dark:text-white">Concluído</option>
                                                                <option value="CANCELLED" className="bg-white dark:bg-gray-800 text-slate-900 dark:text-white">Cancelado</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-6 py-4 hidden md:table-cell">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`material-symbols-outlined text-[18px] ${isOverdue ? 'text-red-400' : 'text-gray-400 dark:text-text-secondary'}`}>
                                                                    calendar_today
                                                                </span>
                                                                <span className={`text-sm ${isOverdue ? 'text-red-400 font-medium' : 'text-gray-500 dark:text-text-secondary'}`}>
                                                                    {formatDate(project.dueDate)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="relative">
                                                                <button
                                                                    onClick={() => toggleMenu(project.id)}
                                                                    className="flex size-8 items-center justify-center rounded-full text-gray-400 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-[#324d67] hover:text-slate-900 dark:hover:text-white transition-colors"
                                                                >
                                                                    <span className="material-symbols-outlined">more_vert</span>
                                                                </button>
                                                                {openMenuId === project.id && (
                                                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1d2832] border border-slate-200 dark:border-[#233648] rounded-lg shadow-xl py-1 z-50">
                                                                        <button
                                                                            onClick={() => { handleViewProject(project.id); setOpenMenuId(null); }}
                                                                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#2c3b4a] flex items-center gap-2"
                                                                        >
                                                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                                            Visualizar
                                                                        </button>
                                                                        <button
                                                                            onClick={() => { handleEditProject(project.id); setOpenMenuId(null); }}
                                                                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#2c3b4a] flex items-center gap-2"
                                                                        >
                                                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                                                            Editar
                                                                        </button>
                                                                        <button
                                                                            onClick={() => { handleManageTeam(project); }}
                                                                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#2c3b4a] flex items-center gap-2"
                                                                        >
                                                                            <span className="material-symbols-outlined text-[18px]">group</span>
                                                                            Gerenciar Equipe
                                                                        </button>
                                                                        <div className="border-t border-slate-100 dark:border-[#233648] my-1"></div>
                                                                        <button
                                                                            onClick={() => { handleDeleteProject(project); setOpenMenuId(null); }}
                                                                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                                                        >
                                                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                                                            Excluir
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {/* Pagination */}
                            {totalPages > 0 && (
                                <div className="flex items-center justify-between border-t border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#192633] px-6 py-3">
                                    {/* Mobile pagination */}
                                    <div className="flex flex-1 justify-between sm:hidden">
                                        <button
                                            onClick={goToPreviousPage}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center rounded-md border border-gray-300 dark:border-border-dark bg-white dark:bg-[#233648] px-4 py-2 text-sm font-medium transition-colors ${currentPage === 1 ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-700 dark:text-text-secondary hover:bg-gray-50 dark:hover:bg-[#324d67]'}`}
                                        >
                                            Anterior
                                        </button>
                                        <span className="flex items-center text-sm text-gray-500 dark:text-text-secondary">
                                            {currentPage} / {totalPages}
                                        </span>
                                        <button
                                            onClick={goToNextPage}
                                            disabled={currentPage === totalPages}
                                            className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-border-dark bg-white dark:bg-[#233648] px-4 py-2 text-sm font-medium transition-colors ${currentPage === totalPages ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-700 dark:text-text-secondary hover:bg-gray-50 dark:hover:bg-[#324d67]'}`}
                                        >
                                            Próximo
                                        </button>
                                    </div>
                                    {/* Desktop pagination */}
                                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-text-secondary">
                                                Mostrando <span className="font-medium text-slate-900 dark:text-white">{filteredProjects.length === 0 ? 0 : startIndex + 1}</span> a{' '}
                                                <span className="font-medium text-slate-900 dark:text-white">{Math.min(endIndex, filteredProjects.length)}</span> de{' '}
                                                <span className="font-medium text-slate-900 dark:text-white">{filteredProjects.length}</span> projetos
                                            </p>
                                        </div>
                                        <div>
                                            <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                                {/* Previous button */}
                                                <button
                                                    onClick={goToPreviousPage}
                                                    disabled={currentPage === 1}
                                                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-300 dark:ring-border-dark focus:z-20 focus:outline-offset-0 transition-colors ${currentPage === 1 ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed bg-gray-100 dark:bg-[#1a2836]' : 'text-gray-400 dark:text-text-secondary hover:bg-gray-50 dark:hover:bg-[#324d67]'}`}
                                                >
                                                    <span className="sr-only">Anterior</span>
                                                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                                </button>
                                                {/* Page numbers */}
                                                {getPageNumbers().map((page, index) => (
                                                    page === '...' ? (
                                                        <span
                                                            key={`ellipsis-${index}`}
                                                            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-text-secondary ring-1 ring-inset ring-gray-300 dark:ring-border-dark"
                                                        >
                                                            ...
                                                        </span>
                                                    ) : (
                                                        <button
                                                            key={page}
                                                            onClick={() => goToPage(page)}
                                                            aria-current={currentPage === page ? 'page' : undefined}
                                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 transition-colors ${currentPage === page
                                                                ? 'z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                                                                : 'text-gray-700 dark:text-text-secondary ring-1 ring-inset ring-gray-300 dark:ring-border-dark hover:bg-gray-50 dark:hover:bg-[#324d67]'
                                                                }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    )
                                                ))}
                                                {/* Next button */}
                                                <button
                                                    onClick={goToNextPage}
                                                    disabled={currentPage === totalPages}
                                                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 dark:ring-border-dark focus:z-20 focus:outline-offset-0 transition-colors ${currentPage === totalPages ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed bg-gray-100 dark:bg-[#1a2836]' : 'text-gray-400 dark:text-text-secondary hover:bg-gray-50 dark:hover:bg-[#324d67]'}`}
                                                >
                                                    <span className="sr-only">Próximo</span>
                                                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                                </button>
                                            </nav>
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
