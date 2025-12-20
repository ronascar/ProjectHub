import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function UserForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const isEditing = !!id;

    // Check admin access
    useEffect(() => {
        if (currentUser && currentUser.role !== 'ADMIN') {
            navigate('/users');
        }
    }, [currentUser, navigate]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'MEMBER'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditing) {
            loadUser();
        }
    }, [id]);

    const loadUser = async () => {
        try {
            setLoading(true);
            const data = await usersAPI.get(id);
            setFormData({
                name: data.name || '',
                email: data.email || '',
                password: '', // Don't verify password on edit
                role: data.role || 'MEMBER'
            });
        } catch (err) {
            console.error('Error loading user:', err);
            setError('Erro ao carregar dados do usuário.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditing) {
                // Remove password if empty to avoid overwriting with empty string
                const dataToUpdate = { ...formData };
                if (!dataToUpdate.password) delete dataToUpdate.password;

                await usersAPI.update(id, dataToUpdate);
            } else {
                await usersAPI.create(formData);
            }
            navigate('/users');
        } catch (err) {
            console.error('Error saving user:', err);
            setError('Erro ao salvar usuário. Verifique se o email já existe.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                        {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
                    </h1>
                    <p className="text-base text-slate-500 dark:text-text-secondary">
                        {isEditing ? 'Gerencie as permissões e dados do usuário.' : 'Adicione um novo membro à equipe.'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-center gap-3 text-red-800 dark:text-red-200">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nome */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                                    Nome Completo <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="h-10 px-3 rounded-lg border border-gray-300 dark:border-border-dark bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Ex: Maria Souza"
                                />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                                    Email Profissional <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="h-10 px-3 rounded-lg border border-gray-300 dark:border-border-dark bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="maria@empresa.com"
                                />
                            </div>

                            {/* Função (Role) */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                                    Função no Sistema <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="h-10 px-3 rounded-lg border border-gray-300 dark:border-border-dark bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="MEMBER">Membro (Acesso Padrão)</option>
                                    <option value="MANAGER">Gerente (Gestão de Projetos)</option>
                                    <option value="ADMIN">Administrador (Acesso Total)</option>
                                </select>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Define as permissões de acesso do usuário.
                                </p>
                            </div>

                            {/* Senha */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                                    {isEditing ? 'Nova Senha (Opcional)' : 'Senha Inicial'} <span className={isEditing ? '' : 'text-red-500'}>*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    required={!isEditing}
                                    value={formData.password}
                                    onChange={handleChange}
                                    minLength={6}
                                    className="h-10 px-3 rounded-lg border border-gray-300 dark:border-border-dark bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder={isEditing ? 'Deixe em branco para manter a atual' : 'Mínimo 6 caracteres'}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-gray-200 dark:border-border-dark">
                            <button
                                type="button"
                                onClick={() => navigate('/users')}
                                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        <span>Salvando...</span>
                                    </>
                                ) : (
                                    <span>{isEditing ? 'Salvar Usuário' : 'Criar Usuário'}</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
