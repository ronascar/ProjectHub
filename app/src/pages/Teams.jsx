import { useState, useMemo } from 'react';

// Mock team members data
const MOCK_MEMBERS = [
    { id: 1, name: 'Sarah Miller', email: 'sarah.m@taskmaster.com', avatar: 'https://i.pravatar.cc/100?u=sarah', initials: 'SM', color: 'purple', role: 'Administrator', roleIcon: 'verified_user', department: 'Management', projects: 8, workload: 80, isOnline: true },
    { id: 2, name: 'James Davidson', email: 'james.d@taskmaster.com', avatar: null, initials: 'JD', color: 'amber', role: 'Project Manager', roleIcon: 'manage_accounts', department: 'Product', projects: 5, workload: 55, isOnline: false },
    { id: 3, name: 'Ana Silva', email: 'ana.silva@taskmaster.com', avatar: 'https://i.pravatar.cc/100?u=ana', initials: 'AS', color: 'pink', role: 'Developer', roleIcon: 'code', department: 'Engineering', projects: 6, workload: 72, isOnline: true },
    { id: 4, name: 'Carlos Mendes', email: 'carlos.m@taskmaster.com', avatar: 'https://i.pravatar.cc/100?u=carlos', initials: 'CM', color: 'blue', role: 'Developer', roleIcon: 'code', department: 'Engineering', projects: 4, workload: 45, isOnline: true },
    { id: 5, name: 'Maria Santos', email: 'maria.s@taskmaster.com', avatar: null, initials: 'MS', color: 'green', role: 'Designer', roleIcon: 'palette', department: 'Product Design', projects: 3, workload: 65, isOnline: false },
    { id: 6, name: 'Roberto Lima', email: 'roberto.l@taskmaster.com', avatar: 'https://i.pravatar.cc/100?u=roberto', initials: 'RL', color: 'orange', role: 'Marketing Lead', roleIcon: 'campaign', department: 'Marketing', projects: 7, workload: 88, isOnline: true },
    { id: 7, name: 'Julia Ferreira', email: 'julia.f@taskmaster.com', avatar: null, initials: 'JF', color: 'cyan', role: 'Developer', roleIcon: 'code', department: 'Engineering', projects: 5, workload: 60, isOnline: true },
    { id: 8, name: 'Pedro Costa', email: 'pedro.c@taskmaster.com', avatar: 'https://i.pravatar.cc/100?u=pedro', initials: 'PC', color: 'indigo', role: 'Support Lead', roleIcon: 'support_agent', department: 'Customer Success', projects: 4, workload: 50, isOnline: false },
];

const DEPARTMENTS = ['Todos os Departamentos', 'Management', 'Engineering', 'Product', 'Product Design', 'Marketing', 'Customer Success'];

const getRoleClasses = (role) => {
    const classes = {
        'Administrator': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/30',
        'Project Manager': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30',
        'Developer': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30',
        'Designer': 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-900/30',
        'Marketing Lead': 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/30',
        'Support Lead': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/30',
    };
    return classes[role] || classes['Developer'];
};

const getWorkloadColor = (workload) => {
    if (workload >= 80) return 'bg-red-500';
    if (workload >= 60) return 'bg-amber-500';
    return 'bg-primary';
};

