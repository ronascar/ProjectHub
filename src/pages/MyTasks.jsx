import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { tasksAPI, projectsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyTasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [activeFilters, setActiveFilters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        loadTasks();
        loadProjects();
    }, []);

    const loadTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await tasksAPI.list();
            setTasks(data);
        } catch (err) {
            console.error('Error loading tasks:', err);
            setError('Erro ao carregar tarefas. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const loadProjects = async () => {
        try {
            const data = await projectsAPI.list();
            setProjects(data);
        } catch (err) {
            console.error('Error loading projects:', err);
        }
    };

    const toggleFilter = (filter) => {
        setActiveFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setActiveFilters([]);
        setSearchTerm('');
        setSelectedProject('');
        setCurrentPage(1);
    };

    const handleToggleComplete = async (task) => {
        try {
            const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
            await tasksAPI.update(task.id, { status: newStatus });
            await loadTasks();
        } catch (err) {
            console.error('Error updating task:', err);
            setError('Erro ao atualizar tarefa.');
        }
    };

    // Filter tasks
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            // Search filter
            const matchesSearch = !searchTerm ||
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchTerm.toLowerCase());

            // Project filter
            const matchesProject = !selectedProject || task.projectId === selectedProject;

            // Active filters
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
            if (taskDueDate) taskDueDate.setHours(0, 0, 0, 0);

            const matchesDueToday = !activeFilters.includes('dueToday') ||
                (taskDueDate && taskDueDate.getTime() === today.getTime());

            const matchesHighPriority = !activeFilters.includes('highPriority') ||
                (task.priority === 'URGENT' || task.priority === 'HIGH');

            const matchesOverdue = !activeFilters.includes('overdue') ||
                (taskDueDate && taskDueDate < today && task.status !== 'DONE');

            const matchesAssignedToMe = !activeFilters.includes('assignedToMe') ||
                task.assigneeId === user?.id;

            return matchesSearch && matchesProject && matchesDueToday &&
                matchesHighPriority && matchesOverdue && matchesAssignedToMe;
        });
    }, [tasks, searchTerm, selectedProject, activeFilters, user]);

    // Pagination
    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    // Helper functions
    const getPriorityLabel = (priority) => {
        const map = {
            'URGENT': 'Urgente',
            'HIGH': 'Alta',
            'MEDIUM': 'Média',
            'LOW': 'Baixa'
        };
        return map[priority] || priority;
    };

    const getPriorityColor = (priority) => {
        const map = {
            'URGENT': 'bg-red-500/10 text-red-500',
            'HIGH': 'bg-orange-500/10 text-orange-500',
            'MEDIUM': 'bg-yellow-500/10 text-yellow-500',
            'LOW': 'bg-green-500/10 text-green-500'
        };
        return map[priority] || 'bg-gray-500/10 text-gray-500';
    };

    const getStatusLabel = (status) => {
        const map = {
            'TODO': 'A Fazer',
            'IN_PROGRESS': 'Em Andamento',
            'IN_REVIEW': 'Em Revisão',
            'DONE': 'Concluída',
            'CANCELLED': 'Cancelada'
        };
        return map[status] || status;
    };

    const getStatusColor = (status) => {
        const map = {
            'TODO': 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
            'IN_PROGRESS': 'border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
            'IN_REVIEW': 'border-purple-200 dark:border-purple-900/30 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
            'DONE': 'border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
            'CANCELLED': 'border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
        };
        return map[status] || 'border-gray-200 bg-gray-100 text-gray-600';
    };

    const formatDueDate = (dateString) => {
        if (!dateString) return 'Sem prazo';

        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        date.setHours(0, 0, 0, 0);

        if (date.getTime() === today.getTime()) return 'Hoje';
        if (date.getTime() === tomorrow.getTime()) return 'Amanhã';

        const daysDiff = Math.floor((date - today) / (1000 * 60 * 60 * 24));
        if (daysDiff < 0) return `${Math.abs(daysDiff)}d atrasado`;
        if (daysDiff <= 7) return `Em ${daysDiff}d`;

        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    };

    const isOverdue = (task) => {
        if (!task.dueDate || task.status === 'DONE') return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
    };

    const activeTasksCount = tasks.filter(t => t.status !== 'DONE' && t.status !== 'CANCELLED').length;

    return (
        <div className="flex flex-1 justify-center py-6 px-4 sm:px-6 lg:px-8 overflow-y-auto">
            <div className="flex w-full max-w-[1024px] flex-col gap-6">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm">
                    <Link className="text-gray-500 dark:text-[#92adc9] hover:text-primary transition-colors" to="/">Área de Trabalho</Link>
                    <span className="text-gray-400 dark:text-gray-600">/</span>
                    <span className="font-medium text-slate-900 dark:text-white">Minhas Tarefas</span>
                </div>

                {/* Page Heading & Stats */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl">Minhas Tarefas</h1>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                            <p className="text-base text-gray-500 dark:text-[#92adc9]">
                                {loading ? 'Carregando...' : `${activeTasksCount} tarefas ativas restantes`}
                            </p>
                        </div>
                    </div>
                    {/* Mobile Create Button */}
                    <Link to="/tasks/create" className="sm:hidden flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white">
                        Criar Tarefa
                    </Link>
                    {/* Desktop Create Button */}
                    <Link to="/tasks/create" className="hidden sm:flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-md hover:bg-blue-600 transition-colors">
                        <span className="material-symbols-outlined text-[20px] mr-2">add</span>
                        Criar Tarefa
                    </Link>
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

                {/* Filters & Controls */}
                <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-gray-200 dark:border-border-dark">
                    {/* Top Row: Search & Dropdowns */}
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#92adc9]">search</span>
                            <input value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="h-12 w-full rounded-lg border border-gray-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#64748b] focus:border-primary focus:ring-0 outline-none" placeholder="Buscar tarefas por nome..." />
                        </div>
                        <div className="flex gap-4">
                            <div className="relative flex-1 md:w-48">
                                <select value={selectedProject} onChange={(e) => { setSelectedProject(e.target.value); setCurrentPage(1); }} className="h-12 w-full appearance-none rounded-lg border border-gray-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark px-4 text-slate-900 dark:text-white focus:border-primary focus:ring-0 outline-none cursor-pointer">
                                    <option value="">Todos os Projetos</option>
                                    {projects.map(project => (
                                        <option key={project.id} value={project.id}>{project.name}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-[#92adc9]">expand_more</span>
                            </div>
                        </div>
                    </div>
                    {/* Bottom Row: Filter Chips */}
                    <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <button onClick={() => toggleFilter('dueToday')} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${activeFilters.includes('dueToday') ? 'bg-primary text-white shadow-md' : 'border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark text-slate-700 dark:text-white hover:border-primary'}`}>
                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                            Vence Hoje
                        </button>
                        <button onClick={() => toggleFilter('highPriority')} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${activeFilters.includes('highPriority') ? 'bg-primary text-white shadow-md' : 'border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark text-slate-700 dark:text-white hover:border-primary'}`}>
                            <span className="material-symbols-outlined text-[18px]">priority_high</span>
                            Alta Prioridade
                        </button>
                        <button onClick={() => toggleFilter('overdue')} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${activeFilters.includes('overdue') ? 'bg-primary text-white shadow-md' : 'border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark text-slate-700 dark:text-white hover:border-primary'}`}>
                            <span className="material-symbols-outlined text-[18px]">warning</span>
                            Atrasadas
                        </button>
                        <button onClick={() => toggleFilter('assignedToMe')} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${activeFilters.includes('assignedToMe') ? 'bg-primary text-white shadow-md' : 'border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark text-slate-700 dark:text-white hover:border-primary'}`}>
                            <span className="material-symbols-outlined text-[18px]">person</span>
                            Atribuídas a mim
                        </button>
                        {(activeFilters.length > 0 || searchTerm || selectedProject) && (
                            <button onClick={clearFilters} className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                                <span className="material-symbols-outlined text-[18px]">close</span>
                                Limpar Filtros
                            </button>
                        )}
                    </div>
                </div>

                {/* Tasks List */}
                <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark shadow-sm">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                                <p className="mt-4 text-gray-500 dark:text-gray-400">Carregando tarefas...</p>
                            </div>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <span className="material-symbols-outlined text-gray-400 dark:text-gray-600" style={{ fontSize: '64px' }}>task_alt</span>
                            <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Nenhuma tarefa encontrada</p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {searchTerm || activeFilters.length > 0 || selectedProject
                                    ? 'Tente ajustar os filtros de busca'
                                    : 'Comece criando sua primeira tarefa'}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Table Header */}
                            <div className="hidden grid-cols-12 gap-4 border-b border-gray-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-[#92adc9] md:grid">
                                <div className="col-span-5 pl-8">Nome da Tarefa</div>
                                <div className="col-span-2">Data de Entrega</div>
                                <div className="col-span-2">Prioridade</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-1 text-right"></div>
                            </div>

                            {/* Task Items */}
                            {paginatedTasks.map((task) => {
                                const taskOverdue = isOverdue(task);
                                const project = projects.find(p => p.id === task.projectId);

                                return (
                                    <div key={task.id} className="group relative grid grid-cols-1 gap-4 border-b border-gray-200 dark:border-border-dark px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-[#1c2b3a] md:grid-cols-12 md:items-center">
                                        {/* Checkbox & Title */}
                                        <div className="col-span-1 md:col-span-5 flex items-start md:items-center gap-4">
                                            <div className="relative flex h-5 w-5 shrink-0 items-center justify-center pt-1 md:pt-0">
                                                <input
                                                    className="h-5 w-5 rounded border-2 border-gray-300 dark:border-gray-600 bg-transparent text-primary focus:ring-0 checked:bg-primary checked:border-primary cursor-pointer transition-all"
                                                    type="checkbox"
                                                    checked={task.status === 'DONE'}
                                                    onChange={() => handleToggleComplete(task)}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <Link to={`/tasks/${task.id}/edit`} className={`text-sm font-semibold group-hover:text-primary transition-colors cursor-pointer ${task.status === 'DONE' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-slate-900 dark:text-white'}`}>
                                                    {task.title}
                                                </Link>
                                                {project && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#92adc9]">
                                                        <span className="inline-block size-2 rounded-full" style={{ backgroundColor: project.color }}></span>
                                                        <span>{project.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* Due Date */}
                                        <div className="col-span-1 md:col-span-2 pl-9 md:pl-0 flex items-center gap-2">
                                            <span className="md:hidden text-xs font-medium text-gray-500 dark:text-[#92adc9] uppercase w-20">Due:</span>
                                            <div className={`flex items-center gap-2 text-sm font-medium ${taskOverdue ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {taskOverdue && <span className="material-symbols-outlined text-[18px]">calendar_today</span>}
                                                <span>{formatDueDate(task.dueDate)}</span>
                                            </div>
                                        </div>
                                        {/* Priority */}
                                        <div className="col-span-1 md:col-span-2 pl-9 md:pl-0 flex items-center gap-2">
                                            <span className="md:hidden text-xs font-medium text-gray-500 dark:text-[#92adc9] uppercase w-20">Priority:</span>
                                            <div className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-bold ${getPriorityColor(task.priority)}`}>
                                                <span className="material-symbols-outlined text-[16px] icon-fill">flag</span>
                                                {getPriorityLabel(task.priority)}
                                            </div>
                                        </div>
                                        {/* Status */}
                                        <div className="col-span-1 md:col-span-2 pl-9 md:pl-0 flex items-center gap-2">
                                            <span className="md:hidden text-xs font-medium text-gray-500 dark:text-[#92adc9] uppercase w-20">Status:</span>
                                            <div className={`flex items-center gap-2 rounded-full border px-3 py-1 ${getStatusColor(task.status)}`}>
                                                {task.status === 'IN_PROGRESS' && <span className="size-2 rounded-full bg-blue-500 animate-pulse"></span>}
                                                <span className="text-xs font-semibold">{getStatusLabel(task.status)}</span>
                                            </div>
                                        </div>
                                        {/* Actions */}
                                        <div className="absolute right-4 top-4 md:static md:col-span-1 md:flex md:justify-end">
                                            <Link to={`/tasks/${task.id}/edit`} className="flex size-8 items-center justify-center rounded-full text-gray-400 dark:text-[#92adc9] hover:bg-slate-200 dark:hover:bg-[#233648] hover:text-slate-900 dark:hover:text-white transition-colors">
                                                <span className="material-symbols-outlined">edit</span>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-background-dark">
                                    <p className="text-sm text-gray-500 dark:text-[#92adc9]">
                                        Mostrando <span className="font-medium text-slate-900 dark:text-white">{filteredTasks.length === 0 ? 0 : startIndex + 1}</span> a <span className="font-medium text-slate-900 dark:text-white">{Math.min(endIndex, filteredTasks.length)}</span> de <span className="font-medium text-slate-900 dark:text-white">{filteredTasks.length}</span> tarefas
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="flex items-center justify-center rounded-lg border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-[#92adc9] hover:bg-slate-50 dark:hover:bg-[#233648] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Anterior
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="flex items-center justify-center rounded-lg border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-[#92adc9] hover:bg-slate-50 dark:hover:bg-[#233648] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Próximo
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
