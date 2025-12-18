import { useState } from 'react';
import { mockProjects } from '../data/mockData';

export default function ProjectsList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');

    const filteredProjects = mockProjects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.client.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'Todos' || project.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
                {/* Page Heading & Primary Action */}
                <div className="flex flex-wrap justify-between items-end gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                            Projetos
                        </h1>
                        <p className="text-base font-normal text-slate-500 dark:text-text-secondary">
                            Gerencie todos os seus projetos, prazos e equipes em um só lugar.
                        </p>
                    </div>
                    <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold leading-normal shadow-lg shadow-blue-500/20">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span className="truncate">Novo Projeto</span>
                    </button>
                </div>

                {/* Toolbar: Search & Filters */}
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between bg-[#192633] dark:bg-surface-dark p-2 rounded-xl border border-gray-200 dark:border-border-dark">
                    {/* Search Bar */}
                    <div className="flex w-full lg:max-w-md items-center rounded-lg bg-white dark:bg-[#233648] h-10 border border-transparent focus-within:border-primary transition-colors">
                        <div className="text-gray-400 dark:text-text-secondary pl-3 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </div>
                        <input
                            className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-text-secondary focus:ring-0 text-sm h-full px-3"
                            placeholder="Buscar por nome, cliente ou ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter Chips */}
                    <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
                        {['Todos', 'Em Andamento', 'Atrasado', 'Concluído', 'Planejamento'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-3 pr-2 border transition-colors ${statusFilter === status
                                        ? 'bg-primary border-primary text-white'
                                        : 'bg-white dark:bg-[#233648] border-gray-200 dark:border-border-dark text-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-[#324d67]'
                                    }`}
                            >
                                <span className="text-xs font-medium">{status}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Projects Table */}
                <div className="w-full">
                    <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-border-dark bg-white dark:bg-[#192633] shadow-xl shadow-black/5 dark:shadow-black/20">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-[#233648] border-b border-gray-200 dark:border-border-dark">
                                        <th className="px-6 py-4 text-gray-500 dark:text-text-secondary text-xs font-semibold uppercase tracking-wider w-[25%]">
                                            Nome do Projeto
                                        </th>
                                        <th className="px-6 py-4 text-gray-500 dark:text-text-secondary text-xs font-semibold uppercase tracking-wider w-[15%] hidden sm:table-cell">
                                            Cliente
                                        </th>
                                        <th className="px-6 py-4 text-gray-500 dark:text-text-secondary text-xs font-semibold uppercase tracking-wider w-[20%]">
                                            Progresso
                                        </th>
                                        <th className="px-6 py-4 text-gray-500 dark:text-text-secondary text-xs font-semibold uppercase tracking-wider w-[15%]">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-gray-500 dark:text-text-secondary text-xs font-semibold uppercase tracking-wider w-[15%] hidden md:table-cell">
                                            Prazo
                                        </th>
                                        <th className="px-6 py-4 text-gray-500 dark:text-text-secondary text-xs font-semibold uppercase tracking-wider w-[10%] text-right">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-border-dark">
                                    {filteredProjects.map((project) => (
                                        <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-[#233648]/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`bg-${project.color}-500/20 p-2 rounded-lg text-${project.color}-600 dark:text-${project.color}-400`}>
                                                        <span className="material-symbols-outlined">{project.icon}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium leading-normal text-slate-900 dark:text-white group-hover:text-primary transition-colors cursor-pointer">
                                                            {project.name}
                                                        </p>
                                                        <p className="text-xs mt-0.5 text-gray-500 dark:text-text-secondary md:hidden">
                                                            {project.client}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden sm:table-cell">
                                                <p className="text-sm font-normal text-gray-500 dark:text-text-secondary">{project.client}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5 w-full max-w-[140px]">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="font-medium text-slate-900 dark:text-white">{project.progress}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-[#324d67] overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${project.progress >= 75 ? 'bg-green-500' :
                                                                    project.progress >= 50 ? 'bg-primary' :
                                                                        project.progress >= 25 ? 'bg-orange-500' :
                                                                            'bg-red-500'
                                                                }`}
                                                            style={{ width: `${project.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${project.status === 'Concluído' ? 'bg-green-400/10 text-green-400 ring-green-400/30' :
                                                        project.status === 'Atrasado' ? 'bg-red-400/10 text-red-400 ring-red-400/30' :
                                                            project.status === 'Planejamento' ? 'bg-orange-400/10 text-orange-400 ring-orange-400/30' :
                                                                'bg-blue-400/10 text-blue-400 ring-blue-400/30'
                                                    }`}>
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <span className={`material-symbols-outlined text-[18px] ${project.status === 'Atrasado' ? 'text-red-400' : 'text-gray-400 dark:text-text-secondary'
                                                        }`}>
                                                        calendar_today
                                                    </span>
                                                    <span className={`text-sm ${project.status === 'Atrasado' ? 'text-red-400 font-medium' : 'text-gray-500 dark:text-text-secondary'
                                                        }`}>
                                                        {new Date(project.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-gray-400 dark:text-text-secondary hover:text-slate-900 dark:hover:text-white transition-colors p-1 rounded hover:bg-gray-100 dark:hover:bg-[#324d67]">
                                                    <span className="material-symbols-outlined">more_vert</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between border-t border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#192633] px-6 py-3">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-border-dark bg-white dark:bg-[#233648] px-4 py-2 text-sm font-medium text-gray-700 dark:text-text-secondary hover:bg-gray-50 dark:hover:bg-[#324d67]">
                                    Previous
                                </button>
                                <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-border-dark bg-white dark:bg-[#233648] px-4 py-2 text-sm font-medium text-gray-700 dark:text-text-secondary hover:bg-gray-50 dark:hover:bg-[#324d67]">
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-text-secondary">
                                        Mostrando <span className="font-medium text-slate-900 dark:text-white">1</span> a{' '}
                                        <span className="font-medium text-slate-900 dark:text-white">{filteredProjects.length}</span> de{' '}
                                        <span className="font-medium text-slate-900 dark:text-white">{mockProjects.length}</span> projetos
                                    </p>
                                </div>
                                <div>
                                    <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                        <a className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-text-secondary ring-1 ring-inset ring-gray-300 dark:ring-border-dark hover:bg-gray-50 dark:hover:bg-[#324d67] focus:z-20 focus:outline-offset-0" href="#">
                                            <span className="sr-only">Previous</span>
                                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                        </a>
                                        <a aria-current="page" className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white focus:z-20" href="#">
                                            1
                                        </a>
                                        <a className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-text-secondary ring-1 ring-inset ring-gray-300 dark:ring-border-dark hover:bg-gray-50 dark:hover:bg-[#324d67] focus:z-20 focus:outline-offset-0" href="#">
                                            2
                                        </a>
                                        <a className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-text-secondary ring-1 ring-inset ring-gray-300 dark:ring-border-dark hover:bg-gray-50 dark:hover:bg-[#324d67] focus:z-20 focus:outline-offset-0" href="#">
                                            <span className="sr-only">Next</span>
                                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                        </a>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
