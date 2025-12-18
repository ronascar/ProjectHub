import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });
    const navigate = useNavigate();

    const login = (email, password) => {
        // Mock login - in production, this would call an API
        const mockUser = {
            id: 1,
            name: 'Alex Morgan',
            email: email,
            role: 'Senior PM',
            avatar: 'https://i.pravatar.cc/150?img=10'
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        navigate('/');
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
