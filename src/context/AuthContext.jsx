import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const AuthContext = createContext();

// Inactivity timeout: 15 minutes in milliseconds
// Outras opções:
// 5 minutos:  5 * 60 * 1000
// 10 minutos: 10 * 60 * 1000
// 30 minutos: 30 * 60 * 1000
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = sessionStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const inactivityTimerRef = useRef(null);

    // Check if user is still valid on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = sessionStorage.getItem('token');
            const savedUser = sessionStorage.getItem('user');

            // If we have both token and user, validate the token
            if (token && savedUser) {
                try {
                    const currentUser = await authAPI.getCurrentUser();
                    setUser(currentUser);
                    sessionStorage.setItem('user', JSON.stringify(currentUser));
                } catch (err) {
                    // Token invalid or expired, clear storage
                    console.log('Auth check failed:', err.message);
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('user');
                    setUser(null);
                    // Don't navigate here - let the ProtectedRoute handle it
                }
            } else {
                // No token or user, clear state
                setUser(null);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        setError(null);
        setLoading(true);
        try {
            const data = await authAPI.login(email, password);
            setUser(data.user);
            navigate('/');
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = useCallback(async () => {
        try {
            await authAPI.logout();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setUser(null);
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            // Clear inactivity timer
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
            navigate('/login');
        }
    }, [navigate]);

    // Auto-logout on inactivity
    const resetInactivityTimer = useCallback(() => {
        // Clear existing timer
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }

        // Set new timer
        inactivityTimerRef.current = setTimeout(() => {
            console.log('Auto-logout devido à inatividade (15 minutos)');
            logout();
        }, INACTIVITY_TIMEOUT);
    }, [logout]);

    // Setup inactivity detection
    useEffect(() => {
        // Only setup if user is logged in
        if (!user) return;

        // Activity events to monitor (works on desktop and mobile)
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        // Reset timer on any activity
        const handleActivity = () => {
            resetInactivityTimer();
        };

        // Add event listeners
        events.forEach(event => {
            document.addEventListener(event, handleActivity);
        });

        // Start initial timer
        resetInactivityTimer();

        // Cleanup
        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleActivity);
            });
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
        };
    }, [user, resetInactivityTimer]);

    const register = async (userData) => {
        setError(null);
        setLoading(true);
        try {
            const data = await authAPI.register(userData);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (userData) => {
        try {
            // In a real app, this would call an API to update the user
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            sessionStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const isAuthenticated = () => {
        return !!user && !!sessionStorage.getItem('token');
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            login,
            logout,
            register,
            updateProfile,
            isAuthenticated,
            clearError
        }}>
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
