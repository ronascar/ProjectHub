import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '../services/api';

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load all tasks
    const loadTasks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await tasksAPI.list();
            setTasks(data);
        } catch (err) {
            console.error('Error loading tasks:', err);
            setError(err.message || 'Erro ao carregar tarefas');
        } finally {
            setLoading(false);
        }
    }, []);

    // Create new task
    const createTask = useCallback(async (taskData) => {
        try {
            const newTask = await tasksAPI.create(taskData);
            setTasks(prev => [...prev, newTask]);
            return newTask;
        } catch (err) {
            console.error('Error creating task:', err);
            throw err;
        }
    }, []);

    // Update existing task
    const updateTask = useCallback(async (id, taskData) => {
        try {
            const updatedTask = await tasksAPI.update(id, taskData);
            setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
            return updatedTask;
        } catch (err) {
            console.error('Error updating task:', err);
            throw err;
        }
    }, []);

    // Delete task
    const deleteTask = useCallback(async (id) => {
        try {
            await tasksAPI.delete(id);
            setTasks(prev => prev.filter(task => task.id !== id));
        } catch (err) {
            console.error('Error deleting task:', err);
            throw err;
        }
    }, []);

    // Refresh tasks (manual reload)
    const refreshTasks = useCallback(async () => {
        await loadTasks();
    }, [loadTasks]);

    // Load tasks on mount
    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const value = {
        tasks,
        loading,
        error,
        loadTasks,
        createTask,
        updateTask,
        deleteTask,
        refreshTasks
    };

    return (
        <TasksContext.Provider value={value}>
            {children}
        </TasksContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TasksContext);
    if (!context) {
        throw new Error('useTasks must be used within a TasksProvider');
    }
    return context;
}

export default TasksContext;
