import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
    const { user, logout } = useAuth();

    const navItems = [
        { path: '/', icon: 'dashboard', label: 'Dashboard', filled: true },
        { path: '/projects', icon: 'folder_open', label: 'Projects' },
        { path: '/kanban', icon: 'view_kanban', label: 'Kanban' },
        { path: '/teams', icon: 'group', label: 'Teams' },
        { path: '/reports', icon: 'bar_chart', label: 'Reports' },
        { path: '/calendar', icon: 'calendar_month', label: 'Calendar' },
    ];

    const workspaceItems = [
        { path: '/tasks', icon: 'assignment', label: 'My Tasks', badge: 3 },
        { path: '/inbox', icon: 'inbox', label: 'Inbox' },
    ];

    return (
        <aside className="hidden w-64 flex-col border-r border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark md:flex">
            {/* Logo */}
            <div className="flex h-16 items-center px-6">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
                        <span className="material-symbols-outlined text-[20px]">grid_view</span>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                        Nexus<span className="text-primary">PM</span>
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-1 flex-col justify-between overflow-y-auto px-4 py-4">
                <nav className="flex flex-col gap-1">
                    {/* User Profile */}
                    <div className="mb-4">
                        <div className="flex items-center gap-3 mb-6 px-2">
                            <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                <img
                                    src={user?.avatar || 'https://i.pravatar.cc/150?img=10'}
                                    alt={user?.name || 'User'}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {user?.name || 'Alex Morgan'}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {user?.role || 'Senior PM'}
                                </p>
                            </div>
                        </div>

                        {/* Main Navigation */}
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-surface-dark-lighter dark:hover:text-white'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={`material-symbols-outlined ${isActive && item.filled ? 'filled' : ''}`}>
                                            {item.icon}
                                        </span>
                                        <span className="font-medium">{item.label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    {/* Workspace Section */}
                    <div className="mt-4">
                        <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500">
                            Workspace
                        </h4>
                        {workspaceItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-surface-dark-lighter dark:hover:text-white'
                                    }`
                                }
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                                {item.badge && (
                                    <span className="ml-auto rounded bg-red-500/10 px-1.5 py-0.5 text-xs font-medium text-red-500">
                                        {item.badge}
                                    </span>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </nav>

                {/* Bottom Actions */}
                <div className="mt-auto">
                    <NavLink
                        to="/settings"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-surface-dark-lighter dark:hover:text-white"
                    >
                        <span className="material-symbols-outlined">settings</span>
                        <span className="font-medium">Settings</span>
                    </NavLink>
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-surface-dark-lighter dark:hover:text-white"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="font-medium">Log out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
