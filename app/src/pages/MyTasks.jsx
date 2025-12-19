import React from 'react';
import { Link } from 'react-router-dom';

export default function MyTasks() {
    return (
        <div className="flex flex-1 justify-center py-6 px-4 sm:px-6 lg:px-8 overflow-y-auto">
            <div className="flex w-full max-w-[1024px] flex-col gap-6">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm">
                    <Link className="text-gray-500 dark:text-[#92adc9] hover:text-primary transition-colors" to="/">Área de Trabalho</Link>
                    <span className="text-gray-400 dark:text-gray-600">/</span>
                    <span className="font-medium text-slate-900 dark:text-white">Minhas Tarefas</span>
                </div>

                {/* Page Heading & Stats */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl">Minhas Tarefas</h1>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                            <p className="text-base text-gray-500 dark:text-[#92adc9]">12 tarefas ativas restantes</p>
                        </div>
                    </div>
                    {/* Mobile Create Button (visible only on small screens) */}
                    <Link to="/tasks/create" className="sm:hidden flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white">
                        Criar Tarefa
                    </Link>
                    {/* Desktop Create Button */}
                    <Link to="/tasks/create" className="hidden sm:flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-md hover:bg-blue-600 transition-colors">
                        <span className="material-symbols-outlined text-[20px] mr-2">add</span>
                        Criar Tarefa
                    </Link>
                </div>

                {/* Filters & Controls */}
                <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-gray-200 dark:border-border-dark">
                    {/* Top Row: Search & Dropdowns */}
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#92adc9]">search</span>
                            <input className="h-12 w-full rounded-lg border border-gray-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#64748b] focus:border-primary focus:ring-0 outline-none" placeholder="Buscar tarefas por nome..." />
                        </div>
                        <div className="flex gap-4">
                            <div className="relative flex-1 md:w-48">
                                <select className="h-12 w-full appearance-none rounded-lg border border-gray-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark px-4 text-slate-900 dark:text-white focus:border-primary focus:ring-0 outline-none cursor-pointer">
                                    <option>Todos os Projetos</option>
                                    <option>Redesign do Site</option>
                                    <option>Aplicativo Móvel</option>
                                    <option>Marketing Q4</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-[#92adc9]">expand_more</span>
                            </div>
                            <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark text-gray-400 dark:text-[#92adc9] hover:border-primary hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">filter_list</span>
                            </button>
                        </div>
                    </div>
                    {/* Bottom Row: Chips */}
                    <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <button className="group flex h-8 shrink-0 items-center gap-2 rounded-lg bg-primary/10 px-3 hover:bg-primary/20 transition-colors border border-transparent hover:border-primary/30">
                            <span className="text-xs font-semibold text-primary">Vence Hoje</span>
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">3</span>
                            <span className="material-symbols-outlined text-[16px] text-primary">close</span>
                        </button>
                        <button className="flex h-8 shrink-0 items-center gap-2 rounded-lg border border-gray-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark px-3 hover:bg-slate-100 dark:hover:bg-[#1a2632] transition-colors">
                            <span className="material-symbols-outlined text-[18px] text-red-500 icon-fill">flag</span>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Alta Prioridade</span>
                        </button>
                        <button className="flex h-8 shrink-0 items-center gap-2 rounded-lg border border-gray-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark px-3 hover:bg-slate-100 dark:hover:bg-[#1a2632] transition-colors">
                            <span className="material-symbols-outlined text-[18px] text-orange-500">warning</span>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Atrasado</span>
                        </button>
                        <button className="flex h-8 shrink-0 items-center gap-2 rounded-lg border border-gray-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark px-3 hover:bg-slate-100 dark:hover:bg-[#1a2632] transition-colors">
                            <span className="material-symbols-outlined text-[18px] text-purple-500">person</span>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Atribuído a mim</span>
                        </button>
                    </div>
                </div>

                {/* Tasks List */}
                <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark shadow-sm">
                    {/* Table Header */}
                    <div className="hidden grid-cols-12 gap-4 border-b border-gray-200 dark:border-border-dark bg-slate-50 dark:bg-background-dark px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-[#92adc9] md:grid">
                        <div className="col-span-5 pl-8">Nome da Tarefa</div>
                        <div className="col-span-2">Data de Entrega</div>
                        <div className="col-span-2">Prioridade</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1 text-right"></div>
                    </div>

                    {/* Task Item 1 */}
                    <div className="group relative grid grid-cols-1 gap-4 border-b border-gray-200 dark:border-border-dark px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-[#1c2b3a] md:grid-cols-12 md:items-center">
                        {/* Checkbox & Title */}
                        <div className="col-span-1 md:col-span-5 flex items-start md:items-center gap-4">
                            <div className="relative flex h-5 w-5 shrink-0 items-center justify-center pt-1 md:pt-0">
                                <input className="h-5 w-5 rounded border-2 border-gray-300 dark:border-gray-600 bg-transparent text-primary focus:ring-0 checked:bg-primary checked:border-primary cursor-pointer transition-all" type="checkbox" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Link to="/tasks/1/edit" className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors cursor-pointer">Design Homepage Hero Section</Link>
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#92adc9]">
                                    <span className="inline-block size-2 rounded-full bg-indigo-500"></span>
                                    <span>Redesign do Site</span>
                                </div>
                            </div>
                        </div>
                        {/* Due Date */}
                        <div className="col-span-1 md:col-span-2 pl-9 md:pl-0 flex items-center gap-2">
                            <span className="md:hidden text-xs font-medium text-gray-500 dark:text-[#92adc9] uppercase w-20">Due:</span>
                            <div className="flex items-center gap-2 text-sm font-medium text-red-500">
                                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                <span>Hoje</span>
                            </div>
                        </div>
                        {/* Priority */}
                        <div className="col-span-1 md:col-span-2 pl-9 md:pl-0 flex items-center gap-2">
                            <span className="md:hidden text-xs font-medium text-gray-500 dark:text-[#92adc9] uppercase w-20">Priority:</span>
                            <div className="flex items-center gap-1.5 rounded bg-red-500/10 px-2 py-1 text-xs font-bold text-red-500">
                                <span className="material-symbols-outlined text-[16px] icon-fill">flag</span>
                                Urgente
                            </div>
                        </div>
                        {/* Status */}
                        <div className="col-span-1 md:col-span-2 pl-9 md:pl-0 flex items-center gap-2">
                            <span className="md:hidden text-xs font-medium text-gray-500 dark:text-[#92adc9] uppercase w-20">Status:</span>
                            <div className="flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/20 px-3 py-1">
                                <span className="size-2 rounded-full bg-blue-500 animate-pulse"></span>
                                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Em Andamento</span>
                            </div>
                        </div>
                        {/* Actions */}
                        <div className="absolute right-4 top-4 md:static md:col-span-1 md:flex md:justify-end">
                            <button className="flex size-8 items-center justify-center rounded-full text-gray-400 dark:text-[#92adc9] hover:bg-slate-200 dark:hover:bg-[#233648] hover:text-slate-900 dark:hover:text-white transition-colors">
                                <span className="material-symbols-outlined">more_vert</span>
                            </button>
                        </div>
                    </div>

                    {/* Task Item 2 */}
                    <div className="group relative grid grid-cols-1 gap-4 border-b border-gray-200 dark:border-border-dark px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-[#1c2b3a] md:grid-cols-12 md:items-center">
                        <div className="col-span-1 md:col-span-5 flex items-start md:items-center gap-4">
                            <div className="relative flex h-5 w-5 shrink-0 items-center justify-center pt-1 md:pt-0">
                                <input className="h-5 w-5 rounded border-2 border-gray-300 dark:border-gray-600 bg-transparent text-primary focus:ring-0 checked:bg-primary checked:border-primary cursor-pointer transition-all" type="checkbox" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Link to="/tasks/2/edit" className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors cursor-pointer">Fix Login API Response</Link>
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#92adc9]">
                                    <span className="inline-block size-2 rounded-full bg-emerald-500"></span>
                                    <span>Aplicativo Móvel</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2 pl-9 md:pl-0 flex items-center gap-2">
                            <span className="md:hidden text-xs font-medium text-gray-500 dark:text-[#92adc9] uppercase w-20">Due:</span>
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <span>Amanhã</span>
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2 pl-9 md:pl-0 flex items-center gap-2">
                            <span className="md:hidden text-xs font-medium text-gray-500 dark:text-[#92adc9] uppercase w-20">Priority:</span>
                            <div className="flex items-center gap-1.5 rounded bg-orange-500/10 px-2 py-1 text-xs font-bold text-orange-500">
                                <span className="material-symbols-outlined text-[16px] icon-fill">flag</span>
                                Alta
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2 pl-9 md:pl-0 flex items-center gap-2">
                            <span className="md:hidden text-xs font-medium text-gray-500 dark:text-[#92adc9] uppercase w-20">Status:</span>
                            <div className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-1">
                                <span className="size-2 rounded-full bg-gray-400"></span>
                                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">A Fazer</span>
                            </div>
                        </div>
                        <div className="absolute right-4 top-4 md:static md:col-span-1 md:flex md:justify-end">
                            <button className="flex size-8 items-center justify-center rounded-full text-gray-400 dark:text-[#92adc9] hover:bg-slate-200 dark:hover:bg-[#233648] hover:text-slate-900 dark:hover:text-white transition-colors">
                                <span className="material-symbols-outlined">more_vert</span>
                            </button>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-background-dark">
                        <p className="text-sm text-gray-500 dark:text-[#92adc9]">
                            Mostrando <span className="font-medium text-slate-900 dark:text-white">1</span> a <span className="font-medium text-slate-900 dark:text-white">4</span> de <span className="font-medium text-slate-900 dark:text-white">12</span> tarefas
                        </p>
                        <div className="flex gap-2">
                            <button className="flex items-center justify-center rounded-lg border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-[#92adc9] hover:bg-slate-50 dark:hover:bg-[#233648] disabled:opacity-50">
                                Anterior
                            </button>
                            <button className="flex items-center justify-center rounded-lg border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-[#92adc9] hover:bg-slate-50 dark:hover:bg-[#233648]">
                                Próximo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
