import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { reportsAPI, clientsAPI, projectsAPI, usersAPI } from '../services/api';

const getStatusClasses = (status) => {
    const classes = {
        'COMPLETED': 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
        'IN_PROGRESS': 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
        'REVIEW': 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',
        'PLANNING': 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400',
        'ON_HOLD': 'bg-gray-100 dark:bg-gray-500/10 text-gray-700 dark:text-gray-400',
    };
    return classes[status] || classes['IN_PROGRESS'];
};

const getStatusDotColor = (status) => {
    const colors = {
        'COMPLETED': 'bg-emerald-500',
        'IN_PROGRESS': 'bg-amber-500',
        'REVIEW': 'bg-blue-500',
        'PLANNING': 'bg-purple-500',
        'ON_HOLD': 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
};

const getStatusLabel = (status) => {
    const labels = {
        'COMPLETED': 'Concluído',
        'IN_PROGRESS': 'Em Progresso',
        'REVIEW': 'Revisão',
        'PLANNING': 'Planejamento',
        'ON_HOLD': 'Pausado',
        'CANCELLED': 'Cancelado'
    };
    return labels[status] || status;
};

export default function Reports() {
    const [loading, setLoading] = useState(true);
    const [reportType, setReportType] = useState('hours');
    const [reportData, setReportData] = useState([]);
    const [summary, setSummary] = useState(null);

    // Filter options
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);

    // Filters
    const [clientFilter, setClientFilter] = useState('all');
    const [projectFilter, setProjectFilter] = useState('all');
    const [userFilter, setUserFilter] = useState('all');
    const [sendEmail, setSendEmail] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Load filter options
    useEffect(() => {
        const loadFilters = async () => {
            try {
                const [clientsData, projectsData, usersData] = await Promise.all([
                    clientsAPI.list(),
                    projectsAPI.list(),
                    usersAPI.list()
                ]);
                setClients(clientsData);
                setProjects(projectsData);
                setUsers(usersData);
            } catch (error) {
                console.error('Error loading filters:', error);
            }
        };
        loadFilters();
    }, []);

    // Load report data
    useEffect(() => {
        const loadReportData = async () => {
            try {
                setLoading(true);
                const params = {};
                if (clientFilter && clientFilter !== 'all') params.clientId = clientFilter;
                if (projectFilter && projectFilter !== 'all') params.projectId = projectFilter;
                if (userFilter && userFilter !== 'all') params.userId = userFilter;
                if (reportType) params.reportType = reportType;

                const [data, summaryData] = await Promise.all([
                    reportsAPI.getData(params),
                    reportsAPI.getSummary(params)
                ]);

                setReportData(data);
                setSummary(summaryData);
            } catch (error) {
                console.error('Error loading report data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadReportData();
    }, [clientFilter, projectFilter, userFilter, reportType]);

    // Paginate data
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return reportData.slice(start, start + itemsPerPage);
    }, [reportData, currentPage]);

    // Calculate totals from summary
    const totals = useMemo(() => {
        if (!summary) return { hours: '0:00', value: 'R$ 0,00' };

        const hours = Math.floor(summary.totalHours);
        const minutes = Math.round((summary.totalHours - hours) * 60);

        return {
            hours: `${hours}:${minutes.toString().padStart(2, '0')}`,
            value: summary.totalBudget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            projects: summary.totalProjects,
            tasks: summary.totalTasks,
            completedTasks: summary.completedTasks,
            completionRate: summary.completionRate
        };
    }, [summary]);

    const totalPages = Math.ceil(reportData.length / itemsPerPage);

    const handleExport = async (format) => {
        try {
            const params = {};
            if (clientFilter && clientFilter !== 'all') params.clientId = clientFilter;
            if (projectFilter && projectFilter !== 'all') params.projectId = projectFilter;
            if (userFilter && userFilter !== 'all') params.userId = userFilter;

            await reportsAPI.export(format, params);

            if (sendEmail) {
                alert('Relatório exportado e enviado por e-mail!');
            }
        } catch (error) {
            console.error('Export error:', error);
            alert('Erro ao exportar relatório');
        }
    };

    const resetFilters = () => {
        setClientFilter('all');
        setProjectFilter('all');
        setUserFilter('all');
        setCurrentPage(1);
    };

    return (
        <div className="flex flex-col">
            <div className="flex-1 px-4 md:px-10 py-6 md:py-8 w-full max-w-[1400px] mx-auto">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <Link to="/" className="text-slate-500 dark:text-text-secondary hover:text-primary dark:hover:text-white transition-colors">Início</Link>
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
                </div>

                {/* Summary Stats */}
                {summary && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white dark:bg-surface-dark rounded-lg border border-slate-200 dark:border-border-dark p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase">Total Projetos</span>
                                <span className="material-symbols-outlined text-primary text-[20px]">folder</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totals.projects}</p>
                        </div>
                        <div className="bg-white dark:bg-surface-dark rounded-lg border border-slate-200 dark:border-border-dark p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase">Total Horas</span>
                                <span className="material-symbols-outlined text-blue-500 text-[20px]">schedule</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totals.hours}</p>
                        </div>
                        <div className="bg-white dark:bg-surface-dark rounded-lg border border-slate-200 dark:border-border-dark p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase">Tarefas</span>
                                <span className="material-symbols-outlined text-emerald-500 text-[20px]">task_alt</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totals.completedTasks}/{totals.tasks}</p>
                            <p className="text-xs text-slate-500 dark:text-text-secondary mt-1">{totals.completionRate}% concluído</p>
                        </div>
                        <div className="bg-white dark:bg-surface-dark rounded-lg border border-slate-200 dark:border-border-dark p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase">Orçamento Total</span>
                                <span className="material-symbols-outlined text-green-500 text-[20px]">payments</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totals.value}</p>
                        </div>
                    </div>
                )}

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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Cliente</label>
                                    <div className="relative">
                                        <select
                                            value={clientFilter}
                                            onChange={(e) => { setClientFilter(e.target.value); setCurrentPage(1); }}
                                            className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 appearance-none"
                                        >
                                            <option value="all">Todos os Clientes</option>
                                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                                            <option value="all">Todos os Projetos</option>
                                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none text-[20px]">expand_more</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Colaborador</label>
                                    <div className="relative">
                                        <select
                                            value={userFilter}
                                            onChange={(e) => { setUserFilter(e.target.value); setCurrentPage(1); }}
                                            className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 appearance-none"
                                        >
                                            <option value="all">Toda a Equipe</option>
                                            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none text-[20px]">expand_more</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-border-dark">
                                <button
                                    onClick={resetFilters}
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
                                    Mostrando {paginatedData.length} de {reportData.length} registros
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                                            <p className="text-slate-500 dark:text-slate-400">Carregando dados...</p>
                                        </div>
                                    </div>
                                ) : paginatedData.length === 0 ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="material-symbols-outlined text-4xl text-slate-400">analytics</span>
                                            <p className="text-slate-500 dark:text-slate-400">Nenhum dado encontrado para os filtros selecionados</p>
                                        </div>
                                    </div>
                                ) : (
                                    <table className="w-full text-sm text-left rtl:text-right text-slate-500 dark:text-text-secondary whitespace-nowrap">
                                        <thead className="text-xs text-slate-700 uppercase bg-slate-100/50 dark:bg-background-dark dark:text-slate-300">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 font-semibold">Projeto</th>
                                                <th scope="col" className="px-6 py-3 font-semibold">Cliente</th>
                                                <th scope="col" className="px-6 py-3 font-semibold">Colaborador</th>
                                                <th scope="col" className="px-6 py-3 font-semibold text-center">Status</th>
                                                <th scope="col" className="px-6 py-3 font-semibold text-right">Horas</th>
                                                <th scope="col" className="px-6 py-3 font-semibold text-right">Tarefas</th>
                                                <th scope="col" className="px-6 py-3 font-semibold text-right">Taxa Conclusão</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                                            {paginatedData.map((item) => (
                                                <tr key={item.id} className="bg-white dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-background-dark/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{item.projectName}</td>
                                                    <td className="px-6 py-4">{item.clientName}</td>
                                                    <td className="px-6 py-4 flex items-center gap-2">
                                                        <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold">
                                                            {item.userName.charAt(0).toUpperCase()}
                                                        </div>
                                                        {item.userName}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusClasses(item.projectStatus)}`}>
                                                            <span className={`size-1.5 rounded-full ${getStatusDotColor(item.projectStatus)}`}></span> {getStatusLabel(item.projectStatus)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">
                                                        {Math.floor(item.totalHours)}:{Math.round((item.totalHours % 1) * 60).toString().padStart(2, '0')}
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">
                                                        {item.completedTasks}/{item.totalTasks}
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">
                                                        {item.completionRate}%
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            {/* Pagination */}
                            {!loading && reportData.length > 0 && (
                                <div className="bg-white dark:bg-surface-dark px-4 py-3 flex items-center justify-between border-t border-slate-200 dark:border-border-dark">
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-text-secondary">
                                                Mostrando <span className="font-medium text-slate-900 dark:text-white">{((currentPage - 1) * itemsPerPage) + 1}</span> a <span className="font-medium text-slate-900 dark:text-white">{Math.min(currentPage * itemsPerPage, reportData.length)}</span> de <span className="font-medium text-slate-900 dark:text-white">{reportData.length}</span> resultados
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
                                                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                                    const pageNum = i + 1;
                                                    return (
                                                        <button
                                                            key={i}
                                                            onClick={() => setCurrentPage(pageNum)}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                                                                ? 'z-10 bg-primary/10 border-primary text-primary'
                                                                : 'bg-white dark:bg-surface-dark border-slate-300 dark:border-border-dark text-slate-500 dark:text-text-secondary hover:bg-slate-50 dark:hover:bg-background-dark'
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                })}
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
                            )}
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
                                            onClick={() => handleExport('json')}
                                            className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-white text-primary hover:bg-blue-50 py-3 rounded-lg font-bold text-sm transition-colors shadow-sm"
                                        >
                                            <span className="material-symbols-outlined">data_object</span>
                                            JSON
                                        </button>
                                        <button
                                            onClick={() => handleExport('csv')}
                                            className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-blue-700/50 hover:bg-blue-700 text-white py-3 rounded-lg font-medium text-sm transition-colors border border-blue-400/30"
                                        >
                                            <span className="material-symbols-outlined">table_view</span>
                                            CSV
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 flex flex-col justify-center gap-4">
                                <h3 className="font-bold text-slate-900 dark:text-white">Opções de Exportação</h3>
                                <div className="flex items-center gap-3">
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
                                <p className="text-xs text-slate-500 dark:text-text-secondary">
                                    {reportData.length} registro(s) será(ão) exportado(s)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Stats) */}
                    <div className="xl:col-span-1 flex flex-col gap-6">
                        {/* Stats Summary */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm p-5">
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Resumo Estatístico</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-slate-500 dark:text-text-secondary">Taxa de Conclusão</span>
                                        <span className="text-xs font-bold text-primary">{totals.completionRate}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${totals.completionRate}%` }}></div>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-slate-100 dark:border-border-dark">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-xs text-slate-500">Projetos Ativos</span>
                                        <span className="text-xs font-bold">{totals.projects}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-xs text-slate-500">Total de Tarefas</span>
                                        <span className="text-xs font-bold">{totals.tasks}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-slate-500">Horas Trabalhadas</span>
                                        <span className="text-xs font-bold font-mono">{totals.hours}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl overflow-hidden relative shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            <div className="relative p-6 flex flex-col gap-4">
                                <div className="flex items-center gap-2 text-blue-300">
                                    <span className="material-symbols-outlined">info</span>
                                    <span className="text-xs font-bold uppercase tracking-wider">Dica</span>
                                </div>
                                <h3 className="text-lg font-bold leading-tight">Exportação Rápida</h3>
                                <p className="text-sm text-gray-300">
                                    Use filtros para refinar seus dados antes de exportar. Os relatórios refletem exatamente o que você visualiza.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
