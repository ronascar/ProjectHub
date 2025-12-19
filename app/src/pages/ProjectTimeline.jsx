import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Mock data para tarefas
const MOCK_TASKS = [
    { id: 1, name: 'Kick-off Meeting', phase: 'Phase 1: Discovery', assignee: 'PM', color: 'purple', duration: '1d', start: 0, status: 'done', priority: 'high' },
    { id: 2, name: 'Market Research', phase: 'Phase 1: Discovery', assignee: 'Ana Silva', avatar: 'https://i.pravatar.cc/100?u=ana', color: 'blue', duration: '4d', start: 2, progress: 25, status: 'in-progress', priority: 'high' },
    { id: 3, name: 'Wireframing', phase: 'Phase 2: Design', assignee: 'Carlos M.', avatar: 'https://i.pravatar.cc/100?u=carlos', color: 'orange', duration: '5d', start: 7, progress: 50, status: 'in-progress', priority: 'medium' },
    { id: 4, name: 'UI Kit Creation', phase: 'Phase 2: Design', assignee: 'DS', color: 'orange', duration: '3d', start: 14, status: 'pending', priority: 'low' },
];

export default function ProjectTimeline() {
    const [currentMonth, setCurrentMonth] = useState('Oct 2023');
    const [viewMode, setViewMode] = useState('Week');
    const [groupBy, setGroupBy] = useState('Phase');
    const [activeFilters, setActiveFilters] = useState({
        assignee: 'Me',
        priority: 'High',
        status: null,
        date: null
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedType, setSelectedType] = useState('');

    // Filtrar tarefas baseado nos filtros ativos
    const filteredTasks = useMemo(() => {
        return MOCK_TASKS.filter(task => {
            if (activeFilters.assignee === 'Me' && !task.assignee.includes('Ana')) return false;
            if (activeFilters.priority === 'High' && task.priority !== 'high') return false;
            if (searchTerm && !task.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            return true;
        });
    }, [activeFilters, searchTerm]);

    // Agrupar tarefas
    const groupedTasks = useMemo(() => {
        const groups = {};
        filteredTasks.forEach(task => {
            const key = task.phase;
            if (!groups[key]) groups[key] = [];
            groups[key].push(task);
        });
        return groups;
    }, [filteredTasks]);

    const removeFilter = (filterKey) => {
        setActiveFilters(prev => ({ ...prev, [filterKey]: null }));
    };

    const clearAllFilters = () => {
        setActiveFilters({ assignee: null, priority: null, status: null, date: null });
        setSearchTerm('');
        setSelectedUser('');
        setSelectedType('');
    };

    const goToToday = () => {
        setCurrentMonth('Oct 2023');
    };

    return (
        <div className="flex flex-col flex-1 w-full max-w-full h-[calc(100vh-65px)] overflow-hidden">
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 8px;
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1d2832;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #334455;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #445566;
                }
                .gantt-grid {
                    background-size: 40px 100%;
                    background-image: linear-gradient(to right, #233648 1px, transparent 1px);
                }
            `}</style>

            <div className="flex flex-col gap-4 p-6 pb-2 shrink-0">
                <div className="flex flex-wrap gap-2 text-sm">
                    <Link to="/" className="text-slate-500 dark:text-[#92adc9] hover:text-primary transition-colors">Dashboard</Link>
                    <span className="text-slate-500 dark:text-[#92adc9]">/</span>
                    <Link to="/projects" className="text-slate-500 dark:text-[#92adc9] hover:text-primary transition-colors">Projects</Link>
                    <span className="text-slate-500 dark:text-[#92adc9]">/</span>
                    <Link to="/projects/1" className="text-slate-500 dark:text-[#92adc9] hover:text-primary transition-colors">Projeto X</Link>
                    <span className="text-slate-500 dark:text-[#92adc9]">/</span>
                    <span className="text-slate-900 dark:text-white font-medium">Timeline</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Timeline View</h1>
                    <div className="flex gap-3">
                        <div className="flex bg-slate-200 dark:bg-[#1d2832] p-1 rounded-lg">
                            <button className="px-3 py-1.5 rounded text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">List</button>
                            <button className="px-3 py-1.5 rounded text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Board</button>
                            <button className="px-3 py-1.5 rounded bg-white dark:bg-[#2c3b4a] shadow-sm text-sm font-medium text-primary">Timeline</button>
                            <button className="px-3 py-1.5 rounded text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Calendar</button>
                        </div>
                        <button className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-blue-900/20">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span>Add Task</span>
                        </button>
                    </div>
                </div>
                <div className="flex flex-col border-b border-slate-200 dark:border-[#233648] bg-white dark:bg-[#111a22] z-10 shadow-sm rounded-lg mt-2">
                    <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Group By</span>
                                <div className="relative group">
                                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-[#1d2832] border border-slate-200 dark:border-[#233648] rounded-md hover:bg-slate-100 dark:hover:bg-[#2c3b4a] transition-all shadow-sm">
                                        <span className="material-symbols-outlined text-[18px] text-slate-500">folder_open</span>
                                        <span>Phase</span>
                                        <span className="material-symbols-outlined text-[18px] text-slate-400">arrow_drop_down</span>
                                    </button>
                                </div>
                            </div>
                            <div className="h-6 w-px bg-slate-200 dark:bg-[#233648]"></div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">Filter</span>
                                <button className="group flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-transparent border border-slate-200 dark:border-[#233648] rounded-md hover:border-primary/50 hover:text-primary dark:hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">person</span>
                                    <span>Assignee</span>
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-transparent border border-slate-200 dark:border-[#233648] rounded-md hover:border-primary/50 hover:text-primary dark:hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">timelapse</span>
                                    <span>Status</span>
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-transparent border border-slate-200 dark:border-[#233648] rounded-md hover:border-primary/50 hover:text-primary dark:hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">priority_high</span>
                                    <span>Priority</span>
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-transparent border border-slate-200 dark:border-[#233648] rounded-md hover:border-primary/50 hover:text-primary dark:hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                    <span>Date</span>
                                </button>
                                <button onClick={clearAllFilters} className="ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" title="Clear Filters">
                                    <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden xl:flex bg-slate-100 dark:bg-[#1d2832] p-1 rounded-lg">
                                <button onClick={() => setViewMode('Day')} className={`px-3 py-1 text-xs font-medium rounded transition-colors ${viewMode === 'Day' ? 'font-bold text-primary bg-white dark:bg-[#2c3b4a] shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-[#2c3b4a]'}`}>Day</button>
                                <button onClick={() => setViewMode('Week')} className={`px-3 py-1 text-xs font-medium rounded transition-colors ${viewMode === 'Week' ? 'font-bold text-primary bg-white dark:bg-[#2c3b4a] shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-[#2c3b4a]'}`}>Week</button>
                                <button onClick={() => setViewMode('Month')} className={`px-3 py-1 text-xs font-medium rounded transition-colors ${viewMode === 'Month' ? 'font-bold text-primary bg-white dark:bg-[#2c3b4a] shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-[#2c3b4a]'}`}>Month</button>
                            </div>
                            <div className="h-6 w-px bg-slate-200 dark:bg-[#233648] hidden xl:block"></div>
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#1d2832] rounded-lg p-0.5 border border-slate-200 dark:border-[#233648]">
                                <button className="p-1 rounded hover:bg-white dark:hover:bg-[#2c3b4a] shadow-sm text-slate-500 dark:text-[#92adc9]">
                                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                </button>
                                <span className="text-sm font-bold text-slate-900 dark:text-white px-2 min-w-[80px] text-center">Oct 2023</span>
                                <button className="p-1 rounded hover:bg-white dark:hover:bg-[#2c3b4a] shadow-sm text-slate-500 dark:text-[#92adc9]">
                                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                </button>
                            </div>
                            <button onClick={goToToday} className="text-xs font-bold text-primary hover:underline uppercase tracking-wide">Today</button>
                            <div className="h-6 w-px bg-slate-200 dark:bg-[#233648]"></div>
                            <button className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">ios_share</span>
                                <span className="hidden sm:inline">Export</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 pb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Active:</span>
                        {activeFilters.assignee && (
                            <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs border border-blue-100 dark:border-blue-800">
                                <span>Assignee: <strong>{activeFilters.assignee}</strong></span>
                                <button onClick={() => removeFilter('assignee')} className="hover:text-blue-900 dark:hover:text-blue-100"><span className="material-symbols-outlined text-[14px]">close</span></button>
                            </div>
                        )}
                        {activeFilters.priority && (
                            <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded text-xs border border-orange-100 dark:border-orange-800">
                                <span>Priority: <strong>{activeFilters.priority}</strong></span>
                                <button onClick={() => removeFilter('priority')} className="hover:text-orange-900 dark:hover:text-orange-100"><span className="material-symbols-outlined text-[14px]">close</span></button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden border-t border-slate-200 dark:border-[#233648]">
                {/* Left Column: Task List */}
                <div className="w-1/3 min-w-[320px] max-w-[450px] flex flex-col border-r border-slate-200 dark:border-[#233648] bg-white dark:bg-[#111a22] overflow-hidden">
                    <div className="flex items-center h-12 border-b border-slate-200 dark:border-[#233648] bg-slate-50 dark:bg-[#1d2832] px-4">
                        <div className="w-1/2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#92adc9]">Task Name</div>
                        <div className="w-1/4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#92adc9]">Assignee</div>
                        <div className="w-1/4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#92adc9] text-right">Duration</div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="group">
                            <div className="flex items-center h-10 bg-slate-100/50 dark:bg-[#1d2832]/50 px-4 border-b border-slate-100 dark:border-[#233648]/50 cursor-pointer">
                                <span className="material-symbols-outlined text-[18px] text-slate-500 mr-2">keyboard_arrow_down</span>
                                <span className="text-sm font-bold text-slate-800 dark:text-white">Phase 1: Discovery</span>
                            </div>
                            <div className="flex items-center h-12 px-4 border-b border-slate-100 dark:border-[#233648]/30 hover:bg-slate-50 dark:hover:bg-[#1d2832] transition-colors group/row">
                                <div className="w-1/2 flex items-center gap-2 overflow-hidden">
                                    <div className="size-2 rounded-full bg-purple-500 shrink-0"></div>
                                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate">Kick-off Meeting</span>
                                </div>
                                <div className="w-1/4 flex items-center">
                                    <div className="size-6 rounded-full bg-green-500/20 text-green-700 dark:text-green-400 flex items-center justify-center text-xs font-bold border border-green-500/30">PM</div>
                                </div>
                                <div className="w-1/4 text-right text-xs text-slate-500 font-mono">1d</div>
                            </div>
                            <div className="flex items-center h-12 px-4 border-b border-slate-100 dark:border-[#233648]/30 hover:bg-slate-50 dark:hover:bg-[#1d2832] transition-colors group/row bg-primary/5 dark:bg-primary/10">
                                <div className="w-1/2 flex items-center gap-2 overflow-hidden pl-4 border-l-2 border-primary">
                                    <div className="size-2 rounded-full bg-blue-500 shrink-0"></div>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white truncate">Market Research</span>
                                </div>
                                <div className="w-1/4 flex items-center">
                                    <img className="size-6 rounded-full" data-alt="Assignee Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMFuHe03WJjjaK_fafJ7H0YMPhADY0eMgug9tQkcqYBWpmXA_cDphy10vNIs23z48n_HiLfyWmvrpZEDAwuLsDr4B2IbD7LoQ1tRKdOjYygxSoVDng1oglP2uoTfz5ZTDL3PSYbbpW8LSqINXjSSDe7-eR72hhixr5AcWLXEsxo-RjkNeI8KT5J1pYA8jKE-j9EeT5nctPsK-xxekPRSurE3OGiImxDBRTVJfZLGee-M--QiZCd2nE1qNZ24xQPehMuIMxWGPVrws" />
                                </div>
                                <div className="w-1/4 text-right text-xs text-slate-500 font-mono">4d</div>
                            </div>
                        </div>
                        <div className="group mt-2">
                            <div className="flex items-center h-10 bg-slate-100/50 dark:bg-[#1d2832]/50 px-4 border-b border-slate-100 dark:border-[#233648]/50 cursor-pointer">
                                <span className="material-symbols-outlined text-[18px] text-slate-500 mr-2">keyboard_arrow_down</span>
                                <span className="text-sm font-bold text-slate-800 dark:text-white">Phase 2: Design</span>
                            </div>
                            <div className="flex items-center h-12 px-4 border-b border-slate-100 dark:border-[#233648]/30 hover:bg-slate-50 dark:hover:bg-[#1d2832] transition-colors group/row">
                                <div className="w-1/2 flex items-center gap-2 overflow-hidden">
                                    <div className="size-2 rounded-full bg-orange-500 shrink-0"></div>
                                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate">Wireframing</span>
                                </div>
                                <div className="w-1/4 flex items-center">
                                    <img className="size-6 rounded-full" data-alt="Assignee Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2gyK7PLrM4X05d5YnWc40B6RLQl0upLNEidN4SvBWsP5-5yRZJ4cxvoQApHd5Enxii1hjibArpokHK_o_QEY_6EDf4BOATf0FFKYendWerb12UwGcxFKnbUusnOpmp3U3yNvZlEGWFA0FoaUHq2qKXpgSPmFkj2CbJgbwZMQjqKcOz2knxDkdzIho46pGRj6_Q7ocfmbBmlYWftRzdLwbKtjTptZCvuFoWOWYstQmYLo0eAoX4apCTqrn1_NoxE6vK7LtnXX3BLo" />
                                </div>
                                <div className="w-1/4 text-right text-xs text-slate-500 font-mono">5d</div>
                            </div>
                            <div className="flex items-center h-12 px-4 border-b border-slate-100 dark:border-[#233648]/30 hover:bg-slate-50 dark:hover:bg-[#1d2832] transition-colors group/row">
                                <div className="w-1/2 flex items-center gap-2 overflow-hidden">
                                    <div className="size-2 rounded-full bg-orange-500 shrink-0"></div>
                                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate">UI Kit Creation</span>
                                </div>
                                <div className="w-1/4 flex items-center">
                                    <div className="size-6 rounded-full bg-orange-500/20 text-orange-700 dark:text-orange-400 flex items-center justify-center text-xs font-bold border border-orange-500/30">DS</div>
                                </div>
                                <div className="w-1/4 text-right text-xs text-slate-500 font-mono">3d</div>
                            </div>
                        </div>
                        <div className="h-10 bg-slate-50 dark:bg-[#1d2832] border-t border-slate-200 dark:border-[#233648] flex items-center px-4 text-xs text-slate-500 dark:text-[#92adc9]">
                            4 tasks shown
                        </div>
                    </div>
                </div>

                {/* Right Column: Gantt Chart */}
                <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0d141c] overflow-hidden relative">
                    {/* Time Header */}
                    <div className="h-12 bg-white dark:bg-[#1d2832] border-b border-slate-200 dark:border-[#233648] flex overflow-hidden shrink-0">
                        {/* Days... (Simplified loop for brevity in this manual port, normally mapped) */}
                        <div className="flex w-full">
                            {[...Array(15)].map((_, i) => (
                                <div key={i} className={`w-[40px] h-full flex flex-col items-center justify-center border-r border-slate-100 dark:border-[#233648] ${i === 2 ? 'bg-primary/5' : ''}`}>
                                    <span className={`text-[10px] ${i === 2 ? 'text-primary' : 'text-slate-400'} font-bold`}>D</span>
                                    <span className={`text-xs ${i === 2 ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-300 font-medium'}`}>{String(i + 1).padStart(2, '0')}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gantt Grid */}
                    <div className="flex-1 overflow-auto custom-scrollbar relative gantt-grid">
                        <div className="absolute top-0 bottom-0 left-[80px] w-[2px] bg-red-500 z-10 pointer-events-none">
                            <div className="bg-red-500 text-white text-[10px] font-bold px-1 py-0.5 rounded-sm absolute -top-0 -left-[14px]">Today</div>
                        </div>

                        {/* Row 1 (Spacer) */}
                        <div className="h-10 w-full border-b border-transparent"></div>

                        {/* Row 2: Kick-off */}
                        <div className="h-12 w-full flex items-center relative border-b border-slate-100 dark:border-[#233648]/30">
                            <div className="absolute left-[20px] top-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10">
                                <div className="size-4 bg-purple-500 rotate-45 border-2 border-white dark:border-[#0d141c] shadow-lg shadow-purple-500/30"></div>
                                <div className="hidden group-hover:flex absolute bottom-full mb-2 bg-[#233648] text-white text-xs p-2 rounded shadow-xl whitespace-nowrap z-50 flex-col gap-1">
                                    <div className="font-bold">Kick-off Meeting</div>
                                    <div className="opacity-70">Oct 01 • Milestone</div>
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Market Research */}
                        <div className="h-12 w-full flex items-center relative border-b border-slate-100 dark:border-[#233648]/30 bg-primary/5 dark:bg-primary/5">
                            <div className="absolute left-[80px] w-[160px] h-7 bg-primary rounded-md shadow-lg shadow-blue-500/20 flex items-center px-2 cursor-pointer group hover:bg-blue-500 transition-colors z-10">
                                <span className="text-xs font-bold text-white truncate w-full">Market Research</span>
                                <div className="hidden group-hover:flex absolute top-full mt-2 left-0 bg-[#233648] border border-[#3e4f60] text-white text-xs p-3 rounded-lg shadow-xl whitespace-nowrap z-50 flex-col gap-1 min-w-[180px]">
                                    <div className="font-bold text-sm">Market Research</div>
                                    <div className="flex justify-between items-center text-slate-400 mt-1">
                                        <span>Oct 03 - Oct 06</span>
                                        <span>4d</span>
                                    </div>
                                    <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div className="bg-primary w-[25%] h-full"></div>
                                    </div>
                                    <div className="flex justify-between text-[10px] mt-1 text-slate-400">
                                        <span>25% Complete</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Row 4 (Spacer) */}
                        <div className="h-10 w-full border-b border-transparent"></div>

                        {/* Row 5: Wireframing */}
                        <div className="h-12 w-full flex items-center relative border-b border-slate-100 dark:border-[#233648]/30">
                            <div className="absolute left-[280px] w-[200px] h-7 bg-slate-600 dark:bg-slate-600 rounded-md shadow-lg flex items-center px-2 cursor-pointer group hover:bg-slate-500 transition-colors z-10 overflow-hidden">
                                <div className="absolute top-0 left-0 bottom-0 bg-primary/40 w-[50%]"></div>
                                <span className="text-xs font-bold text-white truncate w-full relative z-10">Wireframing</span>
                            </div>
                            {/* SVG Arrow (Mock logic for connecting lines) */}
                            <svg className="absolute -top-[58px] left-0 w-full h-[200px] pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
                                <path d="M 240 24 C 260 24, 260 82, 280 82" fill="none" stroke="#64748b" strokeWidth="1.5"></path>
                            </svg>
                        </div>

                        {/* Row 6: UI Kit */}
                        <div className="h-12 w-full flex items-center relative border-b border-slate-100 dark:border-[#233648]/30">
                            <div className="absolute left-[560px] w-[120px] h-7 bg-[#2c3b4a] border border-dashed border-slate-500 rounded-md flex items-center px-2 cursor-pointer group hover:border-white transition-colors z-10">
                                <span className="text-xs font-medium text-slate-300 group-hover:text-white truncate w-full">UI Kit Creation</span>
                            </div>
                            <svg className="absolute -top-[48px] left-0 w-full h-[100px] pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
                                <path d="M 480 24 C 520 24, 520 72, 560 72" fill="none" stroke="#64748b" strokeWidth="1.5"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-6 right-6 z-50">
                <button className="size-14 bg-primary rounded-full shadow-2xl shadow-blue-500/40 text-white flex items-center justify-center hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[28px]">chat</span>
                </button>
            </div>
        </div >
    );
}
