import React, { useState, useMemo } from 'react';

// Mock data para atividades
const MOCK_ACTIVITIES = [
    { id: 1, user: 'Ricardo Silva', avatar: 'https://i.pravatar.cc/100?u=ricardo', action: 'moveu', task: 'TASK-1024', status: 'Concluído', message: 'Implementação do fluxo de autenticação via OAuth2 finalizada.', time: '2m atrás', tags: ['backend', 'security'], type: 'status', date: new Date() },
    { id: 2, user: 'Ana Costa', avatar: 'https://i.pravatar.cc/100?u=ana2', action: 'atualizou o design de', task: 'TASK-1010', message: 'Dashboard_v2_Dark.fig', time: '45m atrás', type: 'file', date: new Date(Date.now() - 45 * 60000) },
    { id: 3, user: 'System', avatar: null, action: 'registrou novo commit na branch', branch: 'feat/user-profile', commit: '8a2b3c', commitMsg: 'Fix: avatar rendering issue on mobile devices', time: '2h atrás', type: 'commit', date: new Date(Date.now() - 2 * 3600000) },
    { id: 4, user: 'Carlos Mendes', avatar: 'https://i.pravatar.cc/100?u=carlos2', action: 'publicou release', version: 'v1.2.0', message: 'Release candidate aprovado. Deploy automático iniciado para produção.', time: '14:30', type: 'release', date: new Date(Date.now() - 86400000) }
];

