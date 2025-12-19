import React from 'react';

export default function Teams() {
    return (
        <div className="flex flex-1 justify-center py-6 px-4 sm:px-6 lg:px-8 bg-background-light dark:bg-background-dark min-h-full">
            <div className="flex w-full max-w-[1024px] flex-col gap-6">
                <div className="flex items-center gap-2 text-sm">
                    <a className="text-slate-500 dark:text-text-secondary-dark hover:underline" href="#">Workspace</a>
                    <span className="text-slate-500 dark:text-text-secondary-dark">/</span>
                    <span className="font-medium text-slate-900 dark:text-white">Team Management</span>
                </div>

                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl">Team Members</h1>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                            <p className="text-base text-slate-600 dark:text-text-secondary-dark">42 Active members in 6 departments</p>
                        </div>
                    </div>
                    <button className="flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-md hover:bg-primary-hover transition-colors">
                        <span className="material-symbols-outlined text-[20px] mr-2">person_add</span>
                        Add Member
                    </button>
                </div>

                <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-gray-200 dark:border-border-dark">
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-text-secondary-dark">search</span>
                            <input className="h-12 w-full rounded-lg border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#111a22] pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-0" placeholder="Search members by name, email or role..." />
                        </div>
                        <div className="flex gap-4">
                            <div className="relative flex-1 md:w-48">
                                <select className="h-12 w-full appearance-none rounded-lg border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#111a22] px-4 text-slate-900 dark:text-white focus:border-primary focus:ring-0">
                                    <option>All Departments</option>
                                    <option>Engineering</option>
                                    <option>Product Design</option>
                                    <option>Marketing</option>
                                    <option>Customer Success</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-text-secondary-dark">expand_more</span>
                            </div>
                            <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#111a22] text-slate-500 dark:text-text-secondary-dark hover:border-primary hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">tune</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0">
                        <button className="group flex h-8 shrink-0 items-center gap-2 rounded-lg bg-primary/10 px-3 hover:bg-primary/20 transition-colors border border-transparent hover:border-primary/30">
                            <span className="text-xs font-semibold text-primary">Active Now</span>
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">12</span>
                            <span className="material-symbols-outlined text-[16px] text-primary">close</span>
                        </button>
                        <button className="flex h-8 shrink-0 items-center gap-2 rounded-lg border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#111a22] px-3 hover:bg-gray-100 dark:hover:bg-[#1a2632] transition-colors">
                            <span className="material-symbols-outlined text-[18px] text-purple-500">admin_panel_settings</span>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Administrators</span>
                        </button>
                        <button className="flex h-8 shrink-0 items-center gap-2 rounded-lg border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#111a22] px-3 hover:bg-gray-100 dark:hover:bg-[#1a2632] transition-colors">
                            <span className="material-symbols-outlined text-[18px] text-emerald-500">code</span>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Developers</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark shadow-sm">
                    {/* Member List Header */}
                    <div className="hidden grid-cols-12 gap-4 border-b border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#111a22] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-text-secondary-dark md:grid">
                        <div className="col-span-4 pl-8">Member</div>
                        <div className="col-span-2">Role</div>
                        <div className="col-span-2">Department</div>
                        <div className="col-span-3">Workload</div>
                        <div className="col-span-1 text-right"></div>
                    </div>

                    {/* Member Item 1 */}
                    <div className="group relative grid grid-cols-1 gap-4 border-b border-gray-200 dark:border-border-dark px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-[#1c2b3a] md:grid-cols-12 md:items-center">
                        <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                            <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                                <input className="h-5 w-5 rounded border-2 border-gray-300 dark:border-gray-600 bg-transparent text-primary focus:ring-0 checked:bg-primary checked:border-primary cursor-pointer transition-all" type="checkbox" />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative size-10 rounded-full bg-cover bg-center border border-gray-200 dark:border-border-dark" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAQQVpFJ_vtT25odd1bHNDMcXKPLafFNI08XOPRxRVvjqwAphUonpUY2yAOPCTwsdFEFPBilmzZJOqxpGqyw9aiGBR-bbBDlLlh7FtNvUa6NhLGSgibPTYYxCTK4a6PYSHHp2OB93M50f0l6HWb5Ja73M6f1LLBSF_HEQWyK30oIXuZOML7MHdlghN8VBGX0smt8gAe6xSittXgbBPXRj1X69tPxzbAQ2QmgBB_E-u7rxZR4fzuX7XbRV49I5UE7OYdycNntPLOGK4")' }}>
                                    <div className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-500 border-2 border-white dark:border-[#1c2b3a]"></div>
                                </div>
                                <div className="flex flex-col text-slate-900 dark:text-white">
                                    <span className="text-sm font-semibold cursor-pointer hover:text-primary transition-colors">Sarah Miller</span>
                                    <span className="text-xs text-slate-500 dark:text-text-secondary-dark">sarah.m@taskmaster.com</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2 flex items-center gap-2">
                            <span className="md:hidden text-xs font-medium text-slate-500 uppercase w-20">Role:</span>
                            <div className="flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/30">
                                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                                Administrator
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2 flex items-center gap-2">
                            <span className="md:hidden text-xs font-medium text-slate-500 uppercase w-20">Team:</span>
                            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Management</div>
                        </div>
                        <div className="col-span-1 md:col-span-3 flex flex-col justify-center gap-1">
                            <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-slate-500 dark:text-slate-400">8 Active Projects</span>
                                <span className="font-bold text-slate-900 dark:text-white">80%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-slate-700">
                                <div className="h-1.5 rounded-full bg-primary" style={{ width: '80%' }}></div>
                            </div>
                        </div>
                        <div className="absolute right-4 top-4 md:static md:col-span-1 md:flex md:justify-end">
                            <button className="flex size-8 items-center justify-center rounded-full text-slate-400 dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-[#233648] hover:text-slate-900 dark:hover:text-white transition-colors">
                                <span className="material-symbols-outlined">more_vert</span>
                            </button>
                        </div>
                    </div>

                    {/* Member Item 2 */}
                    <div className="group relative grid grid-cols-1 gap-4 border-b border-gray-200 dark:border-border-dark px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-[#1c2b3a] md:grid-cols-12 md:items-center">
                        <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                            <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                                <input className="h-5 w-5 rounded border-2 border-gray-300 dark:border-gray-600 bg-transparent text-primary focus:ring-0 checked:bg-primary checked:border-primary cursor-pointer transition-all" type="checkbox" />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-sm border border-gray-200 dark:border-border-dark">
                                    JD
                                </div>
                                <div className="flex flex-col text-slate-900 dark:text-white">
                                    <span className="text-sm font-semibold cursor-pointer hover:text-primary transition-colors">James Davidson</span>
                                    <span className="text-xs text-slate-500 dark:text-text-secondary-dark">james.d@taskmaster.com</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2 flex items-center gap-2">
                            <span className="md:hidden text-xs font-medium text-slate-500 uppercase w-20">Role:</span>
                            <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30">
                                <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
                                Project Manager
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2 flex items-center gap-2">
                            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Product</div>
                        </div>
                        <div className="col-span-1 md:col-span-3 flex flex-col justify-center gap-1">
                            <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-slate-500 dark:text-slate-400">5 Active Projects</span>
                                <span className="font-bold text-slate-900 dark:text-white">55%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-slate-700">
                                <div className="h-1.5 rounded-full bg-amber-500" style={{ width: '55%' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-[#111a22]">
                        <p className="text-sm text-slate-500 dark:text-text-secondary-dark">
                            Showing <span className="font-medium text-slate-900 dark:text-white">1</span> to <span className="font-medium text-slate-900 dark:text-white">2</span> of <span className="font-medium text-slate-900 dark:text-white">42</span> members
                        </p>
                        <div className="flex gap-2">
                            <button className="flex items-center justify-center rounded-lg border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-[#233648] transition-colors">
                                Previous
                            </button>
                            <button className="flex items-center justify-center rounded-lg border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-[#233648] transition-colors">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
