import React from 'react';

export default function Calendar() {
    return (
        <div className="flex flex-1 h-full overflow-hidden relative">
            {/* Filters Sidebar (Collapsible) */}
            <div className="w-80 border-r border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark overflow-y-auto hidden xl:block flex-shrink-0 p-4">
                {/* Mini Calendar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <span className="text-slate-900 dark:text-white font-bold">October 2023</span>
                        <div className="flex gap-1">
                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-border-dark rounded text-slate-700 dark:text-white transition-colors">
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>
                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-border-dark rounded text-slate-700 dark:text-white transition-colors">
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        </div>
                    </div>
                    {/* Grid */}
                    <div className="grid grid-cols-7 text-center gap-y-2">
                        <span className="text-xs text-slate-500 dark:text-[#92adc9] font-medium">S</span>
                        <span className="text-xs text-slate-500 dark:text-[#92adc9] font-medium">M</span>
                        <span className="text-xs text-slate-500 dark:text-[#92adc9] font-medium">T</span>
                        <span className="text-xs text-slate-500 dark:text-[#92adc9] font-medium">W</span>
                        <span className="text-xs text-slate-500 dark:text-[#92adc9] font-medium">T</span>
                        <span className="text-xs text-slate-500 dark:text-[#92adc9] font-medium">F</span>
                        <span className="text-xs text-slate-500 dark:text-[#92adc9] font-medium">S</span>
                        {/* Empty days */}
                        <span></span><span></span><span></span>
                        {/* Dates */}
                        {[...Array(30).keys()].map(i => (
                            <button key={i} className={`size-8 mx-auto flex items-center justify-center rounded-full text-sm ${i === 4 ? 'bg-primary text-white shadow-md shadow-primary/40' : 'text-slate-700 dark:text-white hover:bg-gray-100 dark:hover:bg-border-dark'}`}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Projects Filter */}
                <div className="mb-8">
                    <h3 className="text-slate-500 dark:text-[#92adc9] text-xs font-bold uppercase tracking-wider mb-3 px-2">Projects</h3>
                    <div className="space-y-1">
                        {[
                            { name: 'Website Redesign', color: 'bg-primary' },
                            { name: 'Mobile App', color: 'bg-purple-500' },
                            { name: 'Marketing Q4', color: 'bg-green-500' },
                            { name: 'Internal Ops', color: 'bg-orange-500', checked: false }
                        ].map((project, idx) => (
                            <label key={idx} className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-border-dark rounded-md cursor-pointer group transition-colors">
                                <input defaultChecked={project.checked !== false} className="rounded border-gray-300 dark:border-border-dark bg-white dark:bg-background-dark text-primary focus:ring-0 focus:ring-offset-0 size-4" type="checkbox" />
                                <span className={`size-2.5 rounded-full ${project.color}`}></span>
                                <span className="text-sm text-slate-700 dark:text-white flex-1 group-hover:text-primary transition-colors">{project.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Team Filter */}
                <div>
                    <h3 className="text-slate-500 dark:text-[#92adc9] text-xs font-bold uppercase tracking-wider mb-3 px-2">Team</h3>
                    <div className="space-y-2">
                        {[
                            { name: 'Sarah Connor', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7FN7qAR7r8qpSYqEv-0XodfW7pe9UrvdQ1O2X-gi0UKg4_7xIecCDqREfKj6cCDOYjMXbVEshl_lXKvmFJInI7mhuhTUACHuiS44uKrqIQhMvHiFKOlj09w9Q1ch_ZFjcQj6rmHNkwiELeat-hufI4Y8nXsylhxdemjlWfX9Rl3E1SElhbjyEhmq97s0po06bs_3Bx_23RQdyYo9NfhQOCfs5ADXllTtCFGn9fhX53tEpcrliCTocIQTY-u3vPDKTk5iJIAAr_hE' },
                            { name: 'Michael Chen', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqa1UHBLJbC1wDjV91jwF46ZH-SPDoOloRlwrJE9fDFNMgc84Enx1K4HqspyRV2lCOszbFZXk05IlEEjktNig6YHlmxdGhuHVLLwy9bWVEz-qt-o3LBWRsmMGkuPsCyaQJY9qDQnQGqykn8lRJHt-NAKomd2AoJyCqflDWuFu2wvloZ0NQczCMKa6lDBcsH3P1bz6S-8YT-c_0A2iL2Q-u0PvQtKW07t2bq5D7z87w9tpPG0CwdmvMqsE2z2SPrmLdFTYAmT0SUNY' },
                            { name: 'Jessica Jones', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwKeVqWJ8gWVd7zkWq9J8eBnaDaJbYbOqrnuXr1-5q8LrYa1SnANT7eyCBDM813VZUZSPzApI7cI0n_Og35FasGaB8kcc5hP2iZAcs5D2DswlnKT8oFP--McOLk8bjaD7Jb1a0YTrD-axIxQtZisKqMZ5Vbgx6hwX8twyDU7vG98rYhR3oUB1PeXWWTZbHzQbb7wut2jna38zNLIy4GuQqUa3gRL28Jw5sMB4HsspY-C63kp45mPgCXGUzDLc-zc1GquAjQzAwSTo' }
                        ].map((person, idx) => (
                            <div key={idx} className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-border-dark rounded-md cursor-pointer transition-colors">
                                <div className="size-8 rounded-full bg-cover" style={{ backgroundImage: `url('${person.img}')` }}></div>
                                <span className="text-sm text-slate-700 dark:text-white">{person.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Calendar Grid Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-background-dark h-full">
                {/* Calendar Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4 border-b border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark z-10 shadow-sm relative">
                    {/* Search - Replicated from HTML header since we are inside content */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block w-full max-w-md">
                        {/* Search could go here if we wanted it centered, but let's stick to the HTML layout which has it in the top header. 
                            Since we are using the App's MainLayout Header, we might want to put page-specific controls here.
                        */}
                    </div>

                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">October 2023</h2>
                        <div className="flex items-center rounded-lg border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-surface-dark p-0.5 ml-2">
                            <button className="p-1 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-[#92adc9] hover:bg-white dark:hover:bg-background-dark rounded transition-colors shadow-sm">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button className="p-1 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-[#92adc9] hover:bg-white dark:hover:bg-background-dark rounded transition-colors shadow-sm">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                        <button className="hidden sm:block ml-2 px-3 py-1.5 text-sm font-bold text-slate-700 dark:text-white border border-gray-200 dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-border-dark transition-colors bg-white dark:bg-transparent">
                            Today
                        </button>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center p-1 bg-gray-100 dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-border-dark">
                        {['Day', 'Week', 'Month'].map((view, idx) => (
                            <label key={view} className="cursor-pointer">
                                <input type="radio" name="view" className="peer sr-only" defaultChecked={view === 'Month'} />
                                <span className="flex items-center justify-center px-4 py-1.5 text-sm font-medium text-slate-500 dark:text-[#92adc9] rounded-md peer-checked:bg-white dark:peer-checked:bg-background-dark peer-checked:text-slate-900 dark:peer-checked:text-white peer-checked:shadow-sm transition-all hover:text-slate-900 dark:hover:text-white">
                                    {view}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Calendar Grid (Month View) */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-border-dark shadow-sm overflow-hidden min-h-[800px] flex flex-col">
                        {/* Days Header */}
                        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-background-dark/50">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                                <div key={day} className={`py-3 text-center text-sm font-semibold uppercase tracking-wider ${i >= 5 ? 'text-primary' : 'text-slate-500 dark:text-[#92adc9]'}`}>
                                    {day}
                                </div>
                            ))}
                        </div>
                        {/* Days Grid */}
                        <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-gray-200 dark:bg-border-dark gap-px">
                            {/* Previous Month Days */}
                            {[25, 26, 27, 28, 29, 30].map(d => (
                                <div key={`prev-${d}`} className="bg-white dark:bg-surface-dark p-2 min-h-[120px] flex flex-col gap-1 relative group hover:bg-gray-50 dark:hover:bg-[#1a2632] transition-colors">
                                    <span className="text-slate-400 dark:text-[#92adc9] text-sm font-medium p-1 opacity-50">{d}</span>
                                </div>
                            ))}

                            {/* Current Month Days */}
                            {[...Array(31).keys()].map((d, i) => {
                                const day = d + 1;
                                return (
                                    <div key={`curr-${day}`} className="bg-white dark:bg-surface-dark p-2 min-h-[120px] flex flex-col gap-1 relative group hover:bg-gray-50 dark:hover:bg-[#1a2632] transition-colors">
                                        <span className={`text-sm font-medium p-1 ${day === 5 ? 'text-white bg-primary rounded-full size-7 flex items-center justify-center shadow-lg shadow-primary/40' : 'text-slate-700 dark:text-white'}`}>{day}</span>

                                        {/* Events */}
                                        {day === 2 && (
                                            <div className="bg-primary/10 dark:bg-primary/20 border-l-2 border-primary rounded-r px-2 py-1 text-xs text-slate-700 dark:text-white truncate cursor-pointer hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors">
                                                <span className="font-bold">09:00</span> Sprint Planning
                                            </div>
                                        )}
                                        {day === 4 && (
                                            <>
                                                <div className="bg-purple-500/10 dark:bg-purple-500/20 border-l-2 border-purple-500 rounded-r px-2 py-1 text-xs text-slate-700 dark:text-white truncate cursor-pointer hover:bg-purple-500/20 dark:hover:bg-purple-500/30 transition-colors mb-1">
                                                    <span className="font-bold">14:00</span> Design Review
                                                </div>
                                                <div className="bg-green-500/10 dark:bg-green-500/20 border-l-2 border-green-500 rounded-r px-2 py-1 text-xs text-slate-700 dark:text-white truncate cursor-pointer hover:bg-green-500/20 dark:hover:bg-green-500/30 transition-colors">
                                                    <span className="font-bold">16:00</span> Client Call
                                                </div>
                                            </>
                                        )}
                                        {day === 5 && (
                                            <div className="bg-orange-500/10 dark:bg-orange-500/20 border-l-2 border-orange-500 rounded-r px-2 py-1 text-xs text-slate-700 dark:text-white truncate cursor-pointer hover:bg-orange-500/20 dark:hover:bg-orange-500/30 transition-colors">
                                                <span className="font-bold">11:30</span> Team Lunch
                                            </div>
                                        )}
                                        {day === 9 && (
                                            <div className="bg-primary/10 dark:bg-primary/20 border-l-2 border-primary rounded-r px-2 py-1 text-xs text-slate-700 dark:text-white truncate cursor-pointer hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors">
                                                <span className="font-bold">10:00</span> Daily Standup
                                            </div>
                                        )}
                                        {day === 10 && (
                                            <div className="bg-red-500/10 dark:bg-red-500/20 border-l-2 border-red-500 rounded-r px-2 py-1 text-xs text-slate-700 dark:text-white truncate cursor-pointer hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors">
                                                <span className="font-bold">EOD</span> Project Delivery
                                            </div>
                                        )}
                                        {day === 12 && (
                                            <div className="bg-purple-500/10 dark:bg-purple-500/20 border-l-2 border-purple-500 rounded-r px-2 py-1 text-xs text-slate-700 dark:text-white truncate cursor-pointer hover:bg-purple-500/20 dark:hover:bg-purple-500/30 transition-colors">
                                                <span className="font-bold">15:00</span> UX Workshop
                                            </div>
                                        )}
                                        {day === 16 && (
                                            <div className="bg-primary/10 dark:bg-primary/20 border-l-2 border-primary rounded-r px-2 py-1 text-xs text-slate-700 dark:text-white truncate cursor-pointer hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors">
                                                <span className="font-bold">09:00</span> Sprint Planning
                                            </div>
                                        )}
                                        {day === 19 && (
                                            <div className="bg-green-500/10 dark:bg-green-500/20 border-l-2 border-green-500 rounded-r px-2 py-1 text-xs text-slate-700 dark:text-white truncate cursor-pointer hover:bg-green-500/20 dark:hover:bg-green-500/30 transition-colors">
                                                <span className="font-bold">10:00</span> Q4 Strategy
                                            </div>
                                        )}
                                        {day === 22 && (
                                            <div className="bg-purple-500/10 dark:bg-purple-500/20 border-l-2 border-purple-500 rounded-r px-2 py-1 text-xs text-slate-700 dark:text-white truncate cursor-pointer hover:bg-purple-500/20 dark:hover:bg-purple-500/30 transition-colors">
                                                <span className="font-bold">13:00</span> Design Huddle
                                            </div>
                                        )}
                                        {day === 25 && (
                                            <div className="bg-orange-500/10 dark:bg-orange-500/20 border-l-2 border-orange-500 rounded-r px-2 py-1 text-xs text-slate-700 dark:text-white truncate cursor-pointer hover:bg-orange-500/20 dark:hover:bg-orange-500/30 transition-colors">
                                                <span className="font-bold">14:00</span> Hiring Sync
                                            </div>
                                        )}
                                        {day === 30 && (
                                            <div className="bg-primary/10 dark:bg-primary/20 border-l-2 border-primary rounded-r px-2 py-1 text-xs text-slate-700 dark:text-white truncate cursor-pointer hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors">
                                                <span className="font-bold">09:00</span> Sprint Planning
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Next Month Days */}
                            {[1, 2, 3, 4].map(d => (
                                <div key={`next-${d}`} className="bg-white dark:bg-surface-dark p-2 min-h-[120px] flex flex-col gap-1 relative group hover:bg-gray-50 dark:hover:bg-[#1a2632] transition-colors">
                                    <span className="text-slate-400 dark:text-[#92adc9] text-sm font-medium p-1 opacity-50">{d}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
