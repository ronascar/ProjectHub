import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectsList from './pages/ProjectsList';
import KanbanBoard from './pages/KanbanBoard';
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
                <Route path="kanban" element={<KanbanBoard />} />
                <Route path="teams" element={<div className="p-8"><h1 className="text-2xl font-bold dark:text-white">Teams - Coming Soon</h1></div>} />
                <Route path="reports" element={<div className="p-8"><h1 className="text-2xl font-bold dark:text-white">Reports - Coming Soon</h1></div>} />
                <Route path="calendar" element={<div className="p-8"><h1 className="text-2xl font-bold dark:text-white">Calendar - Coming Soon</h1></div>} />
                <Route path="tasks" element={<div className="p-8"><h1 className="text-2xl font-bold dark:text-white">My Tasks - Coming Soon</h1></div>} />
                <Route path="inbox" element={<div className="p-8"><h1 className="text-2xl font-bold dark:text-white">Inbox - Coming Soon</h1></div>} />
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
