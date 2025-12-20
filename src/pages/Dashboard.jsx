import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, teamAPI } from '../services/api';

export default function Dashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [recentProjects, setRecentProjects] = useState([]);
    const [activities, setActivities] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Carregar dados em paralelo
            const [statsData, projectsData, activitiesData, teamData] = await Promise.all([
                dashboardAPI.getStats(),
                dashboardAPI.getRecentProjects(),
                dashboardAPI.getActivities(),
                teamAPI.getMembers()
            ]);

            setStats(statsData);
            setRecentProjects(projectsData);
            setActivities(activitiesData);
            setTeamMembers(teamData);
        } catch (err) {
            console.error('Error loading dashboard data:', err);
            setError('Erro ao carregar dados do dashboard');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    };

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

    const getStatusColor = (status) => {
        const colorMap = {
            'PLANNING': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            'IN_PROGRESS': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
            'ON_HOLD': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
            'COMPLETED': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            'CANCELLED': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        };
        return colorMap[status] || 'bg-gray-100 text-gray-800';
    };

    const getActivityIcon = (type) => {
        const iconMap = {
            'task_created': 'add_task',
            'task_completed': 'task_alt',
            'project_created': 'folder_open',
            'comment': 'comment',
            'update': 'update'
        };
        return iconMap[type] || 'notifications';
    };

    const getActivityColor = (type) => {
        const colorMap = {
            'task_created': 'blue',
            'task_completed': 'green',
            'project_created': 'purple',
            'comment': 'orange',
            'update': 'gray'
        };
        return colorMap[type] || 'gray';
    };

    const getTimeAgo = (dateString) => {
        if (!dateString) return 'agora';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'agora';
        if (diffMins < 60) return `${diffMins}min atrás`;
        if (diffHours < 24) return `${diffHours}h atrás`;
        return `${diffDays}d atrás`;
    };

    if (loading) {
        return (
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="mx-auto max-w-7xl flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">Carregando dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="mx-auto max-w-7xl">
                {/* Page Heading */}
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white md:text-3xl">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                            Bem-vindo de volta, {user?.name || 'Usuário'}. {stats?.upcomingTasksCount > 0 && `Você tem ${stats.upcomingTasksCount} ${stats.upcomingTasksCount === 1 ? 'tarefa' : 'tarefas'} para hoje.`}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500/20">
                            Sistema Operacional
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
                            Última atualização: {getTimeAgo(new Date())}
                        </span>
                    </div>
                </div>

                {/* KPI Stats Grid */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Active Projects */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-border-dark dark:bg-surface-dark">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Projetos Ativos</p>
                            <span className="rounded bg-primary/10 p-1 text-primary">
                                <span className="material-symbols-outlined text-[20px]">folder</span>
                            </span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.activeProjects || 0}</p>
                            <span className="flex items-center text-xs font-medium text-green-500">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                {stats?.totalProjects || 0} total
                            </span>
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                            <div className="h-1.5 rounded-full bg-primary" style={{ width: `${stats?.activeProjects && stats?.totalProjects ? (stats.activeProjects / stats.totalProjects * 100) : 0}%` }} />
                        </div>
                    </div>

                    {/* Pending Tasks */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-border-dark dark:bg-surface-dark">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tarefas Pendentes</p>
                            <span className="rounded bg-orange-500/10 p-1 text-orange-500">
                                <span className="material-symbols-outlined text-[20px]">assignment</span>
                            </span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.pendingTasks || 0}</p>
                            <span className="flex items-center text-xs font-medium text-gray-500">
                                {stats?.totalTasks || 0} total
                            </span>
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                            <div className="h-1.5 rounded-full bg-orange-500" style={{ width: `${stats?.pendingTasks && stats?.totalTasks ? (stats.pendingTasks / stats.totalTasks * 100) : 0}%` }} />
                        </div>
                    </div>

                    {/* Completed Tasks */}
                    <div className="rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm dark:border-green-900/30 dark:bg-surface-dark">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">Tarefas Concluídas</p>
                            <span className="rounded bg-green-500/10 p-1 text-green-500">
                                <span className="material-symbols-outlined text-[20px]">task_alt</span>
                            </span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.completedTasks || 0}</p>
                            <span className="flex items-center text-xs font-medium text-green-500">
                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                Esta semana
                            </span>
                        </div>
                        <p className="mt-2 text-xs text-green-600/80 dark:text-green-400/80">Excelente progresso!</p>
                    </div>

                    {/* Team Members */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-border-dark dark:bg-surface-dark">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Membros da Equipe</p>
                            <span className="rounded bg-purple-500/10 p-1 text-purple-500">
                                <span className="material-symbols-outlined text-[20px]">group</span>
                            </span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.teamMembers || 0}</p>
                            <span className="text-xs text-gray-500 dark:text-gray-400">ativos</span>
                        </div>
                        <div className="mt-2 flex h-4 items-end gap-1">
                            {[40, 60, 50, 80, 70, 90].map((height, i) => (
                                <div
                                    key={i}
                                    className={`w-1/6 rounded-sm ${i === 5 ? 'bg-purple-500' : 'bg-purple-500/30'}`}
                                    style={{ height: `${height}%` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left Column (Projects Table) */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* Active Projects Section */}
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-border-dark dark:bg-surface-dark">
                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-border-dark">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Projetos Ativos</h2>
                                <button className="text-sm font-medium text-primary hover:text-primary-hover">Ver Todos</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-xs font-medium uppercase text-gray-500 dark:bg-surface-dark-lighter dark:text-gray-400">
                                        <tr>
                                            <th className="px-6 py-3">Nome do Projeto</th>
                                            <th className="px-6 py-3">Progresso</th>
                                            <th className="px-6 py-3">Data de Entrega</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3 text-right">Equipe</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-border-dark">
                                        {recentProjects.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                                                    Nenhum projeto ativo no momento
                                                </td>
                                            </tr>
                                        ) : (
                                            recentProjects.map((project) => (
                                                <tr key={project.id} className="group hover:bg-gray-50 dark:hover:bg-surface-dark-lighter/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded" style={{ backgroundColor: `${project.color}20`, color: project.color }}>
                                                                <span className="material-symbols-outlined text-[18px]">folder</span>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900 dark:text-white">{project.name}</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">{project.client?.name || 'Sem cliente'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{project.progress || 0}%</span>
                                                            <div className="h-1.5 w-20 rounded-full bg-gray-200 dark:bg-gray-700">
                                                                <div className="h-1.5 rounded-full bg-primary" style={{ width: `${project.progress || 0}%` }} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{formatDate(project.dueDate)}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(project.status)}`}>
                                                            {getStatusLabel(project.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex -space-x-2 justify-end">
                                                            {project.members?.slice(0, 3).map((member) => (
                                                                <div key={member.user.id} className="h-6 w-6 rounded-full ring-2 ring-white dark:ring-surface-dark">
                                                                    <img src={member.user.avatar || 'https://i.pravatar.cc/150?img=1'} alt={member.user.name} className="h-full w-full rounded-full object-cover" />
                                                                </div>
                                                            ))}
                                                            {!project.members?.length && (
                                                                <span className="text-xs text-gray-400">Sem equipe</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Team Workload Section */}
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-border-dark dark:bg-surface-dark">
                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-border-dark">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Alocação de Recursos</h2>
                                <button className="text-sm font-medium text-primary hover:text-primary-hover">Gerenciar Equipe</button>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col gap-5">
                                    {teamMembers.length === 0 ? (
                                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                                            Nenhum membro da equipe encontrado
                                        </p>
                                    ) : (
                                        teamMembers.slice(0, 5).map((member) => {
                                            const workload = member.tasksCount ? Math.min((member.tasksCount / 10) * 100, 100) : 0;
                                            const status = workload > 80 ? 'Sobrecarregado' : workload > 50 ? 'Ótimo' : 'Disponível';
                                            const statusColor = workload > 80 ? 'text-red-500' : workload > 50 ? 'text-green-500' : 'text-gray-500 dark:text-gray-400';
                                            const barColor = workload > 80 ? 'bg-red-500' : workload > 50 ? 'bg-primary' : 'bg-green-500';

                                            return (
                                                <div key={member.id} className="flex items-center gap-4">
                                                    <div className="h-10 w-10 shrink-0 rounded-full">
                                                        <img src={member.avatar || 'https://i.pravatar.cc/150?img=1'} alt={member.name} className="h-full w-full rounded-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {member.name} <span className="text-xs text-gray-500 font-normal ml-1">{member.role}</span>
                                                            </p>
                                                            <span className={`text-xs font-medium ${statusColor}`}>
                                                                {status} ({Math.round(workload)}%)
                                                            </span>
                                                        </div>
                                                        <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                                                            <div
                                                                className={`h-2 rounded-full ${barColor}`}
                                                                style={{ width: `${workload}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Sidebar Widgets) */}
                    <div className="flex flex-col gap-8">
                        {/* Activity Feed */}
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-border-dark dark:bg-surface-dark">
                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-border-dark">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Atividade Recente</h2>
                            </div>
                            <div className="p-4">
                                <ul className="space-y-4">
                                    {activities.length === 0 ? (
                                        <li className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                                            Nenhuma atividade recente
                                        </li>
                                    ) : (
                                        activities.map((activity) => {
                                            const activityColor = getActivityColor(activity.type);
                                            const activityIcon = getActivityIcon(activity.type);

                                            return (
                                                <li key={activity.id} className="relative flex gap-3">
                                                    {activity.user ? (
                                                        <div className="h-8 w-8 shrink-0 rounded-full ring-2 ring-white dark:ring-surface-dark">
                                                            <img src={activity.user.avatar || 'https://i.pravatar.cc/150?img=1'} alt={activity.user.name} className="h-full w-full rounded-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-${activityColor}-100 text-${activityColor}-600 ring-2 ring-white dark:bg-${activityColor}-900/30 dark:text-${activityColor}-400 dark:ring-surface-dark`}>
                                                            <span className="material-symbols-outlined text-[16px]">{activityIcon}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex-1 pb-1">
                                                        <p className="text-sm text-gray-900 dark:text-white">
                                                            <span className="font-semibold">{activity.user?.name || 'Sistema'}</span> {activity.description}
                                                        </p>
                                                        {activity.details && (
                                                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">"{activity.details}"</p>
                                                        )}
                                                        <p className="mt-1 text-[10px] text-gray-400">{getTimeAgo(activity.createdAt)}</p>
                                                    </div>
                                                </li>
                                            );
                                        })
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
