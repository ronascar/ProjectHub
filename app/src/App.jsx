import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectsList from './pages/ProjectsList';
import KanbanBoard from './pages/KanbanBoard';
import ProjectDetails from './pages/ProjectDetails';
import TaskForm from './pages/TaskForm';
import MyTasks from './pages/MyTasks';
import Calendar from './pages/Calendar';
import Reports from './pages/Reports';
import ProjectTimeline from './pages/ProjectTimeline';
import Inbox from './pages/Inbox';
import Teams from './pages/Teams';
import CreateProject from './pages/CreateProject';
import Settings from './pages/Settings';
import './style.css';

// Protected Route wrapper
function ProtectedRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" replace />;
}

// App Router Component
function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<ProjectsList />} />
                <Route path="projects/create" element={<CreateProject />} />
                <Route path="projects/:projectId" element={<ProjectDetails />} />
                <Route path="projects/:projectId/timeline" element={<ProjectTimeline />} />
                <Route path="tasks" element={<MyTasks />} />
                <Route path="tasks/create" element={<TaskForm />} />
                <Route path="tasks/:taskId/edit" element={<TaskForm />} />
                <Route path="kanban" element={<KanbanBoard />} />
                <Route path="teams" element={<Teams />} />
                <Route path="reports" element={<Reports />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="inbox" element={<Inbox />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <AppRouter />
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
