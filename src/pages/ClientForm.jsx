import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clientsAPI } from '../services/api';

export default function ClientForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        name: '',
        user: '', // This will map to contact person or company name depending on business logic
        email: '',
        company: '',
        phone: '',
        role: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditing) {
            loadClient();
        }
    }, [id]);

    const loadClient = async () => {
        try {
            setLoading(true);
            const data = await clientsAPI.get(id);
            // Adapt data structure if necessary
            setFormData({
                name: data.name || '',
                email: data.email || '',
                company: data.company || '',
                phone: data.phone || '',
                role: data.role || '' // Example of additional field
            });
        } catch (err) {
            console.error('Error loading client:', err);
            setError('Erro ao carregar dados do cliente.');
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
                await clientsAPI.update(id, formData);
            } else {
                await clientsAPI.create(formData);
            }
            navigate('/clients');
        } catch (err) {
            console.error('Error saving client:', err);
            setError('Erro ao salvar cliente. Verifique os dados e tente novamente.');
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
                        {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
                    </h1>
                    <p className="text-base text-slate-500 dark:text-text-secondary">
                        {isEditing ? 'Atualize as informações do cliente.' : 'Cadastre um novo cliente no sistema.'}
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
                                    Nome do Contato <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="h-10 px-3 rounded-lg border border-gray-300 dark:border-border-dark bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Ex: João Silva"
                                />
                            </div>

                            {/* Empresa */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                                    Empresa <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    required
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="h-10 px-3 rounded-lg border border-gray-300 dark:border-border-dark bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Ex: Acme Corp"
                                />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="h-10 px-3 rounded-lg border border-gray-300 dark:border-border-dark bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="contato@empresa.com"
                                />
                            </div>

                            {/* Telefone */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                                    Telefone
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="h-10 px-3 rounded-lg border border-gray-300 dark:border-border-dark bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-gray-200 dark:border-border-dark">
                            <button
                                type="button"
                                onClick={() => navigate('/clients')}
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
                                    <span>{isEditing ? 'Salvar Alterações' : 'Criar Cliente'}</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
