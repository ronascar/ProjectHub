import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectsAPI, clientsAPI, usersAPI, technologiesAPI } from '../services/api';

export default function CreateProject() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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
    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]);
    const [newDeliverable, setNewDeliverable] = useState('');
    const [deliverables, setDeliverables] = useState([]);
    const [technologies, setTechnologies] = useState([]);
    const [availableTechnologies, setAvailableTechnologies] = useState([]);
    const [selectedTech, setSelectedTech] = useState('');
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [managerId, setManagerId] = useState('');

    React.useEffect(() => {
        const loadData = async () => {
            try {
                const [clientsData, usersData, technologiesData] = await Promise.all([
                    clientsAPI.list(),
                    usersAPI.list(),
                    technologiesAPI.list()
                ]);
                setClients(clientsData);
                setUsers(usersData);
                setAvailableTechnologies(technologiesData);
            } catch (err) {
                console.error('Error loading data:', err);
            }
        };
        loadData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddDeliverable = () => {
        if (!newDeliverable.trim()) return;
        setDeliverables([...deliverables, { title: newDeliverable.trim(), status: 'PENDING' }]);
        setNewDeliverable('');
    };

    const handleRemoveDeliverable = (index) => {
        setDeliverables(deliverables.filter((_, i) => i !== index));
    };

    const handleAddTechnology = () => {
        if (selectedTech) {
            const tech = availableTechnologies.find(t => t.id === selectedTech);
            if (tech && !technologies.find(t => t.id === tech.id)) {
                setTechnologies([...technologies, tech]);
                setSelectedTech('');
            }
        }
    };

    const handleRemoveTechnology = (techId) => {
        setTechnologies(technologies.filter(t => t.id !== techId));
    };

    const toggleTeamMember = (userId) => {
        if (selectedTeam.includes(userId)) {
            setSelectedTeam(selectedTeam.filter(id => id !== userId));
        } else {
            setSelectedTeam([...selectedTeam, userId]);
        }
    };

    const handleSave = async () => {
        // Validação
        if (!formData.name.trim()) {
            setError('Nome do projeto é obrigatório');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Map form data to API format
            const projectData = {
                name: formData.name.trim(),
                description: formData.description?.trim() || null,
                shortDescription: formData.description?.trim()?.substring(0, 200) || null,
                category: formData.category || 'Web Development',
                status: formData.status === 'Planejamento' ? 'PLANNING' :
                    formData.status === 'Em Andamento' ? 'IN_PROGRESS' :
                        formData.status === 'Em Pausa' ? 'ON_HOLD' : 'PLANNING',
                priority: formData.priority === 'Baixa' ? 'LOW' :
                    formData.priority === 'Média' ? 'MEDIUM' :
                        formData.priority === 'Alta' ? 'HIGH' :
                            formData.priority === 'Urgente' ? 'URGENT' : 'MEDIUM',
                startDate: formData.startDate || null,
                estimatedDate: formData.estimatedDate || null,
                dueDate: formData.finalDate || null,
                clientId: formData.client?.trim() || null,
                progress: 0,
                color: '#4f46e5',
                // Add members (Manager + Selected Team)
                members: [
                    ...(managerId ? [{ userId: managerId, role: 'MANAGER' }] : []),
                    ...selectedTeam.map(userId => ({ userId, role: 'DEVELOPER' }))
                    // Remove duplicates in case manager is also selected in team
                ].filter((v, i, a) => a.findIndex(t => (t.userId === v.userId)) === i),
                // Add deliverables
                deliverables: deliverables,
                // Add technologies with proper IDs
                technologies: technologies.map(t => ({ id: t.id }))
            };

            console.log('📤 Enviando dados do projeto:', projectData);
            const newProject = await projectsAPI.create(projectData);
            console.log('✅ Projeto criado com sucesso:', newProject);

            // Redirecionar para a lista de projetos
            navigate('/projects');
        } catch (err) {
            console.error('❌ Erro completo ao criar projeto:', err);

            // Tratamento de erros específicos baseado no status code
            if (err.status === 403) {
                setError('Você não tem permissão para criar projetos. Apenas gerentes e administradores podem criar projetos.');
            } else if (err.status === 401) {
                setError('Sua sessão expirou. Por favor, faça login novamente.');
                setTimeout(() => navigate('/login'), 2000);
            } else if (err.status === 400) {
                setError(`Dados inválidos: ${err.message}`);
            } else if (err.status === 500) {
                setError('Erro no servidor. Por favor, tente novamente mais tarde.');
            } else {
                setError(err.message || 'Erro ao criar projeto. Verifique sua conexão e tente novamente.');
            }
        } finally {
            setLoading(false);
        }
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
                            disabled={loading}
                            className="flex items-center gap-2 px-5 h-10 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-bold transition-colors shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                                    Lançar Projeto
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-background-light dark:bg-background-dark">
                {error && (
                    <div className="max-w-[1200px] mx-auto mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-center gap-2">
                        <span className="material-symbols-outlined">error</span>
                        <span>{error}</span>
                    </div>
                )}
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
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-slate-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        placeholder="Ex: Redesign Website 2024"
                                        type="text"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Cliente</label>
                                    <select
                                        name="client"
                                        value={formData.client}
                                        onChange={handleChange}
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-slate-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    >
                                        <option value="">Selecione um cliente...</option>
                                        {clients.map(client => (
                                            <option key={client.id} value={client.id}>
                                                {client.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Categoria</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-slate-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-slate-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
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
                                        value={newDeliverable}
                                        onChange={(e) => setNewDeliverable(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddDeliverable()}
                                        className="flex-1 bg-white dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary transition-all"
                                        placeholder="Adicionar novo entregável..."
                                        type="text"
                                    />
                                    <button
                                        onClick={handleAddDeliverable}
                                        className="px-4 py-2 bg-slate-100 dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-lg text-primary hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px] block">add</span>
                                    </button>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {deliverables.length === 0 ? (
                                        <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-gray-200 dark:border-border-dark text-slate-400 text-sm italic">
                                            Nenhum entregável adicionado ainda.
                                        </div>
                                    ) : (
                                        deliverables.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-100 dark:border-border-dark">
                                                <span className="text-sm text-slate-700 dark:text-gray-300">{item.title}</span>
                                                <button
                                                    onClick={() => handleRemoveDeliverable(idx)}
                                                    className="text-red-400 hover:text-red-600 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tech Stack Selection */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-border-dark p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">terminal</span>
                                Stack Tecnológica
                            </h3>
                            <div className="flex flex-wrap gap-3 mb-4">
                                {technologies.map((tech) => (
                                    <div key={tech.id} className="group relative px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium flex items-center gap-2 pr-8 cursor-default">
                                        {tech.icon && (
                                            <img
                                                src={tech.icon}
                                                alt={`${tech.name} logo`}
                                                className="size-4"
                                            />
                                        )}
                                        {tech.name}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTechnology(tech.id)}
                                            className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">close</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={selectedTech}
                                    onChange={(e) => setSelectedTech(e.target.value)}
                                    className="flex-1 text-sm rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                                >
                                    <option value="">Selecione uma tecnologia...</option>
                                    {availableTechnologies
                                        .filter(tech => !technologies.find(t => t.id === tech.id))
                                        .map(tech => (
                                            <option key={tech.id} value={tech.id}>
                                                {tech.name}
                                            </option>
                                        ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={handleAddTechnology}
                                    disabled={!selectedTech}
                                    className="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="material-symbols-outlined text-[20px]">add</span>
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
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-slate-600 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                                        type="date"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase">Entrega Estimada</label>
                                    <input
                                        name="estimatedDate"
                                        value={formData.estimatedDate}
                                        onChange={handleChange}
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-slate-600 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                                        type="date"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase">Entrega Final (Prazo)</label>
                                    <input
                                        name="finalDate"
                                        value={formData.finalDate}
                                        onChange={handleChange}
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-slate-600 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
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
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-slate-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-primary"
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
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-slate-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-primary"
                                    >
                                        <option>Baixa</option>
                                        <option>Média</option>
                                        <option>Alta</option>
                                        <option>Urgente</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-500 dark:text-text-secondary uppercase">Gerente Responsável</label>
                                    <select
                                        value={managerId}
                                        onChange={(e) => setManagerId(e.target.value)}
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-slate-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-primary cursor-pointer"
                                    >
                                        <option value="">Selecione um gestor...</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>{user.name}</option>
                                        ))}
                                    </select>
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
                            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                                <p className="text-xs text-slate-500 mb-2">Selecione os membros:</p>
                                {users.map(user => (
                                    <label key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-screen-dark rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedTeam.includes(user.id)}
                                            onChange={() => toggleTeamMember(user.id)}
                                            className="rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <div className="flex items-center gap-2">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="size-6 rounded-full object-cover" />
                                            ) : (
                                                <div className="size-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">{user.name.charAt(0)}</div>
                                            )}
                                            <span className="text-sm font-medium text-slate-700 dark:text-gray-300">{user.name}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
