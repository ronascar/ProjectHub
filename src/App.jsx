import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TasksProvider } from './context/TasksContext';
import { useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectsList from './pages/ProjectsList';
import KanbanBoard from './pages/KanbanBoard';
import ProjectDetails from './pages/ProjectDetails';
import ProjectEdit from './pages/ProjectEdit';
import TaskForm from './pages/TaskForm';
import MyTasks from './pages/MyTasks';
import Calendar from './pages/Calendar';
import Reports from './pages/Reports';
import ProjectTimeline from './pages/ProjectTimeline';
import Inbox from './pages/Inbox';
import Teams from './pages/Teams';
import MemberEdit from './pages/MemberEdit';
import MemberView from './pages/MemberView';
import MemberCreate from './pages/MemberCreate';
import CreateProject from './pages/CreateProject';
import ClientsList from './pages/ClientsList';
import ClientForm from './pages/ClientForm';
import UsersList from './pages/UsersList';
import UserForm from './pages/UserForm';
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
                <Route path="projects/details/:projectId" element={<ProjectDetails />} />
                <Route path="projects/edit/:projectId" element={<ProjectEdit />} />
                <Route path="projects/:projectId" element={<ProjectDetails />} />
                <Route path="projects/:projectId/timeline" element={<ProjectTimeline />} />
                <Route path="tasks" element={<MyTasks />} />
                <Route path="tasks/create" element={<TaskForm />} />
                <Route path="tasks/:taskId/edit" element={<TaskForm />} />
                <Route path="kanban" element={<KanbanBoard />} />
                <Route path="teams" element={<Teams />} />
                <Route path="teams/create" element={<MemberCreate />} />
                <Route path="teams/view/:id" element={<MemberView />} />
                <Route path="teams/edit/:id" element={<MemberEdit />} />
                <Route path="reports" element={<Reports />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="clients" element={<ClientsList />} />
                <Route path="clients/create" element={<ClientForm />} />
                <Route path="clients/edit/:id" element={<ClientForm />} />
                <Route path="clients/:id" element={<ClientForm />} /> {/* Redirecionando view para form por enquanto, ou criar view separada */}
                <Route path="users" element={<UsersList />} />
                <Route path="users/create" element={<UserForm />} />
                <Route path="users/edit/:id" element={<UserForm />} />
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
                    <TasksProvider>
                        <AppRouter />
                    </TasksProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
