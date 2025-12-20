import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProjectOverview from './ProjectOverview';
import KanbanBoard from './KanbanBoard';
import ProjectVersioning from './ProjectVersioning';

export default function ProjectDetails() {
    const { projectId } = useParams();
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="layout-container flex h-full grow flex-col px-4 md:px-10 lg:px-40 py-8">
            <div className="layout-content-container flex flex-col w-full max-w-[1200px] mx-auto flex-1 gap-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-[#92adc9]">
                    <Link className="hover:text-primary transition-colors" to="/">Home</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <Link className="hover:text-primary transition-colors" to="/projects">Projetos</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="text-slate-900 dark:text-white font-medium">Redesign Website 2024</span>
                </nav>
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">Redesign Website 2024</h1>
                            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">Web Development</span>
                        </div>
                        <p className="text-slate-500 dark:text-[#94a3b8] text-base">Projeto de modernização da identidade visual e arquitetura da Acme Corp.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 h-10 rounded-lg border border-slate-200 dark:border-[#334155] text-slate-700 dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-[#233648] transition-colors">
                            <span className="material-symbols-outlined text-[20px]">share</span>
                            Share
                        </button>
                        <Link
                            to={`/projects/edit/${projectId || '1'}`}
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
                                        <span className="material-symbols-outlined text-green-500 text-[20px]">radio_button_checked</span>
                                    </div>
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">Em Progresso</span>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-2">
                                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                                    </div>
                                </div>
                                {/* Days Remaining */}
                                <div className="bg-white dark:bg-surface-dark p-5 rounded-lg border border-slate-200 dark:border-border-dark flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 dark:text-[#94a3b8] text-sm font-medium">Prazo</span>
                                        <span className="material-symbols-outlined text-orange-400 text-[20px]">schedule</span>
                                    </div>
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">12 Dias</span>
                                    <span className="text-xs text-slate-400">Entrega: 20 Mar 2024</span>
                                </div>
                                {/* Completion */}
                                <div className="bg-white dark:bg-surface-dark p-5 rounded-lg border border-slate-200 dark:border-border-dark flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 dark:text-[#94a3b8] text-sm font-medium">Conclusão</span>
                                        <span className="material-symbols-outlined text-primary text-[20px]">trending_up</span>
                                    </div>
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">65%</span>
                                    <span className="text-xs text-slate-400">32/45 Tarefas completas</span>
                                </div>
                                {/* Team */}
                                <div className="bg-white dark:bg-surface-dark p-5 rounded-lg border border-slate-200 dark:border-border-dark flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 dark:text-[#94a3b8] text-sm font-medium">Equipe</span>
                                        <span className="material-symbols-outlined text-purple-400 text-[20px]">group</span>
                                    </div>
                                    <div className="flex -space-x-2 mt-1">
                                        <div className="size-8 rounded-full border-2 border-white dark:border-surface-dark bg-cover bg-center" data-alt="Team member 1 portrait" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBU_s1Mu3LwoGdj5UtBw2IBZJBN1dWW4c5UDHywyVxDnPzOb-jqNqM2WbIT-S4eFZEEMrHZnjZNZP3RIHMxPYliTomS31aYHIm-z_PVI5_vQglsZLjsh53iK34_WhjjBlLoSpNiNQRPLwFetP8CgcOD1VSCJm9qo2wY3aKNbtxGHuhZATq_7l_2hfQxwCNBUqNtn9bMSEtPaOIe3VyYW_-tnHcQyMqsbGX4h91jqR5tR_536qtbC7lXLe9jF8GfY051-jLjerrakX8')" }}></div>
                                        <div className="size-8 rounded-full border-2 border-white dark:border-surface-dark bg-cover bg-center" data-alt="Team member 2 portrait" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDAJZlGSYR5HTV5l29sDZAsmCizTfYAjy84sGRk-MZzd1WsnRVn5ohD_s6ff6M6qc3Z6SyBRer90MpDOJ9ApjeW71FZZqQpBNvpQTWLIqfM0GWfU3oiv-EKtSUmA7C5I2TaFzGfe_-Qr8TW4j27HC9yp5yj9gqDQ1A0zc6b-u1gyvTfRJRxQYF2WkCz9zxbysqGxE533qzy9v6F2jS200bNu7acoFPmDnuAblrq7scBCFTUbVpil8M2IiSrVUUbFB0MZVFh0ClhFgg')" }}></div>
                                        <div className="size-8 rounded-full border-2 border-white dark:border-surface-dark bg-cover bg-center" data-alt="Team member 3 portrait" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDRxeiW9XtlCwTzSBZYI6DHYTRFDaVtkhZ6r5FWHtG0fSOO16dUx4zoTzOjk5M4hAve0kxA-l4v8MmmB_k2OCZmlybYXSbiTHJeAV0CgDkwY38mVz0QUyCnkEQNDu0VkyEftNuLWV4WT4qSii2NGROFs2HpHYm8cI6TiVm9EXGbInGXqHA7n3puXuddrfXiaKNmHinSydLBoZRlDgJ9bUU1MiBbLYVldInntB2Fyv26WpAZn5615N1K07jHvMZXLUTvisLs6AZbHfc')" }}></div>
                                        <div className="size-8 rounded-full border-2 border-white dark:border-surface-dark bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">+2</div>
                                    </div>
                                </div>
                            </div>
                            <ProjectOverview />
                        </>
                    )}
                    {activeTab === 'tasks' && <KanbanBoard showHeader={false} />}
                    {activeTab === 'versions' && <ProjectVersioning />}
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
