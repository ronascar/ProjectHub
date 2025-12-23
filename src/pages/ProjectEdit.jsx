import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { projectsAPI, clientsAPI, usersAPI, technologiesAPI } from '../services/api';

export default function ProjectEdit() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        category: 'Web Development',
        description: '',
        longDescription: '',
        status: 'progress',
        dueDate: '',
        completion: 0,
        startDate: '',
        estimateDate: '',
        deliveryDate: '',
        client: 'acme'
    });

    const [activeTab, setActiveTab] = useState('edit');

    // Load project data
    useEffect(() => {
        const loadProject = async () => {
            try {
                setLoading(true);
                const [project, clientsData, usersData, technologiesData] = await Promise.all([
                    projectsAPI.getById(projectId),
                    clientsAPI.list(),
                    usersAPI.list(),
                    technologiesAPI.list()
                ]);

                setClients(clientsData);
                setAllUsers(usersData);
                setAvailableTechnologies(technologiesData);

                // Debug: log full project data
                console.log('📦 Projeto carregado completo:', {
                    deliverables: project.deliverables,
                    resources: project.resources,
                    technologies: project.technologies,
                    availableTechnologies: technologiesData
                });

                // Map API data to form format
                setFormData({
                    name: project.name || '',
                    category: project.category || 'Web Development',
                    description: project.shortDescription || project.description || '',
                    longDescription: project.description || '',
                    status: project.status?.toLowerCase() || 'progress',
                    dueDate: project.dueDate ? project.dueDate.split('T')[0] : '',
                    completion: project.progress || 0,
                    startDate: project.startDate ? project.startDate.split('T')[0] : '',
                    estimateDate: project.estimatedDate ? project.estimatedDate.split('T')[0] : '',
                    deliveryDate: project.dueDate ? project.dueDate.split('T')[0] : '',
                    startDate: project.startDate ? project.startDate.split('T')[0] : '',
                    estimateDate: project.estimatedDate ? project.estimatedDate.split('T')[0] : '',
                    deliveryDate: project.dueDate ? project.dueDate.split('T')[0] : '',
                    client: project.clientId || ''
                });

                // Map relations
                if (project.deliverables) {
                    setDeliverables(project.deliverables.map(d => ({
                        ...d,
                        status: d.status === 'COMPLETED' ? 'done' :
                            d.status === 'IN_PROGRESS' ? 'pending' :
                                'todo'
                    })));
                }
                if (project.resources) setResources(project.resources);
                if (project.members) setTeamMembers(project.members.map(m => m.user));
                // Map technologies with full data including IDs
                if (project.technologies) {
                    setTechnologies(project.technologies.map(pt => ({
                        id: pt.technology.id,
                        name: pt.technology.name,
                        icon: pt.technology.icon,
                        color: pt.technology.color,
                        invert: false // Default
                    })));
                }

                setError(null);
            } catch (err) {
                console.error('Erro ao carregar projeto:', err);
                setError('Erro ao carregar projeto');
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            loadProject();
        }
    }, [projectId]);

    const [clients, setClients] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [newResource, setNewResource] = useState({ title: '', url: '', type: 'LINK' });
    const [showAddResource, setShowAddResource] = useState(false);

    // Missing state definitions restored
    const [deliverables, setDeliverables] = useState([]);
    const [resources, setResources] = useState([]);
    const [technologies, setTechnologies] = useState([]);
    const [availableTechnologies, setAvailableTechnologies] = useState([]);
    const [selectedTech, setSelectedTech] = useState('');

    // Handlers
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError('Nome do projeto é obrigatório');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            // Map form data to API format
            const updateData = {
                name: formData.name,
                description: formData.longDescription || formData.description,
                shortDescription: formData.description,
                category: formData.category,
                status: formData.status === 'planning' ? 'PLANNING' :
                    formData.status === 'progress' ? 'IN_PROGRESS' :
                        formData.status === 'review' ? 'REVIEW' :
                            formData.status === 'completed' ? 'COMPLETED' : 'IN_PROGRESS',
                priority: 'MEDIUM',
                progress: parseInt(formData.completion) || 0,
                startDate: formData.startDate || null,
                estimatedDate: formData.estimateDate || null,
                dueDate: formData.deliveryDate || formData.dueDate || null,
                clientId: formData.client || null,
                deliverables: deliverables.map(d => ({
                    title: d.title,
                    description: d.description || null,
                    status: d.status === 'done' ? 'COMPLETED' :
                        d.status === 'pending' ? 'IN_PROGRESS' :
                            'PENDING'
                })),
                resources: resources.map(r => ({
                    title: r.title || r.name,
                    url: r.url,
                    type: r.type || 'LINK'
                })),
                technologies: technologies
                    .filter(t => t.id) // Only include technologies with valid IDs
                    .map(t => ({ id: t.id }))
            };

            await projectsAPI.update(projectId, updateData);
            console.log('Projeto atualizado com sucesso');
            navigate('/projects');
        } catch (err) {
            console.error('Erro ao atualizar projeto:', err);
            setError(err.message || 'Erro ao atualizar projeto. Verifique se você tem permissão.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate('/projects');
    };

    const handleAddTech = () => {
        if (newTech.trim()) {
            setTechnologies([...technologies, { name: newTech.trim(), icon: null }]);
            setNewTech('');
        }
    };

    const handleRemoveTech = (index) => {
        setTechnologies(technologies.filter((_, i) => i !== index));
    };

    const handleDeliverableChange = (id, field, value) => {
        setDeliverables(deliverables.map(d =>
            d.id === id ? { ...d, [field]: value } : d
        ));
    };

    const handleRemoveDeliverable = (id) => {
        setDeliverables(deliverables.filter(d => d.id !== id));
    };

    const handleAddDeliverable = () => {
        const newId = (Math.max(...deliverables.map(d => typeof d.id === 'number' ? d.id : 0), 0) + 1).toString();
        setDeliverables([...deliverables, { id: newId, status: 'todo', title: '', description: '' }]);
    };

    const handleAddTeamMember = () => {
        // TODO: Implementar modal de adicionar membro
        alert('Funcionalidade de adicionar membro será implementada em breve');
    };

    const handleManageTeam = () => {
        // TODO: Implementar modal de gerenciar equipe
        alert('Funcionalidade de gerenciar equipe será implementada em breve');
    };

    const handleEditClient = () => {
        // TODO: Implementar modal de editar cliente
        alert('Funcionalidade de editar cliente será implementada em breve');
    };

    const handleEditContact = () => {
        // TODO: Implementar modal de editar contato
        alert('Funcionalidade de editar contato será implementada em breve');
    };

    const handleAddResource = () => {
        setShowAddResource(true);
    };

    const confirmAddResource = () => {
        if (newResource.title && newResource.url) {
            setResources([...resources, { ...newResource, id: Date.now().toString() }]);
            setNewResource({ title: '', url: '', type: 'LINK' });
            setShowAddResource(false);
        }
    };

    const handleRemoveResource = (id) => {
        setResources(resources.filter(r => r.id !== id));
    };

    // Calculate days remaining
    const daysRemaining = Math.ceil((new Date(formData.dueDate) - new Date()) / (1000 * 60 * 60 * 24));

    // Helper to safely get the selected client object for display
    const selectedClient = clients.find(c => c.id === formData.client);

    return (
        <div className="layout-container flex h-full grow flex-col px-4 md:px-10 lg:px-40 py-8">
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-3">
                        <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                        <p className="text-slate-500 dark:text-slate-400">Carregando projeto...</p>
                    </div>
                </div>
            ) : (
                <form className="layout-content-container flex flex-col w-full max-w-[1200px] mx-auto flex-1 gap-6" onSubmit={handleSave}>
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-center gap-2">
                            <span className="material-symbols-outlined">error</span>
                            <span>{error}</span>
                        </div>
                    )}
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-[#92adc9]">
                        <Link className="hover:text-primary transition-colors" to="/">Home</Link>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        <Link className="hover:text-primary transition-colors" to="/projects">Projetos</Link>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        <span className="text-slate-900 dark:text-white font-medium">Editar Projeto</span>
                    </nav>

                    {/* Header with editable title */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex flex-col gap-3 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="flex-1 bg-transparent border border-transparent hover:border-slate-300 focus:border-primary focus:ring-0 rounded-md text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white px-2 -ml-2 transition-all"
                                    placeholder="Nome do Projeto"
                                />
                                <div className="relative">
                                    <select
                                        value={formData.category}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                        className="appearance-none pl-3 pr-8 py-1 rounded-full bg-primary/10 hover:bg-primary/20 border-none text-primary text-xs font-bold uppercase tracking-wider cursor-pointer focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-surface-dark transition-all"
                                    >
                                        <option value="Web Development">Web Development</option>
                                        <option value="Mobile App">Mobile App</option>
                                        <option value="Marketing Campaign">Marketing Campaign</option>
                                        <option value="Design System">Design System</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-primary pointer-events-none">expand_more</span>
                                </div>
                            </div>
                            <div className="w-full">
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows="2"
                                    className="w-full bg-transparent border border-transparent hover:border-slate-300 focus:border-primary focus:ring-0 rounded-md text-slate-500 dark:text-[#94a3b8] text-base resize-none px-2 -ml-2 transition-all"
                                    placeholder="Breve descrição do projeto..."
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 self-start mt-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-4 h-10 rounded-lg border border-slate-200 dark:border-[#334155] text-slate-700 dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-[#233648] transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-4 h-10 rounded-lg bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[20px]">save</span>
                                        Salvar Alterações
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-slate-200 dark:border-[#324d67]">
                        <div className="flex gap-8 overflow-x-auto">
                            <button
                                type="button"
                                onClick={() => setActiveTab('edit')}
                                className={`flex items-center gap-2 border-b-[3px] pb-3 pt-2 px-1 transition-colors ${activeTab === 'edit' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-[#92adc9] hover:text-slate-700 dark:hover:text-white'}`}
                            >
                                <span className="material-symbols-outlined text-[20px]">edit_note</span>
                                <span className="text-sm font-bold">Editar Detalhes</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('tasks')}
                                className={`flex items-center gap-2 border-b-[3px] pb-3 pt-2 px-1 transition-colors ${activeTab === 'tasks' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-[#92adc9] hover:text-slate-700 dark:hover:text-white'}`}
                            >
                                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                <span className="text-sm font-bold">Tarefas</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('versions')}
                                className={`flex items-center gap-2 border-b-[3px] pb-3 pt-2 px-1 transition-colors ${activeTab === 'versions' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-[#92adc9] hover:text-slate-700 dark:hover:text-white'}`}
                            >
                                <span className="material-symbols-outlined text-[20px]">history</span>
                                <span className="text-sm font-bold">Versões</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('settings')}
                                className={`flex items-center gap-2 border-b-[3px] pb-3 pt-2 px-1 transition-colors ${activeTab === 'settings' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-[#92adc9] hover:text-slate-700 dark:hover:text-white'}`}
                            >
                                <span className="material-symbols-outlined text-[20px]">settings</span>
                                <span className="text-sm font-bold">Configurações</span>
                            </button>
                        </div>
                    </div>

                    {/* Tab Content - Editar Detalhes */}
                    {activeTab === 'edit' && (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Status */}
                                <div className="bg-white dark:bg-surface-dark p-5 rounded-lg border border-slate-200 dark:border-border-dark flex flex-col gap-3 group hover:border-primary/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 dark:text-[#94a3b8] text-sm font-medium">Status</span>
                                        <span className="material-symbols-outlined text-green-500 text-[20px]">radio_button_checked</span>
                                    </div>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => handleInputChange('status', e.target.value)}
                                        className="w-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-600 rounded-md text-slate-900 dark:text-white font-bold focus:ring-primary focus:border-primary"
                                    >
                                        <option value="planning">Planejamento</option>
                                        <option value="progress">Em Progresso</option>
                                        <option value="review">Em Revisão</option>
                                        <option value="completed">Concluído</option>
                                    </select>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-1">
                                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${formData.completion}%` }}></div>
                                    </div>
                                </div>

                                {/* Prazo Estimado */}
                                <div className="bg-white dark:bg-surface-dark p-5 rounded-lg border border-slate-200 dark:border-border-dark flex flex-col gap-3 group hover:border-primary/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 dark:text-[#94a3b8] text-sm font-medium">Prazo Estimado</span>
                                        <span className="material-symbols-outlined text-orange-400 text-[20px]">schedule</span>
                                    </div>
                                    <input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                        className="w-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-600 rounded-md text-slate-900 dark:text-white font-bold focus:ring-primary focus:border-primary h-[42px]"
                                    />
                                    <span className="text-xs text-slate-400">{daysRemaining > 0 ? `${daysRemaining} Dias Restantes` : 'Prazo vencido'}</span>
                                </div>

                                {/* Conclusão Manual */}
                                <div className="bg-white dark:bg-surface-dark p-5 rounded-lg border border-slate-200 dark:border-border-dark flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 dark:text-[#94a3b8] text-sm font-medium">Conclusão Manual</span>
                                        <span className="material-symbols-outlined text-primary text-[20px]">trending_up</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.completion}
                                            onChange={(e) => handleInputChange('completion', parseInt(e.target.value) || 0)}
                                            className="w-20 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-600 rounded-md text-slate-900 dark:text-white font-bold focus:ring-primary focus:border-primary"
                                        />
                                        <span className="text-lg font-bold text-slate-500">%</span>
                                    </div>
                                    <span className="text-xs text-slate-400">32/45 Tarefas completas (Auto)</span>
                                </div>

                                {/* Equipe */}
                                <div className="bg-white dark:bg-surface-dark p-5 rounded-lg border border-slate-200 dark:border-border-dark flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 dark:text-[#94a3b8] text-sm font-medium">Equipe</span>
                                        <button type="button" onClick={handleAddTeamMember} className="text-primary hover:text-blue-600 transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">person_add</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <div className="flex -space-x-2">
                                            {teamMembers.slice(0, 5).map((member) => (
                                                <div
                                                    key={member.id}
                                                    className="size-8 rounded-full border-2 border-white dark:border-surface-dark bg-cover bg-center cursor-pointer hover:scale-110 transition-transform bg-gray-200"
                                                    style={{ backgroundImage: `url('${member.avatar || ''}')` }}
                                                    title={member.name}
                                                >
                                                    {!member.avatar && (
                                                        <span className="flex items-center justify-center h-full text-[10px] font-bold text-gray-500">
                                                            {member.name?.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                            {teamMembers.length > 5 && (
                                                <div className="size-8 rounded-full border-2 border-white dark:border-surface-dark bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                                    +{teamMembers.length - 5}
                                                </div>
                                            )}
                                        </div>
                                        <span onClick={handleManageTeam} className="text-xs text-primary font-medium cursor-pointer hover:underline">Gerenciar</span>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Column */}
                                <div className="lg:col-span-2 flex flex-col gap-6">
                                    {/* Descrição do Projeto */}
                                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
                                        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex justify-between items-center bg-slate-50/50 dark:bg-[#1e293b]">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Descrição do Projeto</h3>
                                            <div className="flex gap-2">
                                                <button type="button" className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded">
                                                    <span className="material-symbols-outlined text-[18px]">format_bold</span>
                                                </button>
                                                <button type="button" className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded">
                                                    <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-0">
                                            <textarea
                                                value={formData.longDescription}
                                                onChange={(e) => handleInputChange('longDescription', e.target.value)}
                                                rows="8"
                                                className="w-full min-h-[200px] p-6 bg-transparent border-none focus:ring-0 text-slate-600 dark:text-[#94a3b8] leading-relaxed resize-y"
                                                placeholder="Descreva os detalhes do projeto aqui..."
                                            />
                                        </div>
                                    </div>

                                    {/* Escopo & Entregáveis */}
                                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
                                        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex justify-between items-center bg-slate-50/50 dark:bg-[#1e293b]">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Escopo & Entregáveis</h3>
                                            <button
                                                type="button"
                                                onClick={handleAddDeliverable}
                                                className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">add</span> Adicionar Item
                                            </button>
                                        </div>
                                        <div className="p-6">
                                            <ul className="space-y-4">
                                                {deliverables.map((item) => (
                                                    <li key={item.id} className="flex items-start gap-3 group">
                                                        <select
                                                            value={item.status}
                                                            onChange={(e) => handleDeliverableChange(item.id, 'status', e.target.value)}
                                                            className={`mt-0.5 bg-transparent border-none focus:ring-0 p-0 w-6 cursor-pointer ${item.status === 'done' || item.status === 'COMPLETED' ? 'text-green-500' :
                                                                item.status === 'pending' || item.status === 'IN_PROGRESS' ? 'text-primary' :
                                                                    'text-slate-400 dark:text-slate-600'
                                                                }`}
                                                        >
                                                            <option value="done">✓</option>
                                                            <option value="pending">⋯</option>
                                                            <option value="todo">○</option>
                                                        </select>
                                                        <div className="flex-1 space-y-1">
                                                            <input
                                                                type="text"
                                                                value={item.title}
                                                                onChange={(e) => handleDeliverableChange(item.id, 'title', e.target.value)}
                                                                className="w-full p-1 -ml-1 text-slate-900 dark:text-white font-medium bg-transparent border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-primary rounded focus:ring-0 transition-colors"
                                                                placeholder="Título do entregável"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={item.description}
                                                                onChange={(e) => handleDeliverableChange(item.id, 'description', e.target.value)}
                                                                className="w-full p-1 -ml-1 text-sm text-slate-500 dark:text-slate-400 bg-transparent border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-primary rounded focus:ring-0 transition-colors"
                                                                placeholder="Descrição do entregável"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveDeliverable(item.id)}
                                                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Stack Tecnológica */}
                                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
                                        <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark bg-slate-50/50 dark:bg-[#1e293b]">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Stack Tecnológica</h3>
                                        </div>
                                        <div className="p-6">
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
                                                            onClick={() => setTechnologies(technologies.filter(t => t.id !== tech.id))}
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
                                                    onClick={() => {
                                                        if (selectedTech) {
                                                            const tech = availableTechnologies.find(t => t.id === selectedTech);
                                                            if (tech && !technologies.find(t => t.id === tech.id)) {
                                                                setTechnologies([...technologies, tech]);
                                                                setSelectedTech('');
                                                            }
                                                        }
                                                    }}
                                                    disabled={!selectedTech}
                                                    className="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">add</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Sidebar */}
                                <div className="flex flex-col gap-6">
                                    {/* Cliente */}
                                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-sm">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-[#94a3b8]">Cliente</h3>
                                            <button type="button" onClick={handleEditClient} className="text-xs text-primary font-bold hover:underline cursor-pointer">Editar Cliente</button>
                                        </div>
                                        <div className="mb-4">
                                            <select
                                                value={formData.client}
                                                onChange={(e) => handleInputChange('client', e.target.value)}
                                                className="w-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-600 rounded-md text-slate-900 dark:text-white text-sm p-2.5 focus:ring-primary focus:border-primary"
                                            >
                                                <option value="">Selecione um cliente...</option>
                                                {clients.map(client => (
                                                    <option key={client.id} value={client.id}>{client.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="size-12 rounded-lg bg-white dark:bg-white p-1 flex items-center justify-center border border-slate-200 dark:border-border-dark shrink-0">
                                                <svg className="size-8 text-slate-900" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-slate-900 dark:text-white leading-none mb-1">
                                                    {selectedClient?.name || 'Selecione um cliente'}
                                                </p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    {selectedClient ? [selectedClient.city, selectedClient.state || selectedClient.country].filter(Boolean).join(', ') : 'Endereço não disponível'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-slate-200 dark:border-border-dark">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Contato Principal</p>
                                            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="size-6 rounded-full bg-cover bg-gray-200"
                                                        style={{ backgroundImage: selectedClient?.logo ? "url('" + selectedClient.logo + "')" : 'none' }}
                                                    />
                                                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {selectedClient?.contactName || 'Sem contato'}
                                                    </span>
                                                </div>
                                                <button type="button" onClick={handleEditContact} className="text-slate-400 hover:text-primary">
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cronograma */}
                                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-sm">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-[#94a3b8] mb-4">Cronograma</h3>
                                        <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-6">
                                            <div className="relative">
                                                <div className="absolute -left-[21px] top-4 size-3 bg-green-500 rounded-full border-2 border-white dark:border-surface-dark"></div>
                                                <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Início</label>
                                                <input
                                                    type="date"
                                                    value={formData.startDate}
                                                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                                                    className="w-full text-sm p-1.5 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-[21px] top-4 size-3 bg-primary rounded-full border-2 border-white dark:border-surface-dark ring-4 ring-primary/20"></div>
                                                <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Estimativa</label>
                                                <input
                                                    type="date"
                                                    value={formData.estimateDate}
                                                    onChange={(e) => handleInputChange('estimateDate', e.target.value)}
                                                    className="w-full text-sm p-1.5 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-[21px] top-4 size-3 bg-slate-300 dark:bg-slate-600 rounded-full border-2 border-white dark:border-surface-dark"></div>
                                                <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Entrega Final</label>
                                                <input
                                                    type="date"
                                                    value={formData.deliveryDate}
                                                    onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                                                    className="w-full text-sm p-1.5 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recursos */}
                                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-sm">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-[#94a3b8] mb-4">Recursos</h3>
                                        <div className="flex flex-col gap-3">
                                            {resources.map((resource) => (
                                                <div key={resource.id} className="group flex items-center gap-2">
                                                    <div className="flex-1 flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-[#334155] hover:border-primary/50 transition-colors cursor-pointer">
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            <div className="bg-white dark:bg-[#233648] p-1.5 rounded-md shrink-0">
                                                                {resource.type === 'github' ? (
                                                                    <img
                                                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsJHnYtllVTWemL3s68JwRvuiN1OO8L5Mak6B0R6tZY9UstuTx7LCGeMEZTJpqy23ToeuYSqsfp_m-cBa5S01UxBH4qMFY6h_TqnBmZr1q9Dn-Nwmar9VX1tdml9US8MojFdmo01E8EMivw3qn69NufEH9fxPCjCgTLa10CHW94N7TRcsHKLiABdZRzSJ1qKXhpLZ3b9CVeXtD9gk1ramhCyDQsuuWZEPZt-thiuGFWsjUhLDESIqrsO3dXb2JjckmnBJjSGx9GcE"
                                                                        alt="GitHub Logo"
                                                                        className="size-5 dark:invert"
                                                                    />
                                                                ) : (
                                                                    <span className="material-symbols-outlined text-purple-500 text-[20px]">rocket_launch</span>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col min-w-0">
                                                                <span className="text-sm font-semibold text-slate-900 dark:text-white">{resource.title}</span>
                                                                <span className="text-xs text-slate-500 truncate">{resource.url}</span>
                                                            </div>
                                                        </div>
                                                        <span className="material-symbols-outlined text-slate-400 text-[18px]">open_in_new</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveResource(resource.id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </div>
                                            ))}
                                            {!showAddResource && (
                                                <button
                                                    type="button"
                                                    onClick={handleAddResource}
                                                    className="mt-2 w-full py-2 flex items-center justify-center gap-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">add_link</span>
                                                    Adicionar Recurso
                                                </button>
                                            )}

                                            {/* Simple Add Resource Form */}
                                            {showAddResource && (
                                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex flex-col gap-2 mt-2 border border-slate-200 dark:border-slate-700">
                                                    <input
                                                        type="text"
                                                        placeholder="Título (ex: Figma)"
                                                        className="text-sm p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                                        value={newResource.title}
                                                        onChange={e => setNewResource({ ...newResource, title: e.target.value })}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="URL (ex: https://...)"
                                                        className="text-sm p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                                        value={newResource.url}
                                                        onChange={e => setNewResource({ ...newResource, url: e.target.value })}
                                                    />
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowAddResource(false)}
                                                            className="text-xs px-3 py-1 text-slate-500 hover:text-slate-700"
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={confirmAddResource}
                                                            className="text-xs px-3 py-1 bg-primary text-white rounded hover:bg-blue-600"
                                                        >
                                                            Confirmar
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Tab Content - Tarefas */}
                    {activeTab === 'tasks' && (
                        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-[#111a22]">
                            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">check_circle</span>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-white">Gerenciamento de Tarefas</h3>
                            <p className="text-slate-500 dark:text-slate-400">Use o Kanban Board para gerenciar as tarefas deste projeto.</p>
                            <Link to={`/projects/${projectId}`} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                                Ir para Tarefas
                            </Link>
                        </div>
                    )}

                    {/* Tab Content - Versões */}
                    {activeTab === 'versions' && (
                        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-[#111a22]">
                            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">history</span>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-white">Histórico de Versões</h3>
                            <p className="text-slate-500 dark:text-slate-400">Visualize o histórico de alterações deste projeto.</p>
                        </div>
                    )}

                    {/* Tab Content - Configurações */}
                    {activeTab === 'settings' && (
                        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-[#111a22]">
                            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">settings</span>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-white">Configurações do Projeto</h3>
                            <p className="text-slate-500 dark:text-slate-400">Gerencie permissões, notificações e outras configurações.</p>
                        </div>
                    )}
                </form>
            )
            }
        </div >
    );
}
