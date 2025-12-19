import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Mock report data
const MOCK_REPORT_DATA = [
    { id: 1, project: 'App Redesign v2', client: 'TechCorp Inc.', collaborator: 'Ana Silva', initials: 'AS', color: 'purple', status: 'Concluído', hours: '24:30', value: 3675.00 },
    { id: 2, project: 'Web Platform', client: 'Global Market', collaborator: 'Carlos Mendes', initials: 'CM', color: 'blue', status: 'Em Progresso', hours: '12:15', value: 1837.50 },
    { id: 3, project: 'SEO Audit', client: 'Retail Kings', collaborator: 'Roberto Santos', initials: 'RS', color: 'pink', status: 'Concluído', hours: '08:00', value: 1200.00 },
    { id: 4, project: 'API Integration', client: 'TechCorp Inc.', collaborator: 'Ana Silva', initials: 'AS', color: 'purple', status: 'Revisão', hours: '04:45', value: 712.50 },
    { id: 5, project: 'Mobile App', client: 'Design Studio X', collaborator: 'Carlos Mendes', initials: 'CM', color: 'blue', status: 'Concluído', hours: '32:00', value: 4800.00 },
    { id: 6, project: 'Dashboard Analytics', client: 'Global Market', collaborator: 'Ana Silva', initials: 'AS', color: 'purple', status: 'Em Progresso', hours: '18:30', value: 2775.00 },
];

const RECENT_EXPORTS = [
    { id: 1, name: 'Relatório Financeiro', type: 'pdf', date: 'Jan 2024', size: '2.4 MB' },
    { id: 2, name: 'Horas por Projeto', type: 'excel', date: 'Ontem', size: '840 KB' },
    { id: 3, name: 'Clientes Ativos', type: 'csv', date: '2 dias atrás', size: '120 KB' },
];

const CLIENTS = ['Todos os Clientes', 'TechCorp Inc.', 'Design Studio X', 'Global Market', 'Retail Kings'];
const PROJECTS = ['Todos os Projetos', 'App Redesign v2', 'E-commerce Platform', 'Marketing Q3', 'Web Platform'];
const COLLABORATORS = ['Toda a Equipe', 'Ana Silva', 'Carlos Mendes', 'Roberto Santos'];

const getStatusClasses = (status) => {
    const classes = {
        'Concluído': 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
        'Em Progresso': 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
        'Revisão': 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',
    };
    return classes[status] || classes['Em Progresso'];
};

const getStatusDotColor = (status) => {
    const colors = {
        'Concluído': 'bg-emerald-500',
        'Em Progresso': 'bg-amber-500',
        'Revisão': 'bg-blue-500',
    };
    return colors[status] || 'bg-gray-500';
};

