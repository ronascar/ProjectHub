import { useState, useMemo } from 'react';

// Mock events data - can be replaced with API data
const MOCK_EVENTS = [
    { id: 1, date: '2024-12-02', time: '09:00', title: 'Sprint Planning', color: 'primary', project: 'Website Redesign' },
    { id: 2, date: '2024-12-04', time: '14:00', title: 'Design Review', color: 'purple', project: 'Mobile App' },
    { id: 3, date: '2024-12-04', time: '16:00', title: 'Client Call', color: 'green', project: 'Marketing Q4' },
    { id: 4, date: '2024-12-05', time: '11:30', title: 'Team Lunch', color: 'orange', project: 'Internal Ops' },
    { id: 5, date: '2024-12-09', time: '10:00', title: 'Daily Standup', color: 'primary', project: 'Website Redesign' },
    { id: 6, date: '2024-12-10', time: 'EOD', title: 'Project Delivery', color: 'red', project: 'Mobile App' },
    { id: 7, date: '2024-12-12', time: '15:00', title: 'UX Workshop', color: 'purple', project: 'Mobile App' },
    { id: 8, date: '2024-12-16', time: '09:00', title: 'Sprint Planning', color: 'primary', project: 'Website Redesign' },
    { id: 9, date: '2024-12-19', time: '10:00', title: 'Q4 Strategy', color: 'green', project: 'Marketing Q4' },
    { id: 10, date: '2024-12-22', time: '13:00', title: 'Design Huddle', color: 'purple', project: 'Mobile App' },
    { id: 11, date: '2024-12-25', time: '14:00', title: 'Holiday Break', color: 'orange', project: 'Internal Ops' },
    { id: 12, date: '2024-12-30', time: '09:00', title: 'Sprint Planning', color: 'primary', project: 'Website Redesign' },
];

const PROJECTS = [
    { name: 'Website Redesign', color: 'bg-primary', checked: true },
    { name: 'Mobile App', color: 'bg-purple-500', checked: true },
    { name: 'Marketing Q4', color: 'bg-green-500', checked: true },
    { name: 'Internal Ops', color: 'bg-orange-500', checked: false }
];

const TEAM_MEMBERS = [
    { name: 'Sarah Connor', img: 'https://i.pravatar.cc/100?u=sarah' },
    { name: 'Michael Chen', img: 'https://i.pravatar.cc/100?u=michael' },
    { name: 'Jessica Jones', img: 'https://i.pravatar.cc/100?u=jessica' }
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const getColorClasses = (color) => {
    const colors = {
        primary: 'bg-primary/10 dark:bg-primary/20 border-primary',
        purple: 'bg-purple-500/10 dark:bg-purple-500/20 border-purple-500',
        green: 'bg-green-500/10 dark:bg-green-500/20 border-green-500',
        orange: 'bg-orange-500/10 dark:bg-orange-500/20 border-orange-500',
        red: 'bg-red-500/10 dark:bg-red-500/20 border-red-500',
    };
    return colors[color] || colors.primary;
};

export default function Calendar() {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedProjects, setSelectedProjects] = useState(
        PROJECTS.filter(p => p.checked).map(p => p.name)
    );
    const [viewMode, setViewMode] = useState('Month');

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

    // Filter events by selected projects
    const filteredEvents = useMemo(() => {
        return MOCK_EVENTS.filter(event => selectedProjects.includes(event.project));
    }, [selectedProjects]);

    // Get events for a specific date
    const getEventsForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return filteredEvents.filter(event => event.date === dateStr);
    };

    // Check if a date is today
    const isToday = (date) => {
        return date.toDateString() === today.toDateString();
    };

    // Navigation handlers
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    };

    // Toggle project filter
    const toggleProject = (projectName) => {
        setSelectedProjects(prev =>
            prev.includes(projectName)
                ? prev.filter(p => p !== projectName)
                : [...prev, projectName]
        );
    };

    return (
        <div className="flex flex-1 h-full overflow-hidden relative">
            {/* Filters Sidebar */}
            <div className="w-80 border-r border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark overflow-y-auto hidden xl:block flex-shrink-0 p-4">
                {/* Mini Calendar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <span className="text-slate-900 dark:text-white font-bold">
                            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <div className="flex gap-1">
                            <button
                                onClick={goToPreviousMonth}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-border-dark rounded text-slate-700 dark:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>
                            <button
                                onClick={goToNextMonth}
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
                <div className="mb-8">
                    <h3 className="text-slate-500 dark:text-[#92adc9] text-xs font-bold uppercase tracking-wider mb-3 px-2">Projetos</h3>
                    <div className="space-y-1">
                        {PROJECTS.map((project, idx) => (
                            <label key={idx} className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-border-dark rounded-md cursor-pointer group transition-colors">
                                <input
                                    type="checkbox"
                                    checked={selectedProjects.includes(project.name)}
                                    onChange={() => toggleProject(project.name)}
                                    className="rounded border-gray-300 dark:border-border-dark bg-white dark:bg-background-dark text-primary focus:ring-0 focus:ring-offset-0 size-4"
                                />
                                <span className={`size-2.5 rounded-full ${project.color}`}></span>
                                <span className="text-sm text-slate-700 dark:text-white flex-1 group-hover:text-primary transition-colors">{project.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Team Filter */}
                <div>
                    <h3 className="text-slate-500 dark:text-[#92adc9] text-xs font-bold uppercase tracking-wider mb-3 px-2">Equipe</h3>
                    <div className="space-y-2">
                        {TEAM_MEMBERS.map((person, idx) => (
                            <div key={idx} className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-border-dark rounded-md cursor-pointer transition-colors">
                                <div className="size-8 rounded-full bg-cover bg-gray-200" style={{ backgroundImage: `url('${person.img}')` }}></div>
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
                    <div className="flex items-center gap-4">
                        <button className="hidden md:flex items-center justify-center rounded-lg bg-primary px-4 h-9 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105 hover:bg-blue-600 mr-2">
                            <span className="material-symbols-outlined text-[20px] mr-2">add</span>
                            Novo Evento
                        </button>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <div className="flex items-center rounded-lg border border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-surface-dark p-0.5 ml-2">
                            <button
                                onClick={goToPreviousMonth}
                                className="p-1 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-[#92adc9] hover:bg-white dark:hover:bg-background-dark rounded transition-colors shadow-sm"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button
                                onClick={goToNextMonth}
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

                {/* Calendar Grid (Month View) */}
                <div className="flex-1 overflow-y-auto p-6">
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
                                const events = getEventsForDate(dayData.date);
                                return (
                                    <div
                                        key={index}
                                        className={`bg-white dark:bg-surface-dark p-2 min-h-[100px] flex flex-col gap-1 relative group hover:bg-gray-50 dark:hover:bg-[#1a2632] transition-colors ${!dayData.isCurrentMonth ? 'opacity-50' : ''
                                            }`}
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
                                        {events.slice(0, 3).map((event) => (
                                            <div
                                                key={event.id}
                                                className={`${getColorClasses(event.color)} border-l-2 rounded-r px-2 py-1 text-xs text-slate-700 dark:text-white truncate cursor-pointer hover:opacity-80 transition-all`}
                                                title={`${event.time} - ${event.title}`}
                                            >
                                                <span className="font-bold">{event.time}</span> {event.title}
                                            </div>
                                        ))}
                                        {events.length > 3 && (
                                            <span className="text-xs text-primary font-medium px-2">+{events.length - 3} mais</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
