import { mockProjects, mockKPIs, mockTeamMembers, mockActivities } from '../data/mockData';

export default function Dashboard() {
    return (
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="mx-auto max-w-7xl">
                {/* Page Heading */}
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white md:text-3xl">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                            Welcome back, Alex. You have 3 urgent items requiring attention today.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500/20">
                            System Operational
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
                            Last updated: 5m ago
                        </span>
                    </div>
                </div>

                {/* KPI Stats Grid */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Active Projects */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-border-dark dark:bg-surface-dark">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Projects</p>
                            <span className="rounded bg-primary/10 p-1 text-primary">
                                <span className="material-symbols-outlined text-[20px]">folder</span>
                            </span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockKPIs.activeProjects.value}</p>
                            <span className="flex items-center text-xs font-medium text-green-500">
                                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                                {mockKPIs.activeProjects.change}
                            </span>
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                            <div className="h-1.5 rounded-full bg-primary" style={{ width: '75%' }} />
                        </div>
                    </div>

                    {/* Pending Tasks */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-border-dark dark:bg-surface-dark">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Tasks</p>
                            <span className="rounded bg-orange-500/10 p-1 text-orange-500">
                                <span className="material-symbols-outlined text-[20px]">assignment</span>
                            </span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockKPIs.pendingTasks.value}</p>
                            <span className="flex items-center text-xs font-medium text-green-500">
                                <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                                {Math.abs(mockKPIs.pendingTasks.change)} vs last week
                            </span>
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                            <div className="h-1.5 rounded-full bg-orange-500" style={{ width: '40%' }} />
                        </div>
                    </div>

                    {/* Critical Issues */}
                    <div className="rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm dark:border-red-900/30 dark:bg-surface-dark">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-red-600 dark:text-red-400">Critical Issues</p>
                            <span className="rounded bg-red-500/10 p-1 text-red-500">
                                <span className="material-symbols-outlined text-[20px]">warning</span>
                            </span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockKPIs.criticalIssues.value}</p>
                            <span className="flex items-center text-xs font-medium text-red-500">
                                <span className="material-symbols-outlined text-[14px]">add</span>
                                {mockKPIs.criticalIssues.change} today
                            </span>
                        </div>
                        <p className="mt-2 text-xs text-red-600/80 dark:text-red-400/80">Requires immediate attention</p>
                    </div>

                    {/* Team Velocity */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-border-dark dark:bg-surface-dark">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Team Velocity</p>
                            <span className="rounded bg-purple-500/10 p-1 text-purple-500">
                                <span className="material-symbols-outlined text-[20px]">speed</span>
                            </span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockKPIs.teamVelocity.value}</p>
                            <span className="text-xs text-gray-500 dark:text-gray-400">vs prev week</span>
                        </div>
                        <div className="mt-2 flex h-4 items-end gap-1">
                            {[40, 60, 50, 80, 70, 90].map((height, i) => (
                                <div
                                    key={i}
                                    className={`w-1/6 rounded-sm ${i === 5 ? 'bg-purple-500' : 'bg-purple-500/30'}`}
                                    style={{ height: `${height}%` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left Column (Projects Table) */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* Active Projects Section */}
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-border-dark dark:bg-surface-dark">
                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-border-dark">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Projects</h2>
                                <button className="text-sm font-medium text-primary hover:text-primary-hover">View All</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-xs font-medium uppercase text-gray-500 dark:bg-surface-dark-lighter dark:text-gray-400">
                                        <tr>
                                            <th className="px-6 py-3">Project Name</th>
                                            <th className="px-6 py-3">Progress</th>
                                            <th className="px-6 py-3">Due Date</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3 text-right">Team</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-border-dark">
                                        {mockProjects.slice(0, 4).map((project) => (
                                            <tr key={project.id} className="group hover:bg-gray-50 dark:hover:bg-surface-dark-lighter/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`flex h-8 w-8 items-center justify-center rounded bg-${project.color}-100 text-${project.color}-600 dark:bg-${project.color}-900/30 dark:text-${project.color}-400`}>
                                                            <span className="material-symbols-outlined text-[18px]">{project.icon}</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white">{project.name}</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">{project.client}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{project.progress}%</span>
                                                        <div className="h-1.5 w-20 rounded-full bg-gray-200 dark:bg-gray-700">
                                                            <div className="h-1.5 rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{project.dueDate}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${project.status === 'Concluído' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                            project.status === 'Atrasado' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                                project.status === 'Planejamento' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                                    'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                                                        }`}>
                                                        {project.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex -space-x-2 justify-end">
                                                        {project.team.slice(0, 3).map((member) => (
                                                            <div key={member.id} className="h-6 w-6 rounded-full ring-2 ring-white dark:ring-surface-dark">
                                                                <img src={member.avatar} alt={member.name} className="h-full w-full rounded-full object-cover" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Team Workload Section */}
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-border-dark dark:bg-surface-dark">
                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-border-dark">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Resource Allocation</h2>
                                <button className="text-sm font-medium text-primary hover:text-primary-hover">Manage Team</button>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col gap-5">
                                    {mockTeamMembers.map((member) => (
                                        <div key={member.id} className="flex items-center gap-4">
                                            <div className="h-10 w-10 shrink-0 rounded-full">
                                                <img src={member.avatar} alt={member.name} className="h-full w-full rounded-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {member.name} <span className="text-xs text-gray-500 font-normal ml-1">{member.role}</span>
                                                    </p>
                                                    <span className={`text-xs font-medium ${member.status === 'Overloaded' ? 'text-red-500' :
                                                            member.status === 'Optimal' ? 'text-green-500' :
                                                                'text-gray-500 dark:text-gray-400'
                                                        }`}>
                                                        {member.status} ({member.workload}%)
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                                                    <div
                                                        className={`h-2 rounded-full ${member.status === 'Overloaded' ? 'bg-red-500' :
                                                                member.status === 'Optimal' ? 'bg-primary' :
                                                                    'bg-green-500'
                                                            }`}
                                                        style={{ width: `${Math.min(member.workload, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Sidebar Widgets) */}
                    <div className="flex flex-col gap-8">
                        {/* Activity Feed */}
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-border-dark dark:bg-surface-dark">
                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-border-dark">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                            </div>
                            <div className="p-4">
                                <ul className="space-y-4">
                                    {mockActivities.map((activity) => (
                                        <li key={activity.id} className="relative flex gap-3">
                                            {activity.type === 'comment' || activity.type === 'update' ? (
                                                <div className="h-8 w-8 shrink-0 rounded-full ring-2 ring-white dark:ring-surface-dark">
                                                    <img src={activity.user.avatar} alt={activity.user.name} className="h-full w-full rounded-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-${activity.iconColor}-100 text-${activity.iconColor}-600 ring-2 ring-white dark:bg-${activity.iconColor}-900/30 dark:text-${activity.iconColor}-400 dark:ring-surface-dark`}>
                                                    <span className="material-symbols-outlined text-[16px]">{activity.icon}</span>
                                                </div>
                                            )}
                                            <div className="flex-1 pb-1">
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    <span className="font-semibold">{activity.user?.name || activity.title}</span> {activity.action} {activity.target && <span className="font-medium text-primary">{activity.target}</span>}
                                                </p>
                                                {activity.message && (
                                                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">"{activity.message}"</p>
                                                )}
                                                <p className="mt-1 text-[10px] text-gray-400">{activity.time}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
