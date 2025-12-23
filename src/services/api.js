// API Service for connecting to the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper to get auth token
const getToken = () => localStorage.getItem('token');

// Helper to handle API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401 || response.status === 403) {
            // Clear auth data
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirect to login only if not already on login page
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        const error = await response.json().catch(() => ({ error: 'Network error' }));
        const errorMessage = error.error || `Request failed with status ${response.status}`;
        const err = new Error(errorMessage);
        err.status = response.status;
        throw err;
    }
    return response.json();
};

// Create fetch options with auth header
const createOptions = (method = 'GET', body = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    };

    const token = getToken();
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    return options;
};

// ==================== AUTH ====================
export const authAPI = {
    login: async (email, password) => {
        const res = await fetch(`${API_BASE_URL}/auth/login`, createOptions('POST', { email, password }));
        const data = await handleResponse(res);
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },

    register: async (userData) => {
        const res = await fetch(`${API_BASE_URL}/auth/register`, createOptions('POST', userData));
        return handleResponse(res);
    },

    logout: async () => {
        await fetch(`${API_BASE_URL}/auth/logout`, createOptions('POST'));
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: async () => {
        const res = await fetch(`${API_BASE_URL}/auth/me`, createOptions());
        return handleResponse(res);
    },

    changePassword: async (currentPassword, newPassword) => {
        const res = await fetch(`${API_BASE_URL}/auth/password`, createOptions('PUT', { currentPassword, newPassword }));
        return handleResponse(res);
    },

    isAuthenticated: () => !!getToken(),

    getStoredUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

// ==================== USERS ====================
export const usersAPI = {
    list: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE_URL}/users?${query}`, createOptions());
        return handleResponse(res);
    },

    get: async (id) => {
        const res = await fetch(`${API_BASE_URL}/users/${id}`, createOptions());
        return handleResponse(res);
    },

    create: async (userData) => {
        const res = await fetch(`${API_BASE_URL}/users`, createOptions('POST', userData));
        return handleResponse(res);
    },

    update: async (id, userData) => {
        const res = await fetch(`${API_BASE_URL}/users/${id}`, createOptions('PUT', userData));
        return handleResponse(res);
    },

    delete: async (id) => {
        const res = await fetch(`${API_BASE_URL}/users/${id}`, createOptions('DELETE'));
        return handleResponse(res);
    }
};

// ==================== PROJECTS ====================
export const projectsAPI = {
    list: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE_URL}/projects?${query}`, createOptions());
        return handleResponse(res);
    },

    get: async (id) => {
        const res = await fetch(`${API_BASE_URL}/projects/${id}`, createOptions());
        return handleResponse(res);
    },

    getById: async (id) => {
        const res = await fetch(`${API_BASE_URL}/projects/${id}`, createOptions());
        return handleResponse(res);
    },

    create: async (projectData) => {
        const res = await fetch(`${API_BASE_URL}/projects`, createOptions('POST', projectData));
        return handleResponse(res);
    },

    update: async (id, projectData) => {
        const res = await fetch(`${API_BASE_URL}/projects/${id}`, createOptions('PUT', projectData));
        return handleResponse(res);
    },

    quickUpdate: async (id, updates) => {
        const res = await fetch(`${API_BASE_URL}/projects/${id}/quick-update`, createOptions('PATCH', updates));
        return handleResponse(res);
    },

    delete: async (id) => {
        const res = await fetch(`${API_BASE_URL}/projects/${id}`, createOptions('DELETE'));
        return handleResponse(res);
    },

    // Members
    addMember: async (projectId, userId, role) => {
        const res = await fetch(`${API_BASE_URL}/projects/${projectId}/members`, createOptions('POST', { userId, role }));
        return handleResponse(res);
    },

    removeMember: async (projectId, userId) => {
        const res = await fetch(`${API_BASE_URL}/projects/${projectId}/members/${userId}`, createOptions('DELETE'));
        return handleResponse(res);
    },

    // Deliverables
    addDeliverable: async (projectId, data) => {
        const res = await fetch(`${API_BASE_URL}/projects/${projectId}/deliverables`, createOptions('POST', data));
        return handleResponse(res);
    },

    updateDeliverable: async (projectId, deliverableId, data) => {
        const res = await fetch(`${API_BASE_URL}/projects/${projectId}/deliverables/${deliverableId}`, createOptions('PUT', data));
        return handleResponse(res);
    },

    deleteDeliverable: async (projectId, deliverableId) => {
        const res = await fetch(`${API_BASE_URL}/projects/${projectId}/deliverables/${deliverableId}`, createOptions('DELETE'));
        return handleResponse(res);
    },

    // Resources
    addResource: async (projectId, data) => {
        const res = await fetch(`${API_BASE_URL}/projects/${projectId}/resources`, createOptions('POST', data));
        return handleResponse(res);
    },

    deleteResource: async (projectId, resourceId) => {
        const res = await fetch(`${API_BASE_URL}/projects/${projectId}/resources/${resourceId}`, createOptions('DELETE'));
        return handleResponse(res);
    }
};