export default function ProjectVersioning() {
    const [filters, setFilters] = useState({
        period: '',
        user: '',
        type: '',
        search: ''
    });
    const [quickFilter, setQuickFilter] = useState(null);

    // Filtrar atividades
    const filteredActivities = useMemo(() => {
        return MOCK_ACTIVITIES.filter(activity => {
            if (filters.user && activity.user !== filters.user) return false;
            if (filters.type && activity.type !== filters.type) return false;
            if (filters.search && !activity.message?.toLowerCase().includes(filters.search.toLowerCase())) return false;

            // Quick filters
            if (quickFilter === 'last24h') {
                const dayAgo = Date.now() - 24 * 3600000;
                if (activity.date < dayAgo) return false;
            }
            if (quickFilter === 'myTickets' && activity.user !== 'Ricardo Silva') return false;
            if (quickFilter === 'errors' && activity.type !== 'commit') return false;

            return true;
        });
    }, [filters, quickFilter]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleReset = () => {
        setFilters({ period: '', user: '', type: '', search: '' });
        setQuickFilter(null);
    };

    const handleQuickFilter = (filter) => {
        setQuickFilter(filter === quickFilter ? null : filter);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-end pb-2 border-b border-border-dark">
                <div className="flex flex-col gap-2">
                    <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Versionamento e Histórico</h1>
                    <p className="text-slate-500 dark:text-[#92adc9] text-base font-normal leading-normal max-w-2xl">Acompanhe o ciclo de vida do projeto, releases e auditoria completa de todas as alterações.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all">
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        <span>Gerar Release Note</span>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark/50 backdrop-blur-sm">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 dark:text-[#92adc9] text-sm font-medium uppercase tracking-wider">Total de Commits</p>
                        <span className="material-symbols-outlined text-slate-400 dark:text-[#92adc9]">commit</span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                        <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">1,240</p>
                        <span className="text-[#0bda5b] text-sm font-medium bg-[#0bda5b]/10 px-2 py-0.5 rounded-full">+12%</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark/50 backdrop-blur-sm">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 dark:text-[#92adc9] text-sm font-medium uppercase tracking-wider">Alterações de Status</p>
                        <span className="material-symbols-outlined text-slate-400 dark:text-[#92adc9]">swap_horiz</span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                        <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">85</p>
                        <span className="text-[#0bda5b] text-sm font-medium bg-[#0bda5b]/10 px-2 py-0.5 rounded-full">+5%</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark/50 backdrop-blur-sm">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 dark:text-[#92adc9] text-sm font-medium uppercase tracking-wider">Tickets Fechados</p>
                        <span className="material-symbols-outlined text-slate-400 dark:text-[#92adc9]">check_circle</span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                        <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">42</p>
                        <span className="text-[#0bda5b] text-sm font-medium bg-[#0bda5b]/10 px-2 py-0.5 rounded-full">+8%</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
                <div className="xl:col-span-2 flex flex-col gap-6">
                    <div className="flex flex-col gap-4 bg-white dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-border-dark pb-3">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-[#92adc9]">
                                <span className="material-symbols-outlined text-[20px]">filter_alt</span>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Filtros Avançados</h3>
                            </div>
                            <button onClick={handleReset} className="text-xs font-medium text-primary hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                                Resetar
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="relative group">
                                <label className="text-[10px] text-slate-500 dark:text-[#92adc9] font-medium uppercase tracking-wider mb-1 block ml-1">Período</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400 dark:text-[#92adc9] group-focus-within:text-primary transition-colors text-[18px]">calendar_month</span>
                                    </div>
                                    <input value={filters.period} onChange={(e) => handleFilterChange('period', e.target.value)} className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-border-dark rounded-lg pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#5d7285] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="DD/MM/AAAA" type="text" />
                                </div>
                            </div>
                            <div className="relative group">
                                <label className="text-[10px] text-slate-500 dark:text-[#92adc9] font-medium uppercase tracking-wider mb-1 block ml-1">Usuário</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400 dark:text-[#92adc9] group-focus-within:text-primary transition-colors text-[18px]">person</span>
                                    </div>
                                    <select value={filters.user} onChange={(e) => handleFilterChange('user', e.target.value)} className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-border-dark rounded-lg pl-10 pr-8 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer">
                                        <option value="">Todos os usuários</option>
                                        <option value="Ricardo Silva">Ricardo Silva</option>
                                        <option value="Ana Costa">Ana Costa</option>
                                        <option value="Carlos Mendes">Carlos Mendes</option>
                                        <option value="System">System</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400 dark:text-[#92adc9] text-[18px]">expand_more</span>
                                    </div>
                                </div>
                            </div>
                            <div className="relative group">
                                <label className="text-[10px] text-slate-500 dark:text-[#92adc9] font-medium uppercase tracking-wider mb-1 block ml-1">Tipo de alteração</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400 dark:text-[#92adc9] group-focus-within:text-primary transition-colors text-[18px]">category</span>
                                    </div>
                                    <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)} className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-border-dark rounded-lg pl-10 pr-8 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer">
                                        <option value="">Todos os tipos</option>
                                        <option value="status">Status Update</option>
                                        <option value="comment">Comentário</option>
                                        <option value="file">Upload de Arquivo</option>
                                        <option value="commit">Git Commit</option>
                                        <option value="release">Release</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400 dark:text-[#92adc9] text-[18px]">expand_more</span>
                                    </div>
                                </div>
                            </div>
                            <div className="relative group">
                                <label className="text-[10px] text-slate-500 dark:text-[#92adc9] font-medium uppercase tracking-wider mb-1 block ml-1">Buscar</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400 dark:text-[#92adc9] group-focus-within:text-primary transition-colors text-[18px]">search</span>
                                    </div>
                                    <input value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-border-dark rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#5d7285] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="ID, mensagem..." type="text" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="text-xs text-slate-500 dark:text-[#92adc9]">Sugestões:</span>
                            <button onClick={() => handleQuickFilter('last24h')} className={`px-3 py-1 rounded-full border text-xs transition-colors ${quickFilter === 'last24h' ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111a22] text-slate-500 dark:text-[#92adc9] hover:text-slate-900 dark:hover:text-white hover:border-primary'}`}>Últimas 24h</button>
                            <button onClick={() => handleQuickFilter('myTickets')} className={`px-3 py-1 rounded-full border text-xs transition-colors ${quickFilter === 'myTickets' ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111a22] text-slate-500 dark:text-[#92adc9] hover:text-slate-900 dark:hover:text-white hover:border-primary'}`}>Meus Tickets</button>
                            <button onClick={() => handleQuickFilter('errors')} className={`px-3 py-1 rounded-full border text-xs transition-colors ${quickFilter === 'errors' ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#111a22] text-slate-500 dark:text-[#92adc9] hover:text-slate-900 dark:hover:text-white hover:border-primary'}`}>Apenas Erros</button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg px-2">Hoje</h3>

                        {/* Task Item 1 */}
                        <div className="group flex gap-4 p-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark hover:border-primary/50 transition-all">
                            <div className="relative shrink-0">
                                <div className="size-10 rounded-full bg-cover bg-center ring-2 ring-slate-200 dark:ring-border-dark group-hover:ring-primary transition-all" data-alt="Profile picture of male developer" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCUOTxIDeg7pbAhk26SGVfV5M0OrxySPZ07r2Kq3KkQeb4tKujd47IW4OZ-KEw5B2OJjB_jyq-0iCHf9nQm_rK8B5ozf3vQpHKW1WQP6H59VsqhqlViAY6jv1I-to_KrheQW-dq_9t2SB2vKaaU0njhs70U2wIyOCgRXSYxTAwDrkBgx2HIhUmCbLNW7_qJem4T1FChTMpCfXO-oONgOFnVv9JPmwnEdLA-7z3LVNc0kDtPe8uSR6ulo3kqCaaCh0W5mR0HHhU6QhU')" }}></div>
                                <div className="absolute -bottom-1 -right-1 bg-[#0bda5b] text-black rounded-full p-0.5 border-2 border-white dark:border-surface-dark">
                                    <span className="material-symbols-outlined text-[12px] font-bold block">check</span>
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 gap-1">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm text-slate-900 dark:text-white"><span className="font-bold text-slate-900 dark:text-white">Ricardo Silva</span> moveu <a className="text-primary hover:underline" href="#">TASK-1024</a> para <span className="text-[#0bda5b] font-medium">Concluído</span></p>
                                    <span className="text-xs text-slate-500 dark:text-[#92adc9] whitespace-nowrap">2m atrás</span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-[#92adc9]">Implementação do fluxo de autenticação via OAuth2 finalizada.</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-[#233648] text-slate-500 dark:text-[#92adc9] border border-slate-200 dark:border-[#324d67]">backend</span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-[#233648] text-slate-500 dark:text-[#92adc9] border border-slate-200 dark:border-[#324d67]">security</span>
                                </div>
                            </div>
                        </div>

                        {/* Task Item 2 */}
                        <div className="group flex gap-4 p-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark hover:border-primary/50 transition-all">
                            <div className="relative shrink-0">
                                <div className="size-10 rounded-full bg-cover bg-center ring-2 ring-slate-200 dark:ring-border-dark group-hover:ring-primary transition-all" data-alt="Profile picture of female designer" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBkT34oJmJvtWcrQoxpBMc-PYGmsWMPyspiaUn3o7qghoEolgHzpEzCiHGqBeqsvicLdz4Vk8Q6EGB83Rci79SlJ9Q126dsGP2rCbjgx1gc7wftIYSzhzp0_2Mq73arjdIanlYZGMcVbh75UuWzDlDSHsETFvc5HlxBCcSNCPAtBv_Z0E-9-tePJglPTOPqmEIyyZu__ZlFS1tZoLlsI6SSE6TSV8zs57BsIXVWVeWppzvqcMpK-jjzaj_jjJowzmimxXNeLKFEs400')" }}></div>
                                <div className="absolute -bottom-1 -right-1 bg-[#137fec] text-white rounded-full p-0.5 border-2 border-white dark:border-surface-dark">
                                    <span className="material-symbols-outlined text-[12px] font-bold block">edit</span>
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 gap-1">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm text-slate-900 dark:text-white"><span className="font-bold text-slate-900 dark:text-white">Ana Costa</span> atualizou o design de <a className="text-primary hover:underline" href="#">TASK-1010</a></p>
                                    <span className="text-xs text-slate-500 dark:text-[#92adc9] whitespace-nowrap">45m atrás</span>
                                </div>
                                <div className="flex items-center gap-3 mt-2 p-3 rounded-lg bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-border-dark">
                                    <div className="h-10 w-10 bg-cover bg-center rounded" data-alt="Thumbnail of updated UI component" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAU4X04Qg77YhkXN77HXO90NAk0rBXsc3BAojGpBMohNDbQF-Yxs3oM146EORvWWrY64I1xFzs1CPWcMbiCwdGiW_-u9xOsrLVRXii1SGUs4KqzSipJM0fMNrFj9oHVZ2OcZzlgNak0vxFk97CmrOi_WGrXf89SHJdreNR1n8M97EthOCOdx366Zi0z9tgF055Cr7t_Wmg2X5pyKdjk3mAq2DoBKB2OUDiIiHyULQN8xs6CNKJJ-wz9okFRsSLJ-34tUBMng6HD_uA')" }}></div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-slate-900 dark:text-white font-medium">Dashboard_v2_Dark.fig</span>
                                        <span className="text-xs text-slate-500 dark:text-[#92adc9]">2.4 MB • Figma</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Task Item 3 */}
                        <div className="group flex gap-4 p-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark hover:border-primary/50 transition-all">
                            <div className="relative shrink-0">
                                <div className="flex items-center justify-center size-10 rounded-full bg-slate-100 dark:bg-[#233648] text-slate-500 dark:text-[#92adc9] ring-2 ring-slate-200 dark:ring-border-dark group-hover:ring-primary transition-all">
                                    <span className="material-symbols-outlined text-[20px]">code</span>
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 gap-1">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm text-slate-900 dark:text-white"><span className="font-bold text-slate-900 dark:text-white">System</span> registrou novo commit na branch <span className="font-mono text-[#e5b3fe]">feat/user-profile</span></p>
                                    <span className="text-xs text-slate-500 dark:text-[#92adc9] whitespace-nowrap">2h atrás</span>
                                </div>
                                <div className="font-mono text-xs text-slate-500 dark:text-[#92adc9] bg-slate-50 dark:bg-[#111a22] p-2 rounded border border-slate-200 dark:border-border-dark mt-1">
                                    <span className="text-primary">8a2b3c</span> - Fix: avatar rendering issue on mobile devices
                                </div>
                            </div>
                        </div>

                        <h3 className="text-slate-900 dark:text-white font-bold text-lg px-2 mt-4">Ontem</h3>

                        {/* Task Item 4 */}
                        <div className="group flex gap-4 p-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark hover:border-primary/50 transition-all">
                            <div className="relative shrink-0">
                                <div className="size-10 rounded-full bg-cover bg-center ring-2 ring-slate-200 dark:ring-border-dark group-hover:ring-primary transition-all" data-alt="Profile picture of project manager" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB1po7hmQfGsPSKBWMYgrQn6I4Vv61wwNazj5AJ02BoCu5nTeNbHpSJqNuPdQHByRhMuDJD6AU6_MAKW8A3bCcbpsSk2lVLDS0iSQG37IgDY6P9Ga6fGSaFHRLUxCLvLQZFrzFes7iCK0W4eSkvdn4U_X4VEDheLRqsVwvL3q_EBc6AIjQWTOyLALea0P16k0Hpl1nznzUoiQX6kZ3hWDul8-3QQSUw3jXOPw3c3yJHllvhcQ9TdadSnMnJdZ0rMHfRbxpl9sFt9dI')" }}></div>
                                <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white rounded-full p-0.5 border-2 border-white dark:border-surface-dark">
                                    <span className="material-symbols-outlined text-[12px] font-bold block">rocket_launch</span>
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 gap-1">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm text-slate-900 dark:text-white"><span className="font-bold text-slate-900 dark:text-white">Carlos Mendes</span> publicou release <span className="font-bold text-primary">v1.2.0</span></p>
                                    <span className="text-xs text-slate-500 dark:text-[#92adc9] whitespace-nowrap">14:30</span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-[#92adc9]">Release candidate aprovado. Deploy automático iniciado para produção.</p>
                                <button className="mt-2 text-xs font-bold text-primary hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1">
                                    Ver Changelog Completo
                                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center pt-4">
                        <button className="text-sm text-slate-500 dark:text-[#92adc9] hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors">
                            <span className="material-symbols-outlined">refresh</span>
                            Carregar mais atividades
                        </button>
                    </div>
                </div>

                {/* Right sidebar */}
                <div className="flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-[#1e2730] to-[#161c23] rounded-xl p-6 border border-slate-200 dark:border-border-dark relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-[120px] text-white">rocket</span>
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[#92adc9] text-xs font-bold uppercase tracking-wider">Versão Atual</span>
                                <span className="bg-[#eab308]/20 text-[#eab308] text-xs font-bold px-2 py-1 rounded">EM PROGRESSO</span>
                            </div>
                            <h2 className="text-4xl font-black text-white mb-1">v1.3.0</h2>
                            <p className="text-sm text-[#92adc9] mb-6">Sprint: "Performance Boost"</p>
                            <div className="flex flex-col gap-2 mb-6">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-white">Progresso</span>
                                    <span className="text-primary">75%</span>
                                </div>
                                <div className="w-full bg-[#111a22] rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                                <div className="flex justify-between text-[10px] text-[#92adc9] mt-1">
                                    <span>Start: 10 Out</span>
                                    <span>Est. Delivery: 24 Out</span>
                                </div>
                            </div>
                            <div className="flex -space-x-2 mb-4">
                                <img alt="Contributor 1" className="w-8 h-8 rounded-full border-2 border-surface-dark" data-alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeiQzAJYyQNtH5BLnKlVWJ70jAalo1eW9UKl6xiIwvtguLHikzzrV4MlxujIsBJrMG10gDRP4g6V-eSKEs63nUKhrqw6rvibqs6hJsDAP65lkNgY0_-dSZgLk8c9DmkLeqRQEdxa17GDiXtykQpYhc2GAjpCviZxR8rl4fq0zyFnAHjanD9EXTt68kA0MY9SbyQjE9Pa9KTeVyXl_P6-t0lbknnSccDWPQU0KIwH2vYyiQOi92tE8E-ANu9oLgsiggu90VGdVVuvU" />
                                <img alt="Contributor 2" className="w-8 h-8 rounded-full border-2 border-surface-dark" data-alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZHvVVv6jGV0FGgCkT7MmQERKY5BSNFM7AnfOrMwVHT5ALKTR9GP5zZYjpTsQtl4Jb4vgehKh2eLh30Co9Nru3xMhX4UZ_mP1zHxwuoWeBtyXrrLIoHfw_ICIIRdm5cTOtU_hjeAZ8G05V1sOMfnL8TcCX23H5ek2YpIL_OAyoW0dTdOCjwIuVUcEzvg_nsZry5AamHfw1wrZvtBJP0ZQIwkBrjfRzNETaxkSZyFbAffTvDSllD8JlZ0JPP-Vggs3-nVfTftgqDbM" />
                                <img alt="Contributor 3" className="w-8 h-8 rounded-full border-2 border-surface-dark" data-alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChTp2e5Sdq5gQ56yorT-Gv3-MjtC4eNHP7MrUqVHcFEnO66G4Adz_-bQs8SfasEIFW9Dvz-AuMbnG1StDnc2jforTKRsB7-IiG5Q_OzCXURb9Cz4jq2Te9geH8BbqPzUFEAfbiptZjbB9dn8CyB8rqZj--fmjfa-yzhOMloKh06dplG0M_r0703H2mS5G_MoeiVup2xTbLaEq4zorz1Curapx6rUPXNS9gn26Jbo_-UukNmyCpugZ5z6UXQYJjdAPwNddH37AQXeY" />
                                <div className="w-8 h-8 rounded-full border-2 border-surface-dark bg-[#324d67] flex items-center justify-center text-[10px] text-white font-bold">+5</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg px-1">Lançamentos Anteriores</h3>
                        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-200 dark:border-border-dark flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#0bda5b]/10 p-2 rounded-lg">
                                        <span className="material-symbols-outlined text-[#0bda5b]">verified</span>
                                    </div>
                                    <div>
                                        <h4 className="text-slate-900 dark:text-white font-bold">v1.2.0</h4>
                                        <p className="text-xs text-slate-500 dark:text-[#92adc9]">Ontem</p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium bg-slate-100 dark:bg-[#111a22] text-slate-500 dark:text-[#92adc9] px-2 py-1 rounded border border-slate-200 dark:border-border-dark">Stable</span>
                            </div>
                            <div className="h-px w-full bg-slate-200 dark:bg-[#233648]"></div>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-slate-500 dark:text-[#92adc9] line-clamp-2">Inclusão de dark mode, melhorias na API de usuários e correções de segurança no login.</p>
                                <a className="text-xs text-primary font-bold hover:underline" href="#">Ver Release Notes</a>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-200 dark:border-border-dark flex flex-col gap-3 opacity-75 hover:opacity-100 transition-opacity">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-100 dark:bg-[#233648] p-2 rounded-lg">
                                        <span className="material-symbols-outlined text-slate-500 dark:text-[#92adc9]">archive</span>
                                    </div>
                                    <div>
                                        <h4 className="text-slate-900 dark:text-white font-bold">v1.1.5</h4>
                                        <p className="text-xs text-slate-500 dark:text-[#92adc9]">28 Set, 2023</p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium bg-slate-100 dark:bg-[#111a22] text-slate-500 dark:text-[#92adc9] px-2 py-1 rounded border border-slate-200 dark:border-border-dark">Legacy</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-200 dark:border-border-dark flex flex-col gap-3 opacity-75 hover:opacity-100 transition-opacity">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-100 dark:bg-[#233648] p-2 rounded-lg">
                                        <span className="material-symbols-outlined text-slate-500 dark:text-[#92adc9]">archive</span>
                                    </div>
                                    <div>
                                        <h4 className="text-slate-900 dark:text-white font-bold">v1.1.0</h4>
                                        <p className="text-xs text-slate-500 dark:text-[#92adc9]">15 Set, 2023</p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium bg-slate-100 dark:bg-[#111a22] text-slate-500 dark:text-[#92adc9] px-2 py-1 rounded border border-slate-200 dark:border-border-dark">Legacy</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
