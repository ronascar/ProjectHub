import { useState, useEffect } from 'react';
import { projectsAPI, usersAPI } from '../services/api';

export default function TeamManagementModal({ project, onClose, onUpdate }) {
    const [members, setMembers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedRole, setSelectedRole] = useState('DEVELOPER');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, [project]);

    const loadData = async () => {
        try {
            setLoading(true);
            // Load project members
            const projectData = await projectsAPI.get(project.id);
            setMembers(projectData.members || []);

            // Load all users
            const users = await usersAPI.list();
            
            // Filter out users already in the project
            const memberIds = (projectData.members || []).map(m => m.user.id);
            const available = users.filter(u => !memberIds.includes(u.id));
            setAvailableUsers(available);
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async () => {
        if (!selectedUser) return;

        try {
            setLoading(true);
            setError(null);
            await projectsAPI.addMember(project.id, selectedUser, selectedRole);
            
            // Reload data
            await loadData();
            setSelectedUser('');
            setSelectedRole('DEVELOPER');
            
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Error adding member:', err);
            setError('Erro ao adicionar membro');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (userId) => {
        try {
            setLoading(true);
            setError(null);
            await projectsAPI.removeMember(project.id, userId);
            
            // Reload data
            await loadData();
            
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Error removing member:', err);
            setError('Erro ao remover membro');
        } finally {
            setLoading(false);
        }
    };

    const getRoleLabel = (role) => {
        const roles = {
            'LEAD': 'Líder',
            'DEVELOPER': 'Desenvolvedor',
            'DESIGNER': 'Designer',
            'QA': 'QA/Tester',
            'VIEWER': 'Visualizador'
        };
        return roles[role] || role;
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            'LEAD': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
            'DEVELOPER': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            'DESIGNER': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
            'QA': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            'VIEWER': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
        };
        return colors[role] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-border-dark">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gerenciar Equipe</h2>
                        <p className="text-sm text-gray-500 dark:text-text-secondary mt-1">{project.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-gray-500 dark:text-text-secondary">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Add Member Section */}
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-border-dark">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">
                            Adicionar Membro
                        </h3>
                        <div className="flex gap-3">
                            <select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                disabled={loading || availableUsers.length === 0}
                                className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary p-2.5 [&>option]:bg-white [&>option]:dark:bg-gray-800 [&>option]:text-slate-900 [&>option]:dark:text-white"
                            >
                                <option value="">Selecione um usuário</option>
                                {availableUsers.map(user => (
                                    <option key={user.id} value={user.id} className="bg-white dark:bg-gray-800 text-slate-900 dark:text-white">
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                disabled={loading}
                                className="w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary p-2.5 [&>option]:bg-white [&>option]:dark:bg-gray-800 [&>option]:text-slate-900 [&>option]:dark:text-white"
                            >
                                <option value="DEVELOPER" className="bg-white dark:bg-gray-800 text-slate-900 dark:text-white">Desenvolvedor</option>
                                <option value="LEAD" className="bg-white dark:bg-gray-800 text-slate-900 dark:text-white">Líder</option>
                                <option value="DESIGNER" className="bg-white dark:bg-gray-800 text-slate-900 dark:text-white">Designer</option>
                                <option value="QA" className="bg-white dark:bg-gray-800 text-slate-900 dark:text-white">QA/Tester</option>
                                <option value="VIEWER" className="bg-white dark:bg-gray-800 text-slate-900 dark:text-white">Visualizador</option>
                            </select>
                            <button
                                onClick={handleAddMember}
                                disabled={loading || !selectedUser}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                Adicionar
                            </button>
                        </div>
                        {availableUsers.length === 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Todos os usuários já estão no projeto
                            </p>
                        )}
                    </div>

                    {/* Members List */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">
                            Membros da Equipe ({members.length})
                        </h3>
                        {loading && members.length === 0 ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                            </div>
                        ) : members.length === 0 ? (
                            <div className="text-center py-8">
                                <span className="material-symbols-outlined text-gray-400 text-4xl">group_off</span>
                                <p className="text-gray-500 dark:text-gray-400 mt-2">Nenhum membro na equipe</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {members.map((member) => (
                                    <div
                                        key={member.user.id}
                                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-border-dark hover:border-primary dark:hover:border-primary transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            {member.user.avatar ? (
                                                <img
                                                    src={member.user.avatar}
                                                    alt={member.user.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                    <span className="text-primary font-semibold text-sm">
                                                        {member.user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                    {member.user.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {member.user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                                                {getRoleLabel(member.role)}
                                            </span>
                                            <button
                                                onClick={() => handleRemoveMember(member.user.id)}
                                                disabled={loading}
                                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                                title="Remover membro"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">person_remove</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-border-dark">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