export default function Reports() {
    const [reportType, setReportType] = useState('hours');
    const [clientFilter, setClientFilter] = useState('Todos os Clientes');
    const [projectFilter, setProjectFilter] = useState('Todos os Projetos');
    const [collaboratorFilter, setCollaboratorFilter] = useState('Toda a Equipe');
    const [sendEmail, setSendEmail] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter data based on selections
    const filteredData = useMemo(() => {
        return MOCK_REPORT_DATA.filter(item => {
            const matchClient = clientFilter === 'Todos os Clientes' || item.client === clientFilter;
            const matchProject = projectFilter === 'Todos os Projetos' || item.project === projectFilter;
            const matchCollab = collaboratorFilter === 'Toda a Equipe' || item.collaborator === collaboratorFilter;
            return matchClient && matchProject && matchCollab;
        });
    }, [clientFilter, projectFilter, collaboratorFilter]);

    // Paginate data
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage]);

    // Calculate totals
    const totals = useMemo(() => {
        const totalMinutes = filteredData.reduce((acc, item) => {
            const [h, m] = item.hours.split(':').map(Number);
            return acc + (h * 60) + m;
        }, 0);
        const totalValue = filteredData.reduce((acc, item) => acc + item.value, 0);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return {
            hours: `${hours}:${minutes.toString().padStart(2, '0')}`,
            value: totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        };
    }, [filteredData]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleExport = (format) => {
        alert(`Exportando relatório em formato ${format.toUpperCase()}...${sendEmail ? ' (Cópia será enviada por e-mail)' : ''}`);
    };

    return (
        <div className="flex flex-col">
            <div className="flex-1 px-4 md:px-10 py-6 md:py-8 w-full max-w-[1400px] mx-auto">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <Link to="/" className="text-slate-500 dark:text-text-secondary hover:text-primary dark:hover:text-white transition-colors">Home</Link>
                    <span className="text-slate-400 dark:text-gray-600">/</span>
                    <span className="text-slate-500 dark:text-text-secondary">Relatórios</span>
                    <span className="text-slate-400 dark:text-gray-600">/</span>
                    <span className="text-slate-900 dark:text-white font-medium">Exportação</span>
                </div>

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Relatórios de Desempenho</h1>
                        <p className="text-slate-500 dark:text-text-secondary max-w-2xl">
                            Gere relatórios detalhados, filtre por múltiplos critérios e exporte seus dados para análise externa.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-lg text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-border-dark transition-colors text-sm font-medium shadow-sm">
                            <span className="material-symbols-outlined text-[18px]">history</span>
                            Histórico
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm shadow-blue-500/20">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Novo Modelo
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Main Column (Filters & Preview) */}
                    <div className="xl:col-span-3 flex flex-col gap-6">
                        {/* Configuration Card */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm p-5 md:p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Configuração do Relatório</h2>
                                <span className="material-symbols-outlined text-slate-400 cursor-help" title="Configurações de filtros">info</span>
                            </div>

                            {/* Report Type Selector */}
                            <div className="mb-6 bg-slate-100 dark:bg-background-dark p-1 rounded-lg inline-flex w-full md:w-auto">
                                {[
                                    { id: 'financial', label: 'Financeiro' },
                                    { id: 'hours', label: 'Horas Trabalhadas' },
                                    { id: 'tasks', label: 'Conclusão de Tarefas' }
                                ].map((type) => (
                                    <label key={type.id} className="flex-1 md:flex-none cursor-pointer">
                                        <input
                                            type="radio"
                                            name="report_type"
                                            value={type.id}
                                            checked={reportType === type.id}
                                            onChange={(e) => setReportType(e.target.value)}
                                            className="peer sr-only"
                                        />
                                        <div className="px-4 py-2 rounded-md text-sm font-medium text-slate-500 dark:text-text-secondary peer-checked:bg-white dark:peer-checked:bg-surface-dark peer-checked:text-primary dark:peer-checked:text-white peer-checked:shadow-sm transition-all text-center">
                                            {type.label}
                                        </div>
                                    </label>
                                ))}
                            </div>

                            {/* Filters Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Cliente</label>
                                    <div className="relative">
                                        <select
                                            value={clientFilter}
                                            onChange={(e) => { setClientFilter(e.target.value); setCurrentPage(1); }}
                                            className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 appearance-none"
                                        >
                                            {CLIENTS.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none text-[20px]">expand_more</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Projeto</label>
                                    <div className="relative">
                                        <select
                                            value={projectFilter}
                                            onChange={(e) => { setProjectFilter(e.target.value); setCurrentPage(1); }}
                                            className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 appearance-none"
                                        >
                                            {PROJECTS.map(p => <option key={p}>{p}</option>)}
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none text-[20px]">expand_more</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Colaborador</label>
                                    <div className="relative">
                                        <select
                                            value={collaboratorFilter}
                                            onChange={(e) => { setCollaboratorFilter(e.target.value); setCurrentPage(1); }}
                                            className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 appearance-none"
                                        >
                                            {COLLABORATORS.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none text-[20px]">expand_more</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Período</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                            <span className="material-symbols-outlined text-slate-400 text-[20px]">calendar_today</span>
                                        </div>
                                        <input type="text" className="bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full ps-10 p-2.5" placeholder="Últimos 30 dias" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-border-dark">
                                <button
                                    onClick={() => { setClientFilter('Todos os Clientes'); setProjectFilter('Todos os Projetos'); setCollaboratorFilter('Toda a Equipe'); }}
                                    className="px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary dark:text-blue-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                                    Limpar Filtros
                                </button>
                            </div>
                        </div>

                        {/* Live Preview Table */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm overflow-hidden flex flex-col flex-1">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex items-center justify-between bg-slate-50/50 dark:bg-surface-dark">
                                <h3 className="font-bold text-slate-900 dark:text-white">Prévia dos Dados</h3>
                                <span className="text-xs font-medium text-slate-500 bg-slate-200 dark:bg-border-dark px-2 py-1 rounded">
                                    Mostrando {paginatedData.length} de {filteredData.length} registros
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-slate-500 dark:text-text-secondary whitespace-nowrap">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-100/50 dark:bg-background-dark dark:text-slate-300">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 font-semibold">Projeto</th>
                                            <th scope="col" className="px-6 py-3 font-semibold">Cliente</th>
                                            <th scope="col" className="px-6 py-3 font-semibold">Colaborador</th>
                                            <th scope="col" className="px-6 py-3 font-semibold text-center">Status</th>
                                            <th scope="col" className="px-6 py-3 font-semibold text-right">Horas</th>
                                            <th scope="col" className="px-6 py-3 font-semibold text-right">Valor (R$)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                                        {paginatedData.map((item) => (
                                            <tr key={item.id} className="bg-white dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-background-dark/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{item.project}</td>
                                                <td className="px-6 py-4">{item.client}</td>
                                                <td className="px-6 py-4 flex items-center gap-2">
                                                    <div className={`size-6 rounded-full bg-${item.color}-500 flex items-center justify-center text-[10px] text-white font-bold`}>{item.initials}</div>
                                                    {item.collaborator}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusClasses(item.status)}`}>
                                                        <span className={`size-1.5 rounded-full ${getStatusDotColor(item.status)}`}></span> {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">{item.hours}</td>
                                                <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">
                                                    {item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </td>
                                            </tr>
                                        ))}
                                        {/* Summary Row */}
                                        <tr className="bg-slate-50 dark:bg-background-dark/60 font-semibold border-t-2 border-slate-200 dark:border-gray-700">
                                            <td className="px-6 py-4 text-right text-slate-900 dark:text-white" colSpan="4">Totais</td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-900 dark:text-white">{totals.hours}</td>
                                            <td className="px-6 py-4 text-right font-mono text-primary dark:text-blue-400">{totals.value}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination */}
                            <div className="bg-white dark:bg-surface-dark px-4 py-3 flex items-center justify-between border-t border-slate-200 dark:border-border-dark">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-text-secondary">
                                            Mostrando <span className="font-medium text-slate-900 dark:text-white">{((currentPage - 1) * itemsPerPage) + 1}</span> a <span className="font-medium text-slate-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> de <span className="font-medium text-slate-900 dark:text-white">{filteredData.length}</span> resultados
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-medium text-slate-500 dark:text-text-secondary hover:bg-slate-50 dark:hover:bg-background-dark disabled:opacity-50"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                            </button>
                                            {[...Array(totalPages)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i + 1
                                                            ? 'z-10 bg-primary/10 border-primary text-primary'
                                                            : 'bg-white dark:bg-surface-dark border-slate-300 dark:border-border-dark text-slate-500 dark:text-text-secondary hover:bg-slate-50 dark:hover:bg-background-dark'
                                                        }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-medium text-slate-500 dark:text-text-secondary hover:bg-slate-50 dark:hover:bg-background-dark disabled:opacity-50"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Export Actions Area */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl shadow-lg shadow-blue-500/20 p-6 flex flex-col justify-between text-white relative overflow-hidden group">
                                <div className="absolute -right-10 -top-10 size-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-1">Exportar Relatório</h3>
                                    <p className="text-blue-100 text-sm mb-6">Selecione o formato ideal para sua análise ou apresentação.</p>
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() => handleExport('pdf')}
                                            className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-white text-primary hover:bg-blue-50 py-3 rounded-lg font-bold text-sm transition-colors shadow-sm"
                                        >
                                            <span className="material-symbols-outlined">picture_as_pdf</span>
                                            PDF
                                        </button>
                                        <button
                                            onClick={() => handleExport('excel')}
                                            className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-blue-700/50 hover:bg-blue-700 text-white py-3 rounded-lg font-medium text-sm transition-colors border border-blue-400/30"
                                        >
                                            <span className="material-symbols-outlined">table_view</span>
                                            Excel
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 flex flex-col justify-center gap-4">
                                <h3 className="font-bold text-slate-900 dark:text-white">Outros Formatos</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleExport('csv')}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 dark:bg-background-dark hover:bg-slate-100 dark:hover:bg-border-dark border border-slate-200 dark:border-border-dark rounded-lg text-slate-600 dark:text-text-secondary transition-colors text-sm font-medium"
                                    >
                                        <span className="material-symbols-outlined text-green-600 dark:text-green-400">csv</span>
                                        CSV
                                    </button>
                                    <button
                                        onClick={() => handleExport('json')}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 dark:bg-background-dark hover:bg-slate-100 dark:hover:bg-border-dark border border-slate-200 dark:border-border-dark rounded-lg text-slate-600 dark:text-text-secondary transition-colors text-sm font-medium"
                                    >
                                        <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">data_object</span>
                                        JSON
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 pt-2">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={sendEmail}
                                            onChange={(e) => setSendEmail(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                        <span className="ms-3 text-sm font-medium text-slate-600 dark:text-text-secondary">Enviar cópia por e-mail</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (History & Stats) */}
                    <div className="xl:col-span-1 flex flex-col gap-6">
                        {/* Recent Exports */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                            <div className="p-4 border-b border-slate-200 dark:border-border-dark flex items-center justify-between">
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Exportações Recentes</h3>
                                <a href="#" className="text-xs text-primary hover:underline">Ver todas</a>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-border-dark">
                                {RECENT_EXPORTS.map((exp) => (
                                    <div key={exp.id} className="p-4 hover:bg-slate-50 dark:hover:bg-background-dark transition-colors group">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`size-8 rounded ${exp.type === 'pdf' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'} flex items-center justify-center shrink-0`}>
                                                    <span className="material-symbols-outlined text-[18px]">{exp.type === 'pdf' ? 'picture_as_pdf' : exp.type === 'excel' ? 'table_view' : 'csv'}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">{exp.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-text-secondary">{exp.date} • {exp.size}</p>
                                                </div>
                                            </div>
                                            <button className="text-slate-400 hover:text-primary dark:hover:text-white transition-colors">
                                                <span className="material-symbols-outlined text-[20px]">download</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Usage Stats / Promo */}
                        <div className="bg-slate-800 text-white rounded-xl overflow-hidden relative" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBIteGpBOfiTSxMoFeDTxu3ef9lP3u--zLdbDglZDZQzQCShm8RGO5k6bjYPIDVUsMldDKyvx94eDACgkkq38Pm64YNzlc2b-GogP3kioDIntMnhOcI1MXnQXqYBBaUW5SfBPosn1LUBDL374kz2ERFAxlKmelxwPJ01-FnRqOzvRFYCwb6WjUprTGRRRwbaNKszy8b0-fvrWo8jjSBfqRIYQhU0bQZedynyFYtaK0441LpkACwb08uXFySdPhGPh51HviELjPBGxM')", backgroundSize: "cover", backgroundPosition: "center" }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/40"></div>
                            <div className="relative p-6 flex flex-col gap-4">
                                <div className="flex items-center gap-2 text-blue-300">
                                    <span className="material-symbols-outlined">insights</span>
                                    <span className="text-xs font-bold uppercase tracking-wider">Insight IA</span>
                                </div>
                                <h3 className="text-lg font-bold leading-tight">Análise Preditiva Disponível</h3>
                                <p className="text-sm text-gray-300">Nossa IA detectou que o projeto <strong>App Redesign</strong> pode exceder o orçamento em 15%.</p>
                                <button className="mt-2 w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/10 rounded-lg text-sm font-medium transition-colors">
                                    Ver Detalhes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