// ==================== TECHNOLOGIES ====================
export const technologiesAPI = {
    list: async () => {
        const res = await fetch(`${API_BASE_URL}/technologies`, createOptions());
        return handleResponse(res);
    },

    create: async (data) => {
        const res = await fetch(`${API_BASE_URL}/technologies`, createOptions('POST', data));
        return handleResponse(res);
    }
};

// ==================== TASKS ====================
export const tasksAPI = {
    list: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE_URL}/tasks?${query}`, createOptions());
        return handleResponse(res);
    },

    getMyTasks: async () => {
        const res = await fetch(`${API_BASE_URL}/tasks/my`, createOptions());
        return handleResponse(res);
    },

    getKanban: async (projectId) => {
        const res = await fetch(`${API_BASE_URL}/tasks/kanban/${projectId}`, createOptions());
        return handleResponse(res);
    },

    get: async (id) => {
        const res = await fetch(`${API_BASE_URL}/tasks/${id}`, createOptions());
        return handleResponse(res);
    },

    create: async (taskData) => {
        const res = await fetch(`${API_BASE_URL}/tasks`, createOptions('POST', taskData));
        return handleResponse(res);
    },

    update: async (id, taskData) => {
        const res = await fetch(`${API_BASE_URL}/tasks/${id}`, createOptions('PUT', taskData));
        return handleResponse(res);
    },

    reorder: async (id, status, order) => {
        const res = await fetch(`${API_BASE_URL}/tasks/${id}/reorder`, createOptions('PUT', { status, order }));
        return handleResponse(res);
    },

    delete: async (id) => {
        const res = await fetch(`${API_BASE_URL}/tasks/${id}`, createOptions('DELETE'));
        return handleResponse(res);
    },

    addComment: async (taskId, content, parentId = null) => {
        const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`, createOptions('POST', { content, parentId }));
        return handleResponse(res);
    }
};

