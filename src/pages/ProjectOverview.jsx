import React, { useState, useEffect } from 'react';

export default function ProjectOverview({ projectData, project }) {
    const [resources, setResources] = useState([]);
    const [showAddResource, setShowAddResource] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Carregar recursos do projeto (quando implementado no backend)
        // Por enquanto, usa recursos vazios
        setResources([]);
        setLoading(false);
    }, [project]);

    const handleAddResource = () => {
        // Lógica para adicionar novo recurso
        setShowAddResource(true);
        console.log('Add new resource');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Description */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Descrição do Projeto</h3>
                    </div>
                    <div className="p-6">
                        {project?.description ? (
                            <p className="text-slate-600 dark:text-[#94a3b8] leading-relaxed">
                                {project.description}
                            </p>
                        ) : (
                            <p className="text-slate-400 dark:text-slate-500 italic">
                                Nenhuma descrição disponível para este projeto.
                            </p>
                        )}
                    </div>
                </div>
                {/* Scope */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Escopo & Entregáveis</h3>
                    </div>
                    <div className="p-6">
                        {project?.deliverables && project.deliverables.length > 0 ? (
                            <ul className="space-y-3">
                                {project.deliverables.map((item) => (
                                    <li key={item.id} className="flex items-start gap-3">
                                        <span className={`mt-1 ${item.status === 'COMPLETED' ? 'text-green-500' : item.status === 'IN_PROGRESS' ? 'text-blue-500' : 'text-slate-400'}`}>
                                            {item.status === 'COMPLETED' ? '✓' : item.status === 'IN_PROGRESS' ? '⋯' : '○'}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-slate-900 dark:text-white font-medium">{item.title}</p>
                                            {item.description && (
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-slate-400 dark:text-slate-500 italic text-sm">
                                Nenhum entregável definido ainda.
                            </p>
                        )}
                    </div>
                </div>
                {/* Tech Stack */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Stack Tecnológica</h3>
                    </div>
                    <div className="p-6">
                        {project?.technologies && project.technologies.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map((pt, index) => (
                                    <div key={index} className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium flex items-center gap-2">
                                        {pt.technology.icon && (
                                            <img src={pt.technology.icon} alt={pt.technology.name} className="size-4" />
                                        )}
                                        {pt.technology.name}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 dark:text-slate-500 italic text-sm">
                                Nenhuma tecnologia definida ainda.
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {/* Right Column (Sidebar) */}
            <div className="flex flex-col gap-6">
                {/* Client Info */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-[#94a3b8] mb-4">Cliente</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-12 rounded-lg bg-white dark:bg-background-dark p-1 flex items-center justify-center border border-slate-200 dark:border-border-dark">
                            <svg className="size-8 text-slate-900 dark:text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                                {project?.client?.name || 'Sem cliente'}
                            </p>
                        </div>
                    </div>
                </div>
                {/* Timeline */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-[#94a3b8] mb-4">Linha do Tempo</h3>
                    <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-6">
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1.5 size-3 bg-green-500 rounded-full border-2 border-white dark:border-surface-dark"></div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Início</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {project?.startDate ? new Date(project.startDate).toLocaleDateString('pt-BR') : 'Não definido'}
                            </p>
                        </div>
                        {project?.dueDate && (
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1.5 size-3 bg-primary rounded-full border-2 border-white dark:border-surface-dark ring-4 ring-primary/20"></div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Prazo</p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {new Date(project.dueDate).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                {/* Resources / Links */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-[#94a3b8] mb-4">Recursos</h3>
                    <div className="flex flex-col gap-3">
                        {project?.resources && project.resources.length > 0 ? (
                            project.resources.map(resource => (
                                <a key={resource.id} className="group flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-[#334155] hover:border-primary/50 transition-colors" href={resource.url} target="_blank" rel="noopener noreferrer">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white dark:bg-[#233648] p-1.5 rounded-md">
                                            <span className="material-symbols-outlined text-primary text-[20px]">{resource.type === 'GITHUB' ? 'code' : 'link'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{resource.title || resource.name}</span>
                                            <span className="text-xs text-slate-500">{resource.url}</span>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-400 text-[18px]">open_in_new</span>
                                </a>
                            ))
                        ) : (
                            <p className="text-sm text-slate-400 dark:text-slate-500 italic text-center py-4">
                                Nenhum recurso adicionado ainda.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
