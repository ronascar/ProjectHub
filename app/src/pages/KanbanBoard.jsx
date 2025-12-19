import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { mockTasks } from '../data/mockData';

// Sortable Task Card Component
function TaskCard({ task }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="group bg-white dark:bg-[#1e2a36] p-4 rounded-lg shadow-sm border border-transparent hover:border-primary/40 dark:hover:border-primary/40 cursor-grab active:cursor-grabbing transition-all hover:shadow-md"
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`bg-${task.tagColor || 'gray'}-100 text-${task.tagColor || 'gray'}-700 dark:bg-${task.tagColor || 'gray'}-900/30 dark:text-${task.tagColor || 'gray'}-300 text-[10px] font-bold px-2 py-1 rounded`}>
                    {task.tag}
                </span>
                <button className="text-slate-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
            </div>
            <h4 className={`text-sm font-semibold mb-3 leading-snug ${task.completed ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
                {task.title}
            </h4>
            {task.progress !== undefined && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-3">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${task.progress}%` }} />
                </div>
            )}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2">
                    {task.assignee ? (
                        <div className="size-6 rounded-full bg-cover bg-center">
                            <img src={task.assignee.avatar} alt={task.assignee.name} className="w-full h-full rounded-full object-cover" />
                        </div>
                    ) : (
                        <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-300">
                            N/A
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
                    {task.comments !== undefined && (
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">chat_bubble</span>
                            <span>{task.comments}</span>
                        </div>
                    )}
                    {task.attachments !== undefined && (
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">attach_file</span>
                            <span>{task.attachments}</span>
                        </div>
                    )}
                    {task.dueDate && (
                        <div className={`flex items-center gap-1 ${task.dueDateColor ? `text-${task.dueDateColor}-400` : ''}`}>
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            <span>{task.dueDate}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Kanban Column Component
function KanbanColumn({ title, tasks, count, color = 'gray' }) {
    return (
        <div className="flex flex-col w-80 h-full rounded-xl bg-slate-100/50 dark:bg-[#16212e] border border-slate-200/50 dark:border-slate-800/50">
            <div className={`flex items-center justify-between p-4 flex-shrink-0 ${color !== 'gray' ? `border-t-2 border-${color}-500` : ''} rounded-t-xl`}>
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-white uppercase tracking-wider">{title}</h3>
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${color === 'primary' ? 'bg-blue-100 dark:bg-primary/20 text-blue-700 dark:text-blue-300' :
                        color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                            color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                                'bg-slate-200 dark:bg-[#233648] text-slate-600 dark:text-slate-300'
                        }`}>
                        {count}
                    </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                    <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-3">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}

export default function KanbanBoard({ showHeader = true }) {
    const [tasks, setTasks] = useState(mockTasks);
    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        // Find which columns the tasks are in
        let sourceColumn = null;
        let destColumn = null;

        Object.keys(tasks).forEach(column => {
            if (tasks[column].find(t => t.id === active.id)) sourceColumn = column;
            if (tasks[column].find(t => t.id === over.id)) destColumn = column;
        });

        if (!sourceColumn || !destColumn) return;

        // Move task between columns
        const newTasks = { ...tasks };
        const sourceIndex = newTasks[sourceColumn].findIndex(t => t.id === active.id);
        const destIndex = newTasks[destColumn].findIndex(t => t.id === over.id);

        const [movedTask] = newTasks[sourceColumn].splice(sourceIndex, 1);
        newTasks[destColumn].splice(destIndex, 0, movedTask);

        setTasks(newTasks);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header Section */}
            {showHeader && (
                <header className="flex flex-col gap-4 p-6 pb-2 bg-background-light dark:bg-background-dark border-b border-transparent">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 dark:text-[#92adc9] text-sm font-medium">Projects</span>
                        <span className="text-slate-400 dark:text-[#586e85] text-sm">/</span>
                        <span className="text-slate-900 dark:text-white text-sm font-medium">Project Alpha</span>
                    </div>

                    {/* Page Heading & Actions */}
                    <div className="flex flex-wrap justify-between items-end gap-4">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Sprint 24 Board</h2>
                            <p className="text-slate-500 dark:text-[#92adc9] text-base">
                                Manage tasks and track progress for the upcoming release.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <div className="hidden md:flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="inline-block size-8 rounded-full ring-2 ring-white dark:ring-[#101922]">
                                        <img src={`https://i.pravatar.cc/150?img=${i}`} alt="Team member" className="w-full h-full rounded-full object-cover" />
                                    </div>
                                ))}
                                <div className="flex items-center justify-center size-8 rounded-full ring-2 ring-white dark:ring-[#101922] bg-slate-100 dark:bg-[#233648] text-xs font-medium text-slate-600 dark:text-white cursor-pointer hover:bg-slate-200 dark:hover:bg-[#2d465e]">
                                    +3
                                </div>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#233648] border border-slate-200 dark:border-transparent text-slate-700 dark:text-white rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#2d465e] transition-colors">
                                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                                <span>Filter</span>
                            </button>
                            <Link to="/tasks/create" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                <span>New Task</span>
                            </Link>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="flex items-center w-full max-w-lg mt-2">
                        <div className="relative w-full group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </div>
                            <input
                                className="block w-full p-2.5 pl-10 text-sm text-slate-900 border border-slate-200 rounded-lg bg-white focus:ring-primary focus:border-primary dark:bg-[#1e2a36] dark:border-transparent dark:placeholder-slate-500 dark:text-white dark:focus:ring-primary focus:outline-none transition-all shadow-sm"
                                placeholder="Search tasks by title, tag, or assignee..."
                                type="text"
                            />
                        </div>
                    </div>
                </header>
            )}

            {/* Kanban Board Area */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                    <div className="flex h-full gap-6 min-w-max pb-4">
                        <KanbanColumn title="Backlog" tasks={tasks.backlog} count={tasks.backlog.length} color="gray" />
                        <KanbanColumn title="Em andamento" tasks={tasks.inProgress} count={tasks.inProgress.length} color="primary" />
                        <KanbanColumn title="Em teste" tasks={tasks.testing} count={tasks.testing.length} color="amber" />
                        <KanbanColumn title="Concluída" tasks={tasks.done} count={tasks.done.length} color="emerald" />
                    </div>
                </DndContext>
            </div>
        </div>
    );
}
