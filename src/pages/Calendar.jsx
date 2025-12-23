import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TasksContext';
import { projectsAPI } from '../services/api';
import { useEffect } from 'react';

const DAYS_OF_WEEK = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const getColorClasses = (priority) => {
    const colors = {
        URGENT: 'bg-red-500/10 dark:bg-red-500/20 border-red-500',
        HIGH: 'bg-orange-500/10 dark:bg-orange-500/20 border-orange-500',
        MEDIUM: 'bg-yellow-500/10 dark:bg-yellow-500/20 border-yellow-500',
        LOW: 'bg-green-500/10 dark:bg-green-500/20 border-green-500',
    };
    return colors[priority] || colors.MEDIUM;
};

const TASK_STATUSES = [
    { value: 'TODO', label: 'A Fazer' },
    { value: 'IN_PROGRESS', label: 'Em Progresso' },
    { value: 'DONE', label: 'Concluído' },
    { value: 'CANCELLED', label: 'Cancelado' }
];

export default function Calendar() {
    const navigate = useNavigate();
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState(['TODO', 'IN_PROGRESS', 'DONE']);
    const [viewMode, setViewMode] = useState('Mês');
    const [projects, setProjects] = useState([]);
    const [draggedTask, setDraggedTask] = useState(null);
    const [dragOverDate, setDragOverDate] = useState(null);

    const { tasks, loading, updateTask } = useTasks();

    // Load projects
    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await projectsAPI.list();
            setProjects(data);
            // Select all projects by default
            setSelectedProjects(data.map(p => p.id));
        } catch (err) {
            console.error('Error loading projects:', err);
        }
    };

    // Generate calendar data
    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // First day of the month (0 = Sunday, adjust for Monday start)
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        // Days in current month
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Days in previous month
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        // Build calendar grid
        const days = [];

        // Previous month days
        for (let i = adjustedFirstDay - 1; i >= 0; i--) {
            days.push({
                day: daysInPrevMonth - i,
                isCurrentMonth: false,
                date: new Date(year, month - 1, daysInPrevMonth - i)
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                isCurrentMonth: true,
                date: new Date(year, month, i)
            });
        }

        // Next month days (fill to complete the grid - 6 rows x 7 days = 42)
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
                date: new Date(year, month + 1, i)
            });
        }

        return days;
    }, [currentDate]);

    // Convert tasks and projects to calendar events
    const events = useMemo(() => {
        const taskEvents = tasks
            .filter(task => task.dueDate) // Only tasks with due dates
            .filter(task => !task.projectId || selectedProjects.includes(task.projectId)) // Filter by selected projects
            .filter(task => selectedStatuses.includes(task.status || 'TODO')) // Filter by selected statuses
            .map(task => ({
                id: task.id,
                type: 'task',
                date: task.dueDate.split('T')[0], // Get date part only
                time: task.dueDate ? new Date(task.dueDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Todo o dia',
                title: task.title,
                priority: task.priority || 'MEDIUM',
                status: task.status || 'TODO',
                projectId: task.projectId,
                projectName: task.project?.name || 'Sem Projeto'
            }));

        // Add project events
        const projectEvents = projects
            .filter(p => p.startDate && selectedProjects.includes(p.id))
            .map(project => ({
                id: `project-${project.id}`,
                type: 'project',
                projectRealId: project.id,
                date: project.startDate.split('T')[0],
                endDate: project.endDate?.split('T')[0],
                time: 'Projeto',
                title: project.name,
                color: project.color || '#3b82f6',
                projectName: project.name
            }));

        return [...taskEvents, ...projectEvents].sort((a, b) => {
            if (a.date === b.date) {
                // Projects go first, then sort by time
                if (a.type === 'project' && b.type === 'task') return -1;
                if (a.type === 'task' && b.type === 'project') return 1;
                return 0;
            }
            return a.date.localeCompare(b.date);
        });
    }, [tasks, projects, selectedProjects, selectedStatuses]);

    // Get events for a specific date
    const getEventsForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return events.filter(event => event.date === dateStr);
    };

    // Check if a date is today
    const isToday = (date) => {
        return date.toDateString() === today.toDateString();
    };

    // Navigation handlers
    const goToPrevious = () => {
        if (viewMode === 'Dia') {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() - 1);
            setCurrentDate(newDate);
        } else if (viewMode === 'Semana') {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() - 7);
            setCurrentDate(newDate);
        } else {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        }
    };

    const goToNext = () => {
        if (viewMode === 'Dia') {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 1);
            setCurrentDate(newDate);
        } else if (viewMode === 'Semana') {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 7);
            setCurrentDate(newDate);
        } else {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        }
    };

    const goToToday = () => {
        setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    };

    // Toggle project filter
    const toggleProject = (projectId) => {
        setSelectedProjects(prev =>
            prev.includes(projectId)
                ? prev.filter(p => p !== projectId)
                : [...prev, projectId]
        );
    };

    // Toggle status filter
    const toggleStatus = (status) => {
        setSelectedStatuses(prev =>
            prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status]
        );
    };

    // Clear all filters
    const clearFilters = () => {
        setSelectedProjects(projects.map(p => p.id));
        setSelectedStatuses(['TODO', 'IN_PROGRESS', 'DONE']);
    };

    // Handle event click
    const handleEventClick = (event) => {
        if (event.type === 'project') {
            navigate(`/projects/${event.projectRealId}`);
        } else {
            navigate(`/tasks/${event.id}/edit`);
        }
    };

    // Drag and Drop handlers
    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', task.id); // Store task ID
        // Add a slight opacity to the dragged element
        e.target.style.opacity = '0.5';
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggedTask(null);
        setDragOverDate(null);
    };

    const handleDragOver = (e, date) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling
        e.dataTransfer.dropEffect = 'move';
        setDragOverDate(date.toISOString().split('T')[0]);
    };

    const handleDragLeave = (e) => {
        e.stopPropagation();
        setDragOverDate(null);
    };

    const handleDrop = async (e, date) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling
        setDragOverDate(null);

        if (!draggedTask) return;

        try {
            // Get the date in YYYY-MM-DD format from the drop target
            const newDateStr = date.toISOString().split('T')[0];

            // Get the original time from the task (or use midnight if no time exists)
            let timeStr = '00:00:00';
            if (draggedTask.date && draggedTask.date.includes('T')) {
                timeStr = draggedTask.date.split('T')[1]; // Preserve original time
            }

            // Combine new date with original time
            const newDueDateISO = `${newDateStr}T${timeStr}`;

            // Update the task with the new due date
            await updateTask(draggedTask.id, {
                dueDate: newDueDateISO
            });

            setDraggedTask(null);
        } catch (err) {
            console.error('Error updating task date:', err);
            alert('Erro ao atualizar a data da tarefa. Tente novamente.');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">Carregando calendário...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 h-full overflow-hidden relative">
            {/* Filters Sidebar */}
            <div className="w-80 border-r border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark overflow-y-auto hidden xl:block flex-shrink-0 p-4">
                {/* Mini Calendar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <span className="text-slate-900 dark:text-white font-bold">
                            {viewMode === 'Mês'
                                ? `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                                : `${currentDate.toLocaleDateString('pt-BR')}`
                            }
                        </span>
                        <div className="flex gap-1">
                            <button
                                onClick={goToPrevious}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-border-dark rounded text-slate-700 dark:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>
                            <button
                                onClick={goToNext}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-border-dark rounded text-slate-700 dark:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        </div>
                    </div>
                    {/* Mini grid */}
                    <div className="grid grid-cols-7 text-center gap-y-2">
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                            <span key={i} className="text-xs text-slate-500 dark:text-[#92adc9] font-medium">{d}</span>
                        ))}
                        {calendarData.slice(0, 35).map((dayData, i) => (
                            <button
                                key={i}
                                className={`size-8 mx-auto flex items-center justify-center rounded-full text-sm transition-colors ${isToday(dayData.date)
                                    ? 'bg-primary text-white shadow-md shadow-primary/40'
                                    : dayData.isCurrentMonth
                                        ? 'text-slate-700 dark:text-white hover:bg-gray-100 dark:hover:bg-border-dark'
                                        : 'text-slate-400 dark:text-slate-600'
                                    }`}
                            >
                                {dayData.day}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Projects Filter */}
                <div className="mb-6">
                    <h3 className="text-slate-500 dark:text-[#92adc9] text-xs font-bold uppercase tracking-wider mb-3 px-2">Projetos</h3>
                    <div className="space-y-1">
                        {projects.map((project) => (
                            <label key={project.id} className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-border-dark rounded-md cursor-pointer group transition-colors">
                                <input
                                    type="checkbox"
                                    checked={selectedProjects.includes(project.id)}
                                    onChange={() => toggleProject(project.id)}
                                    className="rounded border-gray-300 dark:border-border-dark bg-white dark:bg-background-dark text-primary focus:ring-0 focus:ring-offset-0 size-4"
                                />
                                <span className="size-2.5 rounded-full" style={{ backgroundColor: project.color || '#3b82f6' }}></span>
                                <span className="text-sm text-slate-700 dark:text-white flex-1 group-hover:text-primary transition-colors">{project.name}</span>
                            </label>
                        ))}
                        {projects.length === 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 px-2">Nenhum projeto encontrado</p>
                        )}
                    </div>
                </div>

                {/* Status Filter */}
                <div className="mb-6">
                    <h3 className="text-slate-500 dark:text-[#92adc9] text-xs font-bold uppercase tracking-wider mb-3 px-2">Status</h3>
                    <div className="space-y-1">
                        {TASK_STATUSES.map((status) => (
                            <label key={status.value} className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-border-dark rounded-md cursor-pointer group transition-colors">
                                <input
                                    type="checkbox"
                                    checked={selectedStatuses.includes(status.value)}
                                    onChange={() => toggleStatus(status.value)}
                                    className="rounded border-gray-300 dark:border-border-dark bg-white dark:bg-background-dark text-primary focus:ring-0 focus:ring-offset-0 size-4"
                                />
                                <span className="text-sm text-slate-700 dark:text-white flex-1 group-hover:text-primary transition-colors">{status.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Clear Filters Button */}
                <div className="px-2">
                    <button
                        onClick={clearFilters}
                        className="w-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-white bg-gray-100 dark:bg-border-dark hover:bg-gray-200 dark:hover:bg-border-dark/80 rounded-lg transition-colors"
                    >
                        Limpar Filtros
                    </button>
                </div>
            </div>

            {/* Calendar Grid Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-background-dark h-full">
                {/* Calendar Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4 border-b border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark z-10 shadow-sm relative">
                    <div className="flex items-center gap-4">
                        <Link to="/tasks/create" className="hidden md:flex items-center justify-center rounded-lg bg-primary px-4 h-9 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105 hover:bg-blue-600 mr-2">
                            <span className="material-symbols-outlined text-[20px] mr-2">add</span>
                            Nova Tarefa
                        </Link>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                            {viewMode === 'Dia' && currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                            {viewMode === 'Semana' && `Semana de ${currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`}
                            {viewMode === 'Mês' && `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                        </h2>
                        <div className="flex items-center rounded-lg border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-surface-dark p-0.5 ml-2">
                            <button
                                onClick={goToPrevious}
                                className="p-1 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-[#92adc9] hover:bg-white dark:hover:bg-background-dark rounded transition-colors shadow-sm"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button
                                onClick={goToNext}
                                className="p-1 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-[#92adc9] hover:bg-white dark:hover:bg-background-dark rounded transition-colors shadow-sm"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                        <button
                            onClick={goToToday}
                            className="hidden sm:block ml-2 px-3 py-1.5 text-sm font-bold text-slate-700 dark:text-white border border-gray-200 dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-border-dark transition-colors bg-white dark:bg-transparent"
                        >
                            Hoje
                        </button>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center p-1 bg-gray-100 dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-border-dark">
                        {['Dia', 'Semana', 'Mês'].map((view) => (
                            <label key={view} className="cursor-pointer">
                                <input
                                    type="radio"
                                    name="view"
                                    className="peer sr-only"
                                    checked={viewMode === view}
                                    onChange={() => setViewMode(view)}
                                />
                                <span className="flex items-center justify-center px-4 py-1.5 text-sm font-medium text-slate-500 dark:text-[#92adc9] rounded-md peer-checked:bg-white dark:peer-checked:bg-background-dark peer-checked:text-slate-900 dark:peer-checked:text-white peer-checked:shadow-sm transition-all hover:text-slate-900 dark:hover:text-white">
                                    {view}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>


                {/* Calendar Views */}
                <div className="flex-1 overflow-y-auto p-6">
                    {viewMode === 'Mês' && (
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-border-dark shadow-sm overflow-hidden min-h-[700px] flex flex-col">
                            {/* Days Header */}
                            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-background-dark/50">
                                {DAYS_OF_WEEK.map((day, i) => (
                                    <div key={day} className={`py-3 text-center text-sm font-semibold uppercase tracking-wider ${i >= 5 ? 'text-primary' : 'text-slate-500 dark:text-[#92adc9]'}`}>
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-gray-200 dark:bg-border-dark gap-px">
                                {calendarData.map((dayData, index) => {
                                    const dayEvents = getEventsForDate(dayData.date);
                                    return (
                                        <div
                                            key={index}
                                            className={`bg-white dark:bg-surface-dark p-2 min-h-[100px] flex flex-col gap-1 relative group hover:bg-gray-50 dark:hover:bg-[#1a2632] transition-colors ${!dayData.isCurrentMonth ? 'opacity-50' : ''
                                                } ${dragOverDate === dayData.date.toISOString().split('T')[0]
                                                    ? 'ring-2 ring-primary ring-inset bg-primary/5 dark:bg-primary/10'
                                                    : ''
                                                }`}
                                            onDragOver={(e) => handleDragOver(e, dayData.date)}
                                            onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(e, dayData.date)}
                                        >
                                            <span className={`text-sm font-medium p-1 ${isToday(dayData.date)
                                                ? 'text-white bg-primary rounded-full size-7 flex items-center justify-center shadow-lg shadow-primary/40'
                                                : dayData.isCurrentMonth
                                                    ? 'text-slate-700 dark:text-white'
                                                    : 'text-slate-400 dark:text-[#92adc9]'
                                                }`}>
                                                {dayData.day}
                                            </span>

                                            {/* Events */}
                                            {dayEvents.slice(0, 3).map((event) => (
                                                <div
                                                    key={event.id}
                                                    draggable={event.type === 'task'}
                                                    onDragStart={(e) => event.type === 'task' && handleDragStart(e, event)}
                                                    onDragEnd={handleDragEnd}
                                                    onClick={() => handleEventClick(event)}
                                                    className={`${event.type === 'project'
                                                        ? 'bg-gradient-to-r from-purple-500/10 to-purple-500/5 dark:from-purple-500/20 dark:to-purple-500/10 border-l-4 border-purple-500'
                                                        : getColorClasses(event.priority) + ' border-l-2'
                                                        } rounded-r px-2 py-1 text-xs text-slate-700 dark:text-white truncate ${event.type === 'task' ? 'cursor-move' : 'cursor-pointer'} hover:opacity-80 transition-all ${draggedTask && draggedTask.id !== event.id ? 'pointer-events-none' : ''}`}
                                                    title={`${event.time} - ${event.title}${event.type === 'project' ? ' (Projeto)' : ` (${event.projectName})`}`}
                                                    style={event.type === 'project' ? { borderLeftColor: event.color } : {}}
                                                >
                                                    <span className="font-bold flex items-center gap-1">
                                                        {event.type === 'project' && <span className="material-symbols-outlined text-xs">folder</span>}
                                                        {event.time}
                                                    </span> {event.title}
                                                </div>
                                            ))}
                                            {dayEvents.length > 3 && (
                                                <span className="text-xs text-primary font-medium px-2">+{dayEvents.length - 3} mais</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {viewMode === 'Semana' && (
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-border-dark shadow-sm overflow-hidden min-h-[700px]">
                            {/* Week Header */}
                            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-background-dark/50">
                                {Array.from({ length: 7 }).map((_, i) => {
                                    const weekDay = new Date(currentDate);
                                    weekDay.setDate(currentDate.getDate() - currentDate.getDay() + i + 1);
                                    return (
                                        <div key={i} className="py-3 text-center">
                                            <div className={`text-sm font-semibold uppercase tracking-wider ${i >= 5 ? 'text-primary' : 'text-slate-500 dark:text-[#92adc9]'}`}>
                                                {DAYS_OF_WEEK[i]}
                                            </div>
                                            <div className={`text-lg font-bold mt-1 ${isToday(weekDay) ? 'text-primary' : 'text-slate-700 dark:text-white'}`}>
                                                {weekDay.getDate()}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Week Body */}
                            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-border-dark auto-rows-fr min-h-[650px]">
                                {Array.from({ length: 7 }).map((_, i) => {
                                    const weekDay = new Date(currentDate);
                                    weekDay.setDate(currentDate.getDate() - currentDate.getDay() + i + 1);
                                    const dayEvents = getEventsForDate(weekDay);

                                    return (
                                        <div
                                            key={i}
                                            className={`bg-white dark:bg-surface-dark p-3 flex flex-col gap-2 ${dragOverDate === weekDay.toISOString().split('T')[0]
                                                ? 'ring-2 ring-primary ring-inset bg-primary/5 dark:bg-primary/10'
                                                : ''
                                                }`}
                                            onDragOver={(e) => handleDragOver(e, weekDay)}
                                            onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(e, weekDay)}
                                        >
                                            {dayEvents.map((event) => (
                                                <div
                                                    key={event.id}
                                                    draggable={event.type === 'task'}
                                                    onDragStart={(e) => event.type === 'task' && handleDragStart(e, event)}
                                                    onDragEnd={handleDragEnd}
                                                    onClick={() => handleEventClick(event)}
                                                    className={`${event.type === 'project'
                                                        ? 'bg-gradient-to-r from-purple-500/10 to-purple-500/5 dark:from-purple-500/20 dark:to-purple-500/10 border-l-4 border-purple-500'
                                                        : getColorClasses(event.priority) + ' border-l-2'
                                                        } rounded-r px-2 py-1.5 text-xs text-slate-700 dark:text-white ${event.type === 'task' ? 'cursor-move' : 'cursor-pointer'} hover:opacity-80 transition-all ${draggedTask && draggedTask.id !== event.id ? 'pointer-events-none' : ''}`}
                                                    style={event.type === 'project' ? { borderLeftColor: event.color } : {}}
                                                >
                                                    <div className="font-bold flex items-center gap-1">
                                                        {event.type === 'project' && <span className="material-symbols-outlined text-xs">folder</span>}
                                                        {event.time}
                                                    </div>
                                                    <div className="truncate">{event.title}</div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {viewMode === 'Dia' && (
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-border-dark shadow-sm overflow-hidden">
                            {/* Day Header */}
                            <div className="border-b border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-background-dark/50 py-4 px-6">
                                <div className="text-center">
                                    <div className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-[#92adc9]">
                                        {DAYS_OF_WEEK[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1]}
                                    </div>
                                    <div className={`text-2xl font-bold mt-1 ${isToday(currentDate) ? 'text-primary' : 'text-slate-700 dark:text-white'}`}>
                                        {currentDate.getDate()}
                                    </div>
                                </div>
                            </div>

                            {/* Day Body */}
                            <div
                                className={`p-6 min-h-[700px] ${dragOverDate === currentDate.toISOString().split('T')[0]
                                    ? 'ring-2 ring-primary ring-inset bg-primary/5 dark:bg-primary/10'
                                    : ''
                                    }`}
                                onDragOver={(e) => handleDragOver(e, currentDate)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, currentDate)}
                            >
                                <div className="space-y-2">
                                    {getEventsForDate(currentDate).length === 0 ? (
                                        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                                            <span className="material-symbols-outlined text-6xl opacity-50">event_available</span>
                                            <p className="mt-4 text-lg">Nenhum evento para este dia</p>
                                        </div>
                                    ) : (
                                        getEventsForDate(currentDate).map((event) => (
                                            <div
                                                key={event.id}
                                                draggable={event.type === 'task'}
                                                onDragStart={(e) => event.type === 'task' && handleDragStart(e, event)}
                                                onDragEnd={handleDragEnd}
                                                onClick={() => handleEventClick(event)}
                                                className={`${event.type === 'project'
                                                    ? 'bg-gradient-to-r from-purple-500/10 to-purple-500/5 dark:from-purple-500/20 dark:to-purple-500/10 border-l-4 border-purple-500'
                                                    : getColorClasses(event.priority) + ' border-l-2'
                                                    } rounded-r px-4 py-3 text-sm text-slate-700 dark:text-white ${event.type === 'task' ? 'cursor-move' : 'cursor-pointer'} hover:opacity-80 transition-all ${draggedTask && draggedTask.id !== event.id ? 'pointer-events-none' : ''}`}
                                                style={event.type === 'project' ? { borderLeftColor: event.color } : {}}
                                            >
                                                <div className="font-bold text-base flex items-center gap-2">
                                                    {event.type === 'project' && <span className="material-symbols-outlined">folder</span>}
                                                    {event.time}
                                                </div>
                                                <div className="mt-1 text-base">{event.title}</div>
                                                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                    {event.type === 'project' ? 'Projeto' : event.projectName}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
