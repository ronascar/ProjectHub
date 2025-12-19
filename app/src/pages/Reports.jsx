import React from 'react';
import { Link } from 'react-router-dom';

export default function Reports() {
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
                                <label className="flex-1 md:flex-none cursor-pointer">
                                    <input type="radio" name="report_type" value="financial" className="peer sr-only" />
                                    <div className="px-4 py-2 rounded-md text-sm font-medium text-slate-500 dark:text-text-secondary peer-checked:bg-white dark:peer-checked:bg-surface-dark peer-checked:text-primary dark:peer-checked:text-white peer-checked:shadow-sm transition-all text-center">
                                        Financeiro
                                    </div>
                                </label>
                                <label className="flex-1 md:flex-none cursor-pointer">
                                    <input type="radio" name="report_type" value="hours" className="peer sr-only" defaultChecked />
                                    <div className="px-4 py-2 rounded-md text-sm font-medium text-slate-500 dark:text-text-secondary peer-checked:bg-white dark:peer-checked:bg-surface-dark peer-checked:text-primary dark:peer-checked:text-white peer-checked:shadow-sm transition-all text-center">
                                        Horas Trabalhadas
                                    </div>
                                </label>
                                <label className="flex-1 md:flex-none cursor-pointer">
                                    <input type="radio" name="report_type" value="tasks" className="peer sr-only" />
                                    <div className="px-4 py-2 rounded-md text-sm font-medium text-slate-500 dark:text-text-secondary peer-checked:bg-white dark:peer-checked:bg-surface-dark peer-checked:text-primary dark:peer-checked:text-white peer-checked:shadow-sm transition-all text-center">
                                        Conclusão de Tarefas
                                    </div>
                                </label>
                            </div>

                            {/* Filters Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Cliente</label>
                                    <div className="relative">
                                        <select className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 appearance-none">
                                            <option>Todos os Clientes</option>
                                            <option>TechCorp Inc.</option>
                                            <option>Design Studio X</option>
                                            <option>Global Market Ltd.</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none text-[20px]">expand_more</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Projeto</label>
                                    <div className="relative">
                                        <select className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 appearance-none">
                                            <option>Todos os Projetos</option>
                                            <option>App Redesign v2</option>
                                            <option>E-commerce Platform</option>
                                            <option>Marketing Q3</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none text-[20px]">expand_more</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase tracking-wider">Colaborador</label>
                                    <div className="relative">
                                        <select className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 appearance-none">
                                            <option>Toda a Equipe</option>
                                            <option>Ana Silva</option>
                                            <option>Carlos Mendes</option>
                                            <option>Roberto Santos</option>
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
                                <button className="px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary dark:text-blue-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                                    Atualizar Prévia
                                </button>
                            </div>
                        </div>

                        {/* Live Preview Table */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm overflow-hidden flex flex-col flex-1">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex items-center justify-between bg-slate-50/50 dark:bg-surface-dark">
                                <h3 className="font-bold text-slate-900 dark:text-white">Prévia dos Dados</h3>
                                <span className="text-xs font-medium text-slate-500 bg-slate-200 dark:bg-border-dark px-2 py-1 rounded">Mostrando 5 de 142 registros</span>
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
                                        <tr className="bg-white dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-background-dark/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">App Redesign v2</td>
                                            <td className="px-6 py-4">TechCorp Inc.</td>
                                            <td className="px-6 py-4 flex items-center gap-2">
                                                <div className="size-6 rounded-full bg-purple-500 flex items-center justify-center text-[10px] text-white font-bold">AS</div>
                                                Ana Silva
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                                    <span className="size-1.5 rounded-full bg-emerald-500"></span> Concluído
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">24:30</td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">R$ 3.675,00</td>
                                        </tr>
                                        <tr className="bg-white dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-background-dark/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Web Platform</td>
                                            <td className="px-6 py-4">Global Market</td>
                                            <td className="px-6 py-4 flex items-center gap-2">
                                                <div className="size-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">CM</div>
                                                Carlos Mendes
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                                                    <span className="size-1.5 rounded-full bg-amber-500"></span> Em Progresso
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">12:15</td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">R$ 1.837,50</td>
                                        </tr>
                                        <tr className="bg-white dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-background-dark/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">SEO Audit</td>
                                            <td className="px-6 py-4">Retail Kings</td>
                                            <td className="px-6 py-4 flex items-center gap-2">
                                                <div className="size-6 rounded-full bg-pink-500 flex items-center justify-center text-[10px] text-white font-bold">RS</div>
                                                Roberto Santos
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                                    <span className="size-1.5 rounded-full bg-emerald-500"></span> Concluído
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">08:00</td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">R$ 1.200,00</td>
                                        </tr>
                                        <tr className="bg-white dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-background-dark/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">API Integration</td>
                                            <td className="px-6 py-4">TechCorp Inc.</td>
                                            <td className="px-6 py-4 flex items-center gap-2">
                                                <div className="size-6 rounded-full bg-purple-500 flex items-center justify-center text-[10px] text-white font-bold">AS</div>
                                                Ana Silva
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400">
                                                    <span className="size-1.5 rounded-full bg-blue-500"></span> Revisão
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">04:45</td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">R$ 712,50</td>
                                        </tr>
                                        {/* Summary Row */}
                                        <tr className="bg-slate-50 dark:bg-background-dark/60 font-semibold border-t-2 border-slate-200 dark:border-gray-700">
                                            <td className="px-6 py-4 text-right text-slate-900 dark:text-white" colSpan="4">Totais</td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-900 dark:text-white">49:30</td>
                                            <td className="px-6 py-4 text-right font-mono text-primary dark:text-blue-400">R$ 7.425,00</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination */}
                            <div className="bg-white dark:bg-surface-dark px-4 py-3 flex items-center justify-between border-t border-slate-200 dark:border-border-dark">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-text-secondary">
                                            Mostrando <span className="font-medium text-slate-900 dark:text-white">1</span> a <span className="font-medium text-slate-900 dark:text-white">5</span> de <span className="font-medium text-slate-900 dark:text-white">142</span> resultados
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-medium text-slate-500 dark:text-text-secondary hover:bg-slate-50 dark:hover:bg-background-dark">
                                                <span className="sr-only">Anterior</span>
                                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                            </a>
                                            <a href="#" aria-current="page" className="z-10 bg-primary/10 border-primary text-primary relative inline-flex items-center px-4 py-2 border text-sm font-medium">1</a>
                                            <a href="#" className="bg-white dark:bg-surface-dark border-slate-300 dark:border-border-dark text-slate-500 dark:text-text-secondary hover:bg-slate-50 dark:hover:bg-background-dark relative inline-flex items-center px-4 py-2 border text-sm font-medium">2</a>
                                            <a href="#" className="bg-white dark:bg-surface-dark border-slate-300 dark:border-border-dark text-slate-500 dark:text-text-secondary hover:bg-slate-50 dark:hover:bg-background-dark relative inline-flex items-center px-4 py-2 border text-sm font-medium">3</a>
                                            <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-medium text-slate-500 dark:text-text-secondary hover:bg-slate-50 dark:hover:bg-background-dark">
                                                <span className="sr-only">Próximo</span>
                                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                            </a>
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
                                        <button className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-white text-primary hover:bg-blue-50 py-3 rounded-lg font-bold text-sm transition-colors shadow-sm">
                                            <span className="material-symbols-outlined">picture_as_pdf</span>
                                            PDF
                                        </button>
                                        <button className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-blue-700/50 hover:bg-blue-700 text-white py-3 rounded-lg font-medium text-sm transition-colors border border-blue-400/30">
                                            <span className="material-symbols-outlined">table_view</span>
                                            Excel
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 flex flex-col justify-center gap-4">
                                <h3 className="font-bold text-slate-900 dark:text-white">Outros Formatos</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 dark:bg-background-dark hover:bg-slate-100 dark:hover:bg-border-dark border border-slate-200 dark:border-border-dark rounded-lg text-slate-600 dark:text-text-secondary transition-colors text-sm font-medium">
                                        <span className="material-symbols-outlined text-green-600 dark:text-green-400">csv</span>
                                        CSV
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 dark:bg-background-dark hover:bg-slate-100 dark:hover:bg-border-dark border border-slate-200 dark:border-border-dark rounded-lg text-slate-600 dark:text-text-secondary transition-colors text-sm font-medium">
                                        <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">data_object</span>
                                        JSON
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 pt-2">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" value="" className="sr-only peer" />
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
                                <div className="p-4 hover:bg-slate-50 dark:hover:bg-background-dark transition-colors group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">Relatório Financeiro</p>
                                                <p className="text-xs text-slate-500 dark:text-text-secondary">Jan 2024 • 2.4 MB</p>
                                            </div>
                                        </div>
                                        <button className="text-slate-400 hover:text-primary dark:hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">download</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 hover:bg-slate-50 dark:hover:bg-background-dark transition-colors group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-[18px]">table_view</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">Horas por Projeto</p>
                                                <p className="text-xs text-slate-500 dark:text-text-secondary">Ontem • 840 KB</p>
                                            </div>
                                        </div>
                                        <button className="text-slate-400 hover:text-primary dark:hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">download</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 hover:bg-slate-50 dark:hover:bg-background-dark transition-colors group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-[18px]">csv</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">Clientes Ativos</p>
                                                <p className="text-xs text-slate-500 dark:text-text-secondary">2 dias atrás • 120 KB</p>
                                            </div>
                                        </div>
                                        <button className="text-slate-400 hover:text-primary dark:hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">download</span>
                                        </button>
                                    </div>
                                </div>
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
