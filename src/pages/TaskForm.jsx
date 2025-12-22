import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { tasksAPI, projectsAPI, usersAPI } from '../services/api';
import { useTasks } from '../context/TasksContext';

export default function TaskForm() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(taskId);
    const { createTask, updateTask, deleteTask } = useTasks();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        assigneeId: '',
        projectId: '',
        dueDate: ''
    });

    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    // Load initial data
    useEffect(() => {
        loadInitialData();
    }, [taskId]);

    const loadInitialData = async () => {
        try {
            setLoading(true);

            // Load projects and users
            const [projectsData, usersData] = await Promise.all([
                projectsAPI.list(),
                usersAPI.list()
            ]);

            setProjects(projectsData);
            setUsers(usersData);

            // Load task data if editing
            if (isEditing && taskId) {
                const taskData = await tasksAPI.get(taskId);
                setFormData({
                    title: taskData.title || '',
                    description: taskData.description || '',
                    status: taskData.status || 'TODO',
                    priority: taskData.priority || 'MEDIUM',
                    assigneeId: taskData.assigneeId || '',
                    projectId: taskData.projectId || '',
                    dueDate: taskData.dueDate ? taskData.dueDate.split('T')[0] : ''
                });
            }
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Erro ao carregar dados. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            setError('O título da tarefa é obrigatório.');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const taskData = {
                ...formData,
                assigneeId: formData.assigneeId || null,
                projectId: formData.projectId || null,
                dueDate: formData.dueDate || null
            };

            if (isEditing) {
                await updateTask(taskId, taskData);
            } else {
                await createTask(taskData);
            }

            // Redirect to tasks list
            navigate('/tasks');
        } catch (err) {
            console.error('Error saving task:', err);
            setError(err.message || 'Erro ao salvar tarefa. Por favor, tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
            return;
        }

        try {
            setSaving(true);
            await deleteTask(taskId);
            navigate('/tasks');
        } catch (err) {
            console.error('Error deleting task:', err);
            setError('Erro ao excluir tarefa. Por favor, tente novamente.');
            setSaving(false);
        }
    };

    // Helper functions
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
            'TODO': 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-100',
            'IN_PROGRESS': 'bg-blue-50 dark:bg-[#233648] text-blue-700 dark:text-blue-100',
            'IN_REVIEW': 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
            'DONE': 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
            'CANCELLED': 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
        };
        return map[status] || map.TODO;
    };

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
            'URGENT': 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300',
            'HIGH': 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
            'MEDIUM': 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
            'LOW': 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
        };
        return map[priority] || map.MEDIUM;
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            {/* Header & Breadcrumbs */}
            <header className="flex-shrink-0 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-border-dark px-6 py-4 flex flex-col gap-4">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm">
                    <Link to="/" className="text-gray-500 dark:text-text-secondary hover:text-primary transition-colors">Área de Trabalho</Link>
                    <span className="text-gray-400 dark:text-gray-600">/</span>
                    <Link to="/tasks" className="text-gray-500 dark:text-text-secondary hover:text-primary transition-colors">Minhas Tarefas</Link>
                    <span className="text-gray-400 dark:text-gray-600">/</span>
                    <span className="text-slate-900 dark:text-white font-medium">{isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}</span>
                </div>
                {/* Page Heading */}
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{isEditing ? 'Editar Tarefa' : 'Criar Tarefa'}</h1>
                        {isEditing && <p className="text-sm text-gray-500 dark:text-text-secondary mt-1">Tarefa #{taskId}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/tasks" className="px-4 py-2 rounded-lg border border-gray-300 dark:border-border-dark text-slate-700 dark:text-text-secondary text-sm font-medium hover:bg-gray-50 dark:hover:bg-surface-dark transition-colors">
                            Cancelar
                        </Link>
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            {saving ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Tarefa')}
                        </button>
                    </div>
                </div>
            </header>

            {/* Error Message */}
            {error && (
                <div className="mx-6 mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                    <div className="flex">
                        <span className="material-symbols-outlined text-red-400">error</span>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN: Main Inputs */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Title Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-text-secondary uppercase tracking-wider">Título da Tarefa *</label>
                            <input
                                name="title"
                                className="w-full bg-white dark:bg-surface-dark border border-gray-300 dark:border-border-dark rounded-lg px-4 py-3 text-lg font-medium text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Digite o título da tarefa"
                                required
                            />
                        </div>

                        {/* Project Selection */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-text-secondary uppercase tracking-wider">Projeto</label>
                            <div className="relative">
                                <select
                                    name="projectId"
                                    value={formData.projectId}
                                    onChange={handleChange}
                                    className="w-full appearance-none bg-white dark:bg-surface-dark border border-gray-300 dark:border-border-dark rounded-lg px-4 py-3 pr-10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
                                >
                                    <option value="">Selecione um projeto</option>
                                    {projects.map(project => (
                                        <option key={project.id} value={project.id}>{project.name}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">expand_more</span>
                            </div>
                        </div>

                        {/* Description Editor */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-text-secondary uppercase tracking-wider">Descrição</label>
                            <div className="bg-white dark:bg-surface-dark border border-gray-300 dark:border-border-dark rounded-lg overflow-hidden">
                                <textarea
                                    name="description"
                                    className="w-full bg-transparent border-none p-4 min-h-[200px] text-slate-900 dark:text-white placeholder-gray-400 focus:ring-0 resize-y"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Descreva os requisitos da tarefa..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Metadata Sidebar */}
                    <div className="flex flex-col gap-6">
                        {/* Metadata Card */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-border-dark p-5 flex flex-col gap-5 sticky top-6">
                            {/* Status */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-text-secondary uppercase tracking-wider mb-2 block">Status</label>
                                <div className="relative">
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className={`w-full appearance-none border-none text-sm font-medium rounded-lg py-2.5 px-4 pr-8 focus:ring-2 focus:ring-primary cursor-pointer ${getStatusColor(formData.status)}`}
                                    >
                                        <option value="TODO">{getStatusLabel('TODO')}</option>
                                        <option value="IN_PROGRESS">{getStatusLabel('IN_PROGRESS')}</option>
                                        <option value="IN_REVIEW">{getStatusLabel('IN_REVIEW')}</option>
                                        <option value="DONE">{getStatusLabel('DONE')}</option>
                                        <option value="CANCELLED">{getStatusLabel('CANCELLED')}</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <span className="material-symbols-outlined text-sm">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-text-secondary uppercase tracking-wider mb-2 block">Prioridade</label>
                                <div className="relative">
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className={`w-full appearance-none border-none text-sm font-medium rounded-lg py-2.5 px-4 pr-8 focus:ring-2 focus:ring-primary cursor-pointer ${getPriorityColor(formData.priority)}`}
                                    >
                                        <option value="URGENT">{getPriorityLabel('URGENT')}</option>
                                        <option value="HIGH">{getPriorityLabel('HIGH')}</option>
                                        <option value="MEDIUM">{getPriorityLabel('MEDIUM')}</option>
                                        <option value="LOW">{getPriorityLabel('LOW')}</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <span className="material-symbols-outlined text-sm">priority_high</span>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100 dark:border-gray-700" />

                            {/* Assignee */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-text-secondary uppercase tracking-wider mb-2 block">Responsável</label>
                                <div className="relative">
                                    <select
                                        name="assigneeId"
                                        value={formData.assigneeId}
                                        onChange={handleChange}
                                        className="w-full appearance-none bg-white dark:bg-surface-dark border border-gray-300 dark:border-border-dark rounded-lg px-4 py-2.5 pr-10 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                                    >
                                        <option value="">Selecione um usuário</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>{user.name}</option>
                                        ))}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-sm">expand_more</span>
                                </div>
                            </div>

                            {/* Dates */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-text-secondary uppercase tracking-wider mb-2 block">Prazo de Entrega</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-text-secondary">
                                        <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                                    </span>
                                    <input
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleChange}
                                        className="w-full bg-white dark:bg-surface-dark border border-gray-300 dark:border-border-dark rounded-lg py-2 pl-10 pr-3 text-sm text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                                        type="date"
                                    />
                                </div>
                            </div>

                            {/* Actions Dropdown */}
                            {isEditing && (
                                <div className="mt-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={saving}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                        Excluir Tarefa
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