// ==================== CLIENTS ====================
export const clientsAPI = {
    list: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE_URL}/clients?${query}`, createOptions());
        return handleResponse(res);
    },

    get: async (id) => {
        const res = await fetch(`${API_BASE_URL}/clients/${id}`, createOptions());
        return handleResponse(res);
    },

    create: async (clientData) => {
        const res = await fetch(`${API_BASE_URL}/clients`, createOptions('POST', clientData));
        return handleResponse(res);
    },

    update: async (id, clientData) => {
        const res = await fetch(`${API_BASE_URL}/clients/${id}`, createOptions('PUT', clientData));
        return handleResponse(res);
    },

    delete: async (id) => {
        const res = await fetch(`${API_BASE_URL}/clients/${id}`, createOptions('DELETE'));
        return handleResponse(res);
    }
};

// ==================== TEAM ====================
export const teamAPI = {
    list: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE_URL}/team?${query}`, createOptions());
        return handleResponse(res);
    },

    getMembers: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE_URL}/team?${query}`, createOptions());
        return handleResponse(res);
    },

    get: async (id) => {
        const res = await fetch(`${API_BASE_URL}/team/${id}`, createOptions());
        return handleResponse(res);
    },

    getStats: async () => {
        const res = await fetch(`${API_BASE_URL}/team/stats/overview`, createOptions());
        return handleResponse(res);
    }
};

// ==================== DASHBOARD ====================
export const dashboardAPI = {
    getStats: async () => {
        const res = await fetch(`${API_BASE_URL}/dashboard/stats`, createOptions());
        return handleResponse(res);
    },

    getRecentProjects: async () => {
        const res = await fetch(`${API_BASE_URL}/dashboard/projects/recent`, createOptions());
        return handleResponse(res);
    },

    getUpcomingTasks: async () => {
        const res = await fetch(`${API_BASE_URL}/dashboard/tasks/upcoming`, createOptions());
        return handleResponse(res);
    },

    getActivities: async () => {
        const res = await fetch(`${API_BASE_URL}/dashboard/activities`, createOptions());
        return handleResponse(res);
    },

    getData: async () => {
        const res = await fetch(`${API_BASE_URL}/dashboard`, createOptions());
        return handleResponse(res);
    },

    getCalendar: async (start, end) => {
        const query = new URLSearchParams({ start, end }).toString();
        const res = await fetch(`${API_BASE_URL}/dashboard/calendar?${query}`, createOptions());
        return handleResponse(res);
    },

    createEvent: async (eventData) => {
        const res = await fetch(`${API_BASE_URL}/dashboard/calendar`, createOptions('POST', eventData));
        return handleResponse(res);
    },

    getNotifications: async () => {
        const res = await fetch(`${API_BASE_URL}/dashboard/notifications`, createOptions());
        return handleResponse(res);
    },

    markNotificationRead: async (id) => {
        const res = await fetch(`${API_BASE_URL}/dashboard/notifications/${id}/read`, createOptions('PUT'));
        return handleResponse(res);
    },

    markAllNotificationsRead: async () => {
        const res = await fetch(`${API_BASE_URL}/dashboard/notifications/read-all`, createOptions('PUT'));
        return handleResponse(res);
    }
};

// ==================== REPORTS ====================
export const reportsAPI = {
    getData: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE_URL}/reports/data?${query}`, createOptions());
        return handleResponse(res);
    },

    getSummary: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE_URL}/reports/summary?${query}`, createOptions());
        return handleResponse(res);
    },

    export: async (format, params = {}) => {
        const query = new URLSearchParams({ ...params, format }).toString();
        const res = await fetch(`${API_BASE_URL}/reports/export?${query}`, createOptions());

        if (format === 'csv') {
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `relatorio-${Date.now()}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            return { success: true };
        }

        return handleResponse(res);
    }
};

// ==================== MESSAGES ====================
export const messagesAPI = {
    list: async () => {
        const res = await fetch(`${API_BASE_URL}/messages`, createOptions());
        return handleResponse(res);
    },

    getUnreadCount: async () => {
        const res = await fetch(`${API_BASE_URL}/messages/unread-count`, createOptions());
        return handleResponse(res);
    },

    send: async (receiverId, content) => {
        const res = await fetch(`${API_BASE_URL}/messages`, createOptions('POST', { receiverId, content }));
        return handleResponse(res);
    },

    markAsRead: async (id) => {
        const res = await fetch(`${API_BASE_URL}/messages/${id}/read`, createOptions('PUT'));
        return handleResponse(res);
    },

    markAllAsRead: async () => {
        const res = await fetch(`${API_BASE_URL}/messages/read-all`, createOptions('PUT'));
        return handleResponse(res);
    },

    delete: async (id) => {
        const res = await fetch(`${API_BASE_URL}/messages/${id}`, createOptions('DELETE'));
        return handleResponse(res);
    }
};

// Export all APIs
export default {
    auth: authAPI,
    users: usersAPI,
    projects: projectsAPI,
    tasks: tasksAPI,
    clients: clientsAPI,
    team: teamAPI,
    dashboard: dashboardAPI,
    reports: reportsAPI,
    messages: messagesAPI
};
