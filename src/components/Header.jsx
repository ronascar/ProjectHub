import { useState, useMemo, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TasksContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Header({ onMenuToggle }) {
    const { isDark, toggleTheme } = useTheme();
    const { tasks } = useTasks();
    const { user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef(null);

    // Get tasks assigned to current user that are not done
    const userNotifications = useMemo(() => {
        if (!user?.id) return [];

        return tasks
            .filter(task =>
                task.assigneeId === user.id &&
                task.status !== 'DONE' &&
                task.status !== 'CANCELLED'
            )
            .sort((a, b) => {
                // Sort by due date (closest first)
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            })
            .slice(0, 5); // Show only 5 most recent
    }, [tasks, user]);

    const hasNotifications = userNotifications.length > 0;

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showNotifications]);

    const getPriorityColor = (priority) => {
        const colors = {
            'URGENT': 'text-red-500',
            'HIGH': 'text-orange-500',
            'MEDIUM': 'text-yellow-500',
            'LOW': 'text-green-500'
        };
        return colors[priority] || 'text-gray-500';
    };

    const formatDueDate = (dateString) => {
        if (!dateString) return 'Sem prazo';

        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const taskDate = new Date(date);
        taskDate.setHours(0, 0, 0, 0);

        const diffTime = taskDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Vence hoje';
        if (diffDays === 1) return 'Vence amanhã';
        if (diffDays < 0) return `${Math.abs(diffDays)}d atrasado`;
        if (diffDays <= 7) return `Vence em ${diffDays}d`;

        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    };

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <header className="flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-border-dark dark:bg-background-dark">
            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 md:hidden">
                <button
                    onClick={onMenuToggle}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                    aria-label="Abrir menu"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <span className="text-lg font-bold dark:text-white">
                    Nexus<span className="text-primary">PM</span>
                </span>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl">
                <div className="relative w-full">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        search
                    </span>
                    <input
                        className="w-full rounded-lg border-none bg-gray-100 py-2 pl-10 pr-4 text-sm text-gray-900 focus:ring-2 focus:ring-primary dark:bg-surface-dark-lighter dark:text-white dark:placeholder-gray-400"
                        placeholder="Buscar projetos, tarefas ou membros da equipe..."
                        type="text"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {/* New Button */}
                <Link
                    to="/projects/create"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105"
                    title="Criar Novo Projeto"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                </Link>

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

                {/* Notifications */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={handleNotificationClick}
                        className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">notifications</span>
                        {hasNotifications && (
                            <span className="absolute right-0 top-0 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 ring-2 ring-white dark:ring-background-dark"></span>
                            </span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 rounded-lg bg-white dark:bg-surface-dark shadow-lg border border-gray-200 dark:border-border-dark z-50">
                            <div className="p-4 border-b border-gray-200 dark:border-border-dark">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notificações</h3>
                                {hasNotifications && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Você tem {userNotifications.length} tarefa{userNotifications.length > 1 ? 's' : ''} pendente{userNotifications.length > 1 ? 's' : ''}
                                    </p>
                                )}
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                {!hasNotifications ? (
                                    <div className="p-8 text-center">
                                        <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">notifications_off</span>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma notificação</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-200 dark:divide-border-dark">
                                        {userNotifications.map((task) => (
                                            <Link
                                                key={task.id}
                                                to={`/tasks/${task.id}/edit`}
                                                onClick={() => setShowNotifications(false)}
                                                className="block p-4 hover:bg-gray-50 dark:hover:bg-surface-dark-lighter transition-colors"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`mt-1 ${getPriorityColor(task.priority)}`}>
                                                        <span className="material-symbols-outlined text-[20px]">assignment</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                            {task.title}
                                                        </p>
                                                        {task.project && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                {task.project.name}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className={`text-xs font-medium ${task.dueDate && new Date(task.dueDate) < new Date()
                                                                    ? 'text-red-500'
                                                                    : 'text-gray-500 dark:text-gray-400'
                                                                }`}>
                                                                {formatDueDate(task.dueDate)}
                                                            </span>
                                                            <span className="text-gray-300 dark:text-gray-600">•</span>
                                                            <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                                {task.priority === 'URGENT' ? 'Urgente' :
                                                                    task.priority === 'HIGH' ? 'Alta' :
                                                                        task.priority === 'MEDIUM' ? 'Média' : 'Baixa'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {hasNotifications && (
                                <div className="p-3 border-t border-gray-200 dark:border-border-dark">
                                    <Link
                                        to="/tasks"
                                        onClick={() => setShowNotifications(false)}
                                        className="block text-center text-sm font-medium text-primary hover:text-blue-600 transition-colors"
                                    >
                                        Ver todas as tarefas
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                    title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
                >
                    <span className="material-symbols-outlined">
                        {isDark ? 'light_mode' : 'dark_mode'}
                    </span>
                </button>

                {/* Help */}
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                    <span className="material-symbols-outlined">help</span>
                </button>
            </div>
        </header>
    );
}
