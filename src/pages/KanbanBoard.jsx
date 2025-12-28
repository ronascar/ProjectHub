import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTasks } from '../context/TasksContext';

// Sortable Task Card Component
function TaskCard({ task }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // Função para obter as classes de cor da tag
    const getTagColorClasses = (tagColor) => {
        const colorMap = {
            blue: 'bg-blue-500 text-white',
            gray: 'bg-slate-600 text-white',
            purple: 'bg-purple-500 text-white',
            red: 'bg-red-500 text-white',
            green: 'bg-emerald-500 text-white',
            orange: 'bg-orange-500 text-white',
            pink: 'bg-pink-500 text-white',
            yellow: 'bg-yellow-500 text-slate-900',
        };
        return colorMap[tagColor] || 'bg-slate-500 text-white';
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
                <span className={`${getTagColorClasses(task.tagColor)} text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wide`}>
                    {task.tag}
                </span>
                <Link to={`/tasks/${task.id}/edit`} className="text-slate-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                </Link>
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
        <div className="flex flex-col h-full rounded-xl bg-slate-100/50 dark:bg-[#16212e] border border-slate-200/50 dark:border-slate-800/50">
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

export default function KanbanBoard({ showHeader = true, projectId, project }) {
    const [organizedTasks, setOrganizedTasks] = useState({ backlog: [], inProgress: [], testing: [], done: [] });
    const { tasks, loading, error, updateTask } = useTasks();
    const sensors = useSensors(useSensor(PointerSensor));

    // Organize tasks by status whenever tasks change
    useEffect(() => {
        organizeTasks();
    }, [tasks, projectId]);

    const organizeTasks = () => {
        const organized = {
            backlog: [],
            inProgress: [],
            testing: [],
            done: []
        };

        // Filter tasks by projectId if provided
        const filteredTasks = projectId
            ? tasks.filter(task => task.projectId === projectId)
            : tasks;

        filteredTasks.forEach(task => {
            const taskData = {
                id: task.id,
                title: task.title,
                tag: task.priority?.toUpperCase() || 'NORMAL',
                tagColor: getTagColor(task.priority),
                assignee: task.assignee ? {
                    name: task.assignee.name,
                    avatar: task.assignee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee.name)}&background=random`
                } : null,
                dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : null,
                comments: 0, // TODO: implementar contagem de comentários
                attachments: 0, // TODO: implementar contagem de anexos
                completed: task.status === 'DONE'
            };

            // Mapear status para colunas do Kanban
            switch (task.status) {
                case 'TODO':
                case 'BACKLOG':
                    organized.backlog.push(taskData);
                    break;
                case 'IN_PROGRESS':
                    organized.inProgress.push(taskData);
                    break;
                case 'IN_REVIEW':
                case 'TESTING':
                    organized.testing.push(taskData);
                    break;
                case 'DONE':
                    organized.done.push(taskData);
                    break;
                default:
                    organized.backlog.push(taskData);
            }
        });

        setOrganizedTasks(organized);
    };

    const getTagColor = (priority) => {
        const colorMap = {
            HIGH: 'red',
            MEDIUM: 'orange',
            LOW: 'blue',
            URGENT: 'red'
        };
        return colorMap[priority] || 'gray';
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        // Find which columns the tasks are in
        let sourceColumn = null;
        let destColumn = null;

        Object.keys(organizedTasks).forEach(column => {
            if (organizedTasks[column].find(t => t.id === active.id)) sourceColumn = column;
            if (organizedTasks[column].find(t => t.id === over.id)) destColumn = column;
        });

        if (!sourceColumn || !destColumn) return;

        // Move task between columns
        const newTasks = { ...organizedTasks };
        const sourceIndex = newTasks[sourceColumn].findIndex(t => t.id === active.id);
        const destIndex = newTasks[destColumn].findIndex(t => t.id === over.id);

        const [movedTask] = newTasks[sourceColumn].splice(sourceIndex, 1);
        newTasks[destColumn].splice(destIndex, 0, movedTask);

        // Update local state immediately for better UX
        setOrganizedTasks(newTasks);

        // Map column to status
        const statusMap = {
            backlog: 'TODO',
            inProgress: 'IN_PROGRESS',
            testing: 'IN_REVIEW',
            done: 'DONE'
        };

        // Update task status in the backend
        try {
            await updateTask(active.id, { status: statusMap[destColumn] });
        } catch (err) {
            console.error('Error updating task status:', err);
            // Revert on error
            organizeTasks();
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-slate-500 dark:text-slate-400">Carregando tarefas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                    <p className="text-slate-900 dark:text-white font-semibold mb-2">Erro ao carregar tarefas</p>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header Section */}
            {showHeader && (
                <header className="flex flex-col gap-4 p-6 pb-2 bg-background-light dark:bg-background-dark border-b border-transparent flex-shrink-0">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2">
                        <Link to={projectId ? "/projects" : "/"} className="text-slate-500 hover:text-primary dark:text-[#92adc9] text-sm font-medium transition-colors">
                            {projectId ? 'Projetos' : 'Dashboard'}
                        </Link>
                        <span className="text-slate-400 dark:text-[#586e85] text-sm">/</span>
                        <span className="text-slate-900 dark:text-white text-sm font-medium">{project?.name || 'Tarefas'}</span>
                    </div>

                    {/* Page Heading & Actions */}
                    <div className="flex flex-wrap justify-between items-end gap-4">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                {project?.name || 'Quadro de Tarefas'}
                            </h2>
                            <p className="text-slate-500 dark:text-[#92adc9] text-base">
                                Gerencie tarefas e acompanhe o progresso do projeto.
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
                                <span>Filtrar</span>
                            </button>
                            <Link to="/tasks/create" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                <span>Nova Tarefa</span>
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
                                placeholder="Buscar tarefas por título, tag ou responsável..."
                                type="text"
                            />
                        </div>
                    </div>
                </header>
            )}

            {/* Kanban Board Area */}
            <div className="flex-1 overflow-hidden">
                <div className="h-full p-6">
                    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
                            <KanbanColumn title="Backlog" tasks={organizedTasks.backlog} count={organizedTasks.backlog.length} color="gray" />
                            <KanbanColumn title="Em andamento" tasks={organizedTasks.inProgress} count={organizedTasks.inProgress.length} color="primary" />
                            <KanbanColumn title="Em teste" tasks={organizedTasks.testing} count={organizedTasks.testing.length} color="amber" />
                            <KanbanColumn title="Concluída" tasks={organizedTasks.done} count={organizedTasks.done.length} color="emerald" />
                        </div>
                    </DndContext>
                </div>
            </div>
        </div>
    );
}
