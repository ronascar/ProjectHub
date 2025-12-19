import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Header() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <header className="flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-border-dark dark:bg-background-dark">
            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 lg:hidden">
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
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
                <button className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-background-dark" />
                </button>

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
