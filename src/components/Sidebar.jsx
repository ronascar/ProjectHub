import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';
import { useMemo } from 'react';

export default function Sidebar({ isMobile = false, onClose }) {
    const { user, logout } = useAuth();
    const { tasks } = useTasks();

    // Calculate active tasks count (not done and not cancelled)
    const activeTasksCount = useMemo(() => {
        return tasks.filter(task =>
            task.status !== 'DONE' && task.status !== 'CANCELLED'
        ).length;
    }, [tasks]);

    const navItems = [
        { path: '/', icon: 'dashboard', label: 'Painel', filled: true },
        { path: '/projects', icon: 'folder_open', label: 'Projetos' },
        { path: '/kanban', icon: 'view_kanban', label: 'Kanban' },
        { path: '/clients', icon: 'domain', label: 'Clientes' },
        { path: '/teams', icon: 'group', label: 'Equipes' },
        { path: '/users', icon: 'manage_accounts', label: 'Usuários', adminOnly: true },
        { path: '/reports', icon: 'bar_chart', label: 'Relatórios' },
        { path: '/calendar', icon: 'calendar_month', label: 'Calendário' },
    ];

    const workspaceItems = [
        { path: '/tasks', icon: 'assignment', label: 'Minhas Tarefas', badge: activeTasksCount },
        { path: '/inbox', icon: 'inbox', label: 'Caixa de Entrada' },
    ];

    const handleNavClick = () => {
        if (isMobile && onClose) {
            onClose();
        }
    };

    // Classes para desktop (oculto no mobile) ou mobile (sempre visível)
    const asideClasses = isMobile
        ? "flex w-64 flex-col h-full border-r border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark"
        : "hidden w-64 flex-col border-r border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark md:flex";

    return (
        <aside className={asideClasses}>
            {/* Logo */}
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
                        <span className="material-symbols-outlined text-[20px]">grid_view</span>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                        Nexus<span className="text-primary">PM</span>
                    </span>
                </div>
                {isMobile && (
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                        aria-label="Fechar menu"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                )}
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
                                    {user?.name?.split(' ')[0] || 'Alex'}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {user?.role?.toUpperCase() || 'ADMIN'}
                                </p>
                            </div>
                        </div>

                        {/* Main Navigation */}
                        {navItems.filter(item => !item.adminOnly || user?.role === 'ADMIN').map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={handleNavClick}
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
                            Área de Trabalho
                        </h4>
                        {workspaceItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-surface-dark-lighter dark:hover:text-white'
                                    }`
                                }
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                                {item.badge > 0 && (
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
                        onClick={handleNavClick}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-surface-dark-lighter dark:hover:text-white"
                    >
                        <span className="material-symbols-outlined">settings</span>
                        <span className="font-medium">Configurações</span>
                    </NavLink>
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-surface-dark-lighter dark:hover:text-white"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
