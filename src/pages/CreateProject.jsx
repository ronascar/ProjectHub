import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function CreateProject() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        client: '',
        category: 'Web Development',
        description: '',
        startDate: '',
        estimatedDate: '',
        finalDate: '',
        manager: '',
        status: 'Planejamento',
        priority: 'Média',
        tags: [],
        techStack: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Here we would typically save to an API
        console.log('Saving project:', formData);
        navigate('/projects');
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            {/* Header & Breadcrumbs */}
            <header className="flex-shrink-0 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-border-dark px-6 py-4 flex flex-col gap-4">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-text-secondary">
                    <Link to="/projects" className="hover:text-primary transition-colors">Projetos</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="text-slate-900 dark:text-white font-medium">Novo Projeto</span>
                </div>
                {/* Page Heading */}
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">Criar Novo Projeto</h1>
                        <p className="text-sm text-gray-500 dark:text-text-secondary mt-1">Configure os detalhes iniciais do seu novo projeto.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/projects')}
                            className="px-4 h-10 rounded-lg border border-gray-300 dark:border-border-dark text-slate-700 dark:text-text-secondary text-sm font-bold hover:bg-gray-50 dark:hover:bg-surface-dark transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-5 h-10 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-colors shadow-lg shadow-primary/25"
                        >
                            <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                            Lançar Projeto
                        </button>
                    </div>
                </div>
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-background-light dark:bg-background-dark">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Project Details */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* Basic Info Section */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-border-dark p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">info</span>
                                Informações Básicas
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Nome do Projeto</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-white dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-lg px-4 py-2.5 text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        placeholder="Ex: Redesign Website 2024"
                                        type="text"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Cliente</label>
                                    <input
                                        name="client"
                                        value={formData.client}
                                        onChange={handleChange}
                                        className="w-full bg-white dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-lg px-4 py-2.5 text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        placeholder="Ex: Acme Corp"
                                        type="text"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Categoria</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full bg-white dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    >
                                        <option>Web Development</option>
                                        <option>Mobile App</option>
                                        <option>Marketing Digital</option>
                                        <option>UI/UX Design</option>
                                        <option>Consultoria</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Descrição do Projeto</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full bg-white dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-lg px-4 py-2.5 text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                                        placeholder="Descreva os objetivos principais e o contexto do projeto..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Scope & Deliverables */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-border-dark p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">list_alt</span>
                                Escopo & Entregáveis
                            </h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 bg-white dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary transition-all"
                                        placeholder="Adicionar novo entregável..."
                                        type="text"
                                    />
                                    <button className="px-4 py-2 bg-slate-100 dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-lg text-primary hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                        <span className="material-symbols-outlined text-[20px] block">add</span>
                                    </button>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-gray-200 dark:border-border-dark text-slate-400 text-sm italic">
                                        Nenhum entregável adicionado ainda.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tech Stack Selection */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-border-dark p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">terminal</span>
                                Stack Tecnológica
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {['React', 'Next.js', 'TypeScript', 'Tailwind', 'PostgreSQL', 'Node.js', 'Figma', 'Docker'].map(tech => (
                                    <button
                                        key={tech}
                                        className="px-4 py-2 rounded-full border border-gray-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-slate-600 dark:text-slate-400 text-sm font-medium hover:border-primary hover:text-primary transition-all"
                                    >
                                        {tech}
                                    </button>
                                ))}
                                <button className="px-4 py-2 rounded-full border border-dashed border-gray-300 dark:border-gray-600 text-slate-400 text-sm font-medium hover:border-primary hover:text-primary transition-all flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">add</span>
                                    Custom
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Settings & Timeline */}
                    <div className="flex flex-col gap-8">
                        {/* Timeline Card */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-border-dark p-6 shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-text-secondary mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                                Cronograma
                            </h3>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase">Data de Início</label>
                                    <input
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="w-full bg-white dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                                        type="date"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase">Entrega Estimada</label>
                                    <input
                                        name="estimatedDate"
                                        value={formData.estimatedDate}
                                        onChange={handleChange}
                                        className="w-full bg-white dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                                        type="date"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase">Entrega Final (Prazo)</label>
                                    <input
                                        name="finalDate"
                                        value={formData.finalDate}
                                        onChange={handleChange}
                                        className="w-full bg-white dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                                        type="date"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Project Settings */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-border-dark p-6 shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-text-secondary mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">settings</span>
                                Configurações
                            </h3>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase">Status Inicial</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full bg-blue-50 dark:bg-background-dark border border-transparent dark:border-border-dark rounded-lg px-4 py-2.5 text-blue-700 dark:text-blue-100 text-sm font-medium focus:ring-2 focus:ring-primary"
                                    >
                                        <option>Planejamento</option>
                                        <option>Em Andamento</option>
                                        <option>Em Pausa</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase">Prioridade</label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="w-full bg-orange-50 dark:bg-background-dark border border-transparent dark:border-border-dark rounded-lg px-4 py-2.5 text-orange-700 dark:text-orange-100 text-sm font-medium focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option>Baixa</option>
                                        <option>Média</option>
                                        <option>Alta</option>
                                        <option>Urgente</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase">Gerente Responsável</label>
                                    <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-border-dark hover:bg-gray-50 dark:hover:bg-background-dark transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">AM</div>
                                            <span className="text-sm text-slate-700 dark:text-white font-medium">Alex Morgan</span>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400 text-[18px]">edit</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Team Selection */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-border-dark p-6 shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-text-secondary mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[20px]">group</span>
                                    Equipe
                                </div>
                                <button className="text-primary hover:text-blue-400 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                                </button>
                            </h3>
                            <div className="flex -space-x-3 mb-4">
                                <div className="size-10 rounded-full border-2 border-white dark:border-surface-dark bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">+</div>
                            </div>
                            <p className="text-xs text-slate-500 italic">Adicione membros para iniciar a colaboração.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