export default function Teams() {
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All Departments');
    const [roleFilter, setRoleFilter] = useState(null);
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter members
    const filteredMembers = useMemo(() => {
        return MOCK_MEMBERS.filter(member => {
            const matchSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.role.toLowerCase().includes(searchTerm.toLowerCase());
            const matchDepartment = departmentFilter === 'All Departments' || member.department === departmentFilter;
            const matchRole = !roleFilter || member.role === roleFilter;
            const matchOnline = !showOnlineOnly || member.isOnline;
            return matchSearch && matchDepartment && matchRole && matchOnline;
        });
    }, [searchTerm, departmentFilter, roleFilter, showOnlineOnly]);

    // Paginate
    const paginatedMembers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredMembers.slice(start, start + itemsPerPage);
    }, [filteredMembers, currentPage]);

    // Stats
    const stats = useMemo(() => {
        const activeMembers = MOCK_MEMBERS.filter(m => m.isOnline).length;
        const departments = [...new Set(MOCK_MEMBERS.map(m => m.department))].length;
        return { total: MOCK_MEMBERS.length, active: activeMembers, departments };
    }, []);

    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

    const toggleMemberSelection = (id) => {
        setSelectedMembers(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const clearFilters = () => {
        setSearchTerm('');
        setDepartmentFilter('All Departments');
        setRoleFilter(null);
        setShowOnlineOnly(false);
        setCurrentPage(1);
    };

    return (
        <div className="flex flex-1 justify-center py-6 px-4 sm:px-6 lg:px-8 bg-background-light dark:bg-background-dark min-h-full">
            <div className="flex w-full max-w-[1024px] flex-col gap-6">
                <div className="flex items-center gap-2 text-sm">
                    <a className="text-slate-500 dark:text-text-secondary hover:underline" href="#">Área de Trabalho</a>
                    <span className="text-slate-500 dark:text-text-secondary">/</span>
                    <span className="font-medium text-slate-900 dark:text-white">Gerenciamento de Equipe</span>
                </div>

                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl">Membros da Equipe</h1>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                            <p className="text-base text-slate-600 dark:text-text-secondary">{stats.active} membros ativos em {stats.departments} departamentos</p>
                        </div>
                    </div>
                    <button className="flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-md hover:bg-primary-hover transition-colors">
                        <span className="material-symbols-outlined text-[20px] mr-2">person_add</span>
                        Adicionar Membro
                    </button>
                </div>

                <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-gray-200 dark:border-border-dark">
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-text-secondary">search</span>
                            <input
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="h-12 w-full rounded-lg border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#111a22] pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-secondary focus:border-primary focus:ring-0"
                                placeholder="Buscar membros por nome, e-mail ou função..."
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="relative flex-1 md:w-48">
                                <select
                                    value={departmentFilter}
                                    onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
                                    className="h-12 w-full appearance-none rounded-lg border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#111a22] px-4 text-slate-900 dark:text-white focus:border-primary focus:ring-0"
                                >
                                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-text-secondary">expand_more</span>
                            </div>
                            <button
                                onClick={clearFilters}
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#111a22] text-slate-500 dark:text-text-secondary hover:border-primary hover:text-primary transition-colors"
                                title="Limpar filtros"
                            >
                                <span className="material-symbols-outlined">tune</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0">
                        <button
                            onClick={() => { setShowOnlineOnly(!showOnlineOnly); setCurrentPage(1); }}
                            className={`group flex h-8 shrink-0 items-center gap-2 rounded-lg px-3 transition-colors border ${showOnlineOnly
                                ? 'bg-primary/10 border-primary/30 hover:bg-primary/20'
                                : 'bg-gray-50 dark:bg-[#111a22] border-gray-200 dark:border-border-dark hover:bg-gray-100 dark:hover:bg-[#1a2632]'
                                }`}
                        >
                            <span className={`text-xs font-semibold ${showOnlineOnly ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>Ativos Agora</span>
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">{stats.active}</span>
                            {showOnlineOnly && <span className="material-symbols-outlined text-[16px] text-primary">close</span>}
                        </button>
                        <button
                            onClick={() => { setRoleFilter(roleFilter === 'Administrator' ? null : 'Administrator'); setCurrentPage(1); }}
                            className={`flex h-8 shrink-0 items-center gap-2 rounded-lg border px-3 transition-colors ${roleFilter === 'Administrator'
                                ? 'bg-purple-500/10 border-purple-300 dark:border-purple-900/30'
                                : 'bg-gray-50 dark:bg-[#111a22] border-gray-200 dark:border-border-dark hover:bg-gray-100 dark:hover:bg-[#1a2632]'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[18px] text-purple-500">admin_panel_settings</span>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Administradores</span>
                        </button>
                        <button
                            onClick={() => { setRoleFilter(roleFilter === 'Developer' ? null : 'Developer'); setCurrentPage(1); }}
                            className={`flex h-8 shrink-0 items-center gap-2 rounded-lg border px-3 transition-colors ${roleFilter === 'Developer'
                                ? 'bg-emerald-500/10 border-emerald-300 dark:border-emerald-900/30'
                                : 'bg-gray-50 dark:bg-[#111a22] border-gray-200 dark:border-border-dark hover:bg-gray-100 dark:hover:bg-[#1a2632]'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[18px] text-emerald-500">code</span>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Desenvolvedores</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark shadow-sm">
                    {/* Member List Header */}
                    <div className="hidden grid-cols-12 gap-4 border-b border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#111a22] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-text-secondary md:grid">
                        <div className="col-span-4 pl-8">Membro</div>
                        <div className="col-span-2">Função</div>
                        <div className="col-span-2">Departamento</div>
                        <div className="col-span-3">Carga de Trabalho</div>
                        <div className="col-span-1 text-right"></div>
                    </div>

                    {/* Member Items */}
                    {paginatedMembers.map((member) => (
                        <div key={member.id} className="group relative grid grid-cols-1 gap-4 border-b border-gray-200 dark:border-border-dark px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-[#1c2b3a] md:grid-cols-12 md:items-center">
                            <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                                <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                                    <input
                                        checked={selectedMembers.includes(member.id)}
                                        onChange={() => toggleMemberSelection(member.id)}
                                        className="h-5 w-5 rounded border-2 border-gray-300 dark:border-gray-600 bg-transparent text-primary focus:ring-0 checked:bg-primary checked:border-primary cursor-pointer transition-all"
                                        type="checkbox"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    {member.avatar ? (
                                        <div className="relative size-10 rounded-full bg-cover bg-center border border-gray-200 dark:border-border-dark" style={{ backgroundImage: `url("${member.avatar}")` }}>
                                            {member.isOnline && <div className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-500 border-2 border-white dark:border-[#1c2b3a]"></div>}
                                        </div>
                                    ) : (
                                        <div className={`relative flex size-10 items-center justify-center rounded-full bg-${member.color}-500 text-white font-bold text-sm border border-gray-200 dark:border-border-dark`}>
                                            {member.initials}
                                            {member.isOnline && <div className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-500 border-2 border-white dark:border-[#1c2b3a]"></div>}
                                        </div>
                                    )}
                                    <div className="flex flex-col text-slate-900 dark:text-white">
                                        <span className="text-sm font-semibold cursor-pointer hover:text-primary transition-colors">{member.name}</span>
                                        <span className="text-xs text-slate-500 dark:text-text-secondary">{member.email}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2 flex items-center gap-2">
                                <span className="md:hidden text-xs font-medium text-slate-500 uppercase w-20">Função:</span>
                                <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border ${getRoleClasses(member.role)}`}>
                                    <span className="material-symbols-outlined text-[16px]">{member.roleIcon}</span>
                                    {member.role}
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2 flex items-center gap-2">
                                <span className="md:hidden text-xs font-medium text-slate-500 uppercase w-20">Equipe:</span>
                                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{member.department}</div>
                            </div>
                            <div className="col-span-1 md:col-span-3 flex flex-col justify-center gap-1">
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-slate-500 dark:text-slate-400">{member.projects} Projetos Ativos</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{member.workload}%</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-slate-700">
                                    <div className={`h-1.5 rounded-full ${getWorkloadColor(member.workload)}`} style={{ width: `${member.workload}%` }}></div>
                                </div>
                            </div>
                            <div className="absolute right-4 top-4 md:static md:col-span-1 md:flex md:justify-end">
                                <button className="flex size-8 items-center justify-center rounded-full text-slate-400 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-[#233648] hover:text-slate-900 dark:hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">more_vert</span>
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredMembers.length === 0 && (
                        <div className="px-6 py-12 text-center">
                            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">search_off</span>
                            <p className="text-slate-500 dark:text-text-secondary">Nenhum membro encontrado com seus critérios</p>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-[#111a22]">
                        <p className="text-sm text-slate-500 dark:text-text-secondary">
                            Mostrando <span className="font-medium text-slate-900 dark:text-white">{((currentPage - 1) * itemsPerPage) + 1}</span> a <span className="font-medium text-slate-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredMembers.length)}</span> de <span className="font-medium text-slate-900 dark:text-white">{filteredMembers.length}</span> membros
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center justify-center rounded-lg border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-text-secondary hover:bg-gray-50 dark:hover:bg-[#233648] transition-colors disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="flex items-center justify-center rounded-lg border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-text-secondary hover:bg-gray-50 dark:hover:bg-[#233648] transition-colors disabled:opacity-50"
                            >
                                Próximo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
