import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import ProjectOverview from './ProjectOverview';
import KanbanBoard from './KanbanBoard';
import ProjectVersioning from './ProjectVersioning';

export default function ProjectDetails() {
    const { projectId } = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProject = async () => {
            try {
                setLoading(true);
                console.log('🔍 Carregando projeto com ID:', projectId);
                const data = await projectsAPI.get(projectId);
                console.log('✅ Projeto carregado:', data);
                setProject(data);
                setError(null);
            } catch (err) {
                console.error('❌ Erro ao carregar projeto:', err);
                setError('Erro ao carregar dados do projeto');
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            loadProject();
        }
    }, [projectId]);

    const getStatusLabel = (status) => {
        const labels = {
            'PLANNING': 'Planejamento',
            'IN_PROGRESS': 'Em Progresso',
            'ON_HOLD': 'Pausado',
            'REVIEW': 'Em Revisão',
            'COMPLETED': 'Concluído',
            'CANCELLED': 'Cancelado'
        };
        return labels[status] || status;
    };

    const calculateDaysRemaining = (dueDate) => {
        if (!dueDate) return null;
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Sem prazo';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">Carregando projeto...</p>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex flex-1 items-center justify-center min-h-screen">
                <div className="text-center">
                    <span className="material-symbols-outlined text-red-400 text-6xl">error</span>
                    <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{error || 'Projeto não encontrado'}</p>
                    <Link
                        to="/projects"
                        className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Voltar para Projetos
                    </Link>
                </div>
            </div>
        );
    }

    const daysRemaining = calculateDaysRemaining(project.dueDate);
    const totalTasks = project.taskStats?.reduce((sum, stat) => sum + stat._count, 0) || 0;
    const completedTasks = project.taskStats?.find(s => s.status === 'DONE')?._count || 0;

    return (
        <div className="layout-container flex h-full grow flex-col px-4 md:px-10 lg:px-40 py-8">
            <div className="layout-content-container flex flex-col w-full max-w-[1200px] mx-auto flex-1 gap-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-[#92adc9]">
                    <Link className="hover:text-primary transition-colors" to="/">Início</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <Link className="hover:text-primary transition-colors" to="/projects">Projetos</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="text-slate-900 dark:text-white font-medium">{project.name}</span>
                </nav>
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">{project.name}</h1>
                            {project.category && (
                                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">{project.category}</span>
                            )}
                        </div>
                        <p className="text-slate-500 dark:text-[#94a3b8] text-base">{project.description || project.shortDescription || 'Sem descrição'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 h-10 rounded-lg border border-slate-200 dark:border-[#334155] text-slate-700 dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-[#233648] transition-colors">
                            <span className="material-symbols-outlined text-[20px]">share</span>
                            Compartilhar
                        </button>
                        <Link
                            to={`/projects/edit/${projectId}`}
                            className="flex items-center gap-2 px-4 h-10 rounded-lg bg-primary text-white font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg shadow-primary/25"
                        >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                            Editar Projeto
                        </Link>
                    </div>
                </div>
                {/* Tabs */}
                <div className="border-b border-slate-200 dark:border-[#324d67]">
                    <div className="flex gap-8 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex items-center gap-2 border-b-[3px] pb-3 pt-2 px-1 transition-colors ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-[#92adc9] hover:text-slate-700 dark:hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">dashboard</span>
                            <span className="text-sm font-bold">Visão Geral</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('tasks')}
                            className={`flex items-center gap-2 border-b-[3px] pb-3 pt-2 px-1 transition-colors ${activeTab === 'tasks' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-[#92adc9] hover:text-slate-700 dark:hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">check_circle</span>
                            <span className="text-sm font-bold">Tarefas</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('versions')}
                            className={`flex items-center gap-2 border-b-[3px] pb-3 pt-2 px-1 transition-colors ${activeTab === 'versions' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-[#92adc9] hover:text-slate-700 dark:hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">history</span>
                            <span className="text-sm font-bold">Histórico</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('communication')}
                            className={`flex items-center gap-2 border-b-[3px] pb-3 pt-2 px-1 transition-colors ${activeTab === 'communication' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-[#92adc9] hover:text-slate-700 dark:hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">chat</span>
                            <span className="text-sm font-bold">Comunicação</span>
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 min-h-[500px]">
                    {activeTab === 'overview' && (
                        <>
                            {/* Stats Cards Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {/* Status */}
                                <div className="bg-white dark:bg-surface-dark p-5 rounded-lg border border-slate-200 dark:border-border-dark flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 dark:text-[#94a3b8] text-sm font-medium">Status</span>
                                        <span className={`material-symbols-outlined text-[20px] ${project.status === 'COMPLETED' ? 'text-green-500' :
                                                project.status === 'IN_PROGRESS' ? 'text-blue-500' :
                                                    project.status === 'ON_HOLD' ? 'text-orange-500' :
                                                        'text-gray-500'
                                            }`}>radio_button_checked</span>
                                    </div>
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{getStatusLabel(project.status)}</span>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-2">
                                        <div className={`h-1.5 rounded-full ${project.status === 'COMPLETED' ? 'bg-green-500' :
                                                project.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                                                    project.status === 'ON_HOLD' ? 'bg-orange-500' :
                                                        'bg-gray-500'
                                            }`} style={{ width: `${project.progress || 0}%` }}></div>
                                    </div>
                                </div>
                                {/* Days Remaining */}
                                <div className="bg-white dark:bg-surface-dark p-5 rounded-lg border border-slate-200 dark:border-border-dark flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 dark:text-[#94a3b8] text-sm font-medium">Prazo</span>
                                        <span className={`material-symbols-outlined text-[20px] ${daysRemaining === null ? 'text-gray-400' :
                                                daysRemaining < 0 ? 'text-red-400' :
                                                    daysRemaining < 7 ? 'text-orange-400' :
                                                        'text-green-400'
                                            }`}>schedule</span>
                                    </div>
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {daysRemaining === null ? 'Sem prazo' :
                                            daysRemaining < 0 ? `${Math.abs(daysRemaining)} dias atrasado` :
                                                daysRemaining === 0 ? 'Hoje' :
                                                    `${daysRemaining} dias`}
                                    </span>
                                    <span className="text-xs text-slate-400">Entrega: {formatDate(project.dueDate)}</span>
                                </div>
                                {/* Completion */}
                                <div className="bg-white dark:bg-surface-dark p-5 rounded-lg border border-slate-200 dark:border-border-dark flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 dark:text-[#94a3b8] text-sm font-medium">Conclusão</span>
                                        <span className="material-symbols-outlined text-primary text-[20px]">trending_up</span>
                                    </div>
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{project.progress || 0}%</span>
                                    <span className="text-xs text-slate-400">{completedTasks}/{totalTasks} Tarefas completas</span>
                                </div>
                                {/* Team */}
                                <div className="bg-white dark:bg-surface-dark p-5 rounded-lg border border-slate-200 dark:border-border-dark flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 dark:text-[#94a3b8] text-sm font-medium">Equipe</span>
                                        <span className="material-symbols-outlined text-purple-400 text-[20px]">group</span>
                                    </div>
                                    <div className="flex -space-x-2 mt-1">
                                        {(project.members || []).slice(0, 3).map((member, idx) => (
                                            member.user.avatar ? (
                                                <img
                                                    key={idx}
                                                    src={member.user.avatar}
                                                    alt={member.user.name}
                                                    className="size-8 rounded-full border-2 border-white dark:border-surface-dark object-cover"
                                                    title={member.user.name}
                                                />
                                            ) : (
                                                <div
                                                    key={idx}
                                                    className="size-8 rounded-full border-2 border-white dark:border-surface-dark bg-primary/20 flex items-center justify-center"
                                                    title={member.user.name}
                                                >
                                                    <span className="text-primary font-semibold text-xs">
                                                        {member.user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )
                                        ))}
                                        {(project.members || []).length > 3 && (
                                            <div className="size-8 rounded-full border-2 border-white dark:border-surface-dark bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                                +{(project.members || []).length - 3}
                                            </div>
                                        )}
                                        {(project.members || []).length === 0 && (
                                            <span className="text-xs text-slate-400">Sem membros</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <ProjectOverview projectId={projectId} project={project} />
                        </>
                    )}
                    {activeTab === 'tasks' && <KanbanBoard showHeader={false} projectId={projectId} project={project} />}
                    {activeTab === 'versions' && <ProjectVersioning projectId={projectId} project={project} />}
                    {activeTab === 'communication' && (
                        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-[#111a22]">
                            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">chat</span>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-white">Central de Comunicação</h3>
                            <p className="text-slate-500 dark:text-slate-400">Em breve você poderá conversar com sua equipe aqui.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
