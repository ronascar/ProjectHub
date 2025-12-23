import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Settings = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    // General Settings
    const [companyName, setCompanyName] = useState('NexusPM');
    const [logoUrl, setLogoUrl] = useState('');
    const [timezone, setTimezone] = useState('UTC-3');
    const [language, setLanguage] = useState('pt-BR');

    // User Profile
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');

    // Password Change
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Notifications
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [projectUpdates, setProjectUpdates] = useState(true);
    const [taskAssigned, setTaskAssigned] = useState(true);
    const [taskComments, setTaskComments] = useState(true);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setAvatar(user.avatar || '');
        }
    }, [user]);

    const handleSaveGeneral = async () => {
        setLoading(true);
        try {
            // Simulate save - in real app, this would call an API
            await new Promise(resolve => setTimeout(resolve, 500));
            alert('Configurações gerais salvas com sucesso!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Erro ao salvar configurações');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            // In a real app, you would update the user profile via API
            await new Promise(resolve => setTimeout(resolve, 500));
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Erro ao atualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            alert('As senhas não coincidem');
            return;
        }

        if (newPassword.length < 6) {
            alert('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        setLoading(true);
        try {
            await authAPI.changePassword(currentPassword, newPassword);
            alert('Senha alterada com sucesso!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Erro ao alterar senha. Verifique sua senha atual.');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'Geral', icon: 'settings' },
        { id: 'profile', label: 'Meu Perfil', icon: 'person' },
        { id: 'security', label: 'Segurança', icon: 'lock' },
        { id: 'notifications', label: 'Notificações', icon: 'notifications' },
        { id: 'integrations', label: 'Integrações', icon: 'extension' },
    ];

    if (user?.role === 'ADMIN') {
        tabs.push({ id: 'permissions', label: 'Permissões', icon: 'admin_panel_settings' });
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-background-dark scroll-smooth">
            {/* Header Section */}
            <header className="sticky top-0 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-border-dark px-6 py-4">
                <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-4">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm">
                        <a className="text-text-secondary hover:text-primary transition-colors font-medium" href="/">
                            Dashboard
                        </a>
                        <span className="text-text-secondary">/</span>
                        <span className="text-slate-900 dark:text-white font-medium">Configurações</span>
                    </div>
                    {/* Page Heading */}
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
                                Configurações
                            </h1>
                            <p className="text-text-secondary text-base">
                                Gerencie suas preferências e configurações do sistema.
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="border-b border-border-dark bg-white dark:bg-surface-dark px-6">
                <div className="max-w-[1200px] mx-auto w-full">
                    <div className="flex gap-1 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-primary text-primary font-semibold'
                                        : 'border-transparent text-text-secondary hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                                <span className="text-sm">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 px-6 py-8">
                <div className="max-w-[1200px] mx-auto w-full">
                    {/* Tab: Geral */}
                    {activeTab === 'general' && (
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Card: Identidade */}
                                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 shadow-sm">
                                    <h3 className="text-slate-900 dark:text-white text-lg font-semibold mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">business</span>
                                        Identidade
                                    </h3>
                                    <div className="flex flex-col gap-4">
                                        <label className="flex flex-col gap-1.5 w-full">
                                            <span className="text-slate-700 dark:text-white text-sm font-medium">
                                                Nome da Empresa
                                            </span>
                                            <input
                                                className="form-input w-full rounded-lg border-slate-300 dark:border-border-dark bg-slate-50 dark:bg-[#111a22] text-slate-900 dark:text-white placeholder:text-text-secondary focus:border-primary focus:ring-1 focus:ring-primary h-11 px-3"
                                                placeholder="Ex: Tech Solutions Ltd."
                                                type="text"
                                                value={companyName}
                                                onChange={(e) => setCompanyName(e.target.value)}
                                            />
                                        </label>
                                        <label className="flex flex-col gap-1.5 w-full">
                                            <span className="text-slate-700 dark:text-white text-sm font-medium">
                                                Logo URL
                                            </span>
                                            <input
                                                className="form-input w-full rounded-lg border-slate-300 dark:border-border-dark bg-slate-50 dark:bg-[#111a22] text-slate-900 dark:text-white placeholder:text-text-secondary focus:border-primary focus:ring-1 focus:ring-primary h-11 px-3"
                                                type="text"
                                                value={logoUrl}
                                                onChange={(e) => setLogoUrl(e.target.value)}
                                                placeholder="https://exemplo.com/logo.png"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Card: Localização */}
                                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 shadow-sm">
                                    <h3 className="text-slate-900 dark:text-white text-lg font-semibold mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">public</span>
                                        Localização
                                    </h3>
                                    <div className="flex flex-col gap-4">
                                        <label className="flex flex-col gap-1.5 w-full">
                                            <span className="text-slate-700 dark:text-white text-sm font-medium">
                                                Fuso Horário Padrão
                                            </span>
                                            <select
                                                className="form-select w-full rounded-lg border-slate-300 dark:border-border-dark bg-slate-50 dark:bg-[#111a22] text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-11 px-3"
                                                value={timezone}
                                                onChange={(e) => setTimezone(e.target.value)}
                                            >
                                                <option value="UTC-3">America/Sao_Paulo (UTC-3)</option>
                                                <option value="UTC">UTC</option>
                                                <option value="UTC-5">America/New_York (UTC-5)</option>
                                                <option value="UTC+1">Europe/London (UTC+1)</option>
                                            </select>
                                        </label>
                                        <label className="flex flex-col gap-1.5 w-full">
                                            <span className="text-slate-700 dark:text-white text-sm font-medium">
                                                Idioma do Sistema
                                            </span>
                                            <select
                                                className="form-select w-full rounded-lg border-slate-300 dark:border-border-dark bg-slate-50 dark:bg-[#111a22] text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-11 px-3"
                                                value={language}
                                                onChange={(e) => setLanguage(e.target.value)}
                                            >
                                                <option value="pt-BR">Português (Brasil)</option>
                                                <option value="en-US">English (US)</option>
                                                <option value="es">Español</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleSaveGeneral}
                                    disabled={loading}
                                    className="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[20px]">save</span>
                                    <span>{loading ? 'Salvando...' : 'Salvar Alterações'}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tab: Meu Perfil */}
                    {activeTab === 'profile' && (
                        <div className="flex flex-col gap-6">
                            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 shadow-sm">
                                <h3 className="text-slate-900 dark:text-white text-lg font-semibold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">person</span>
                                    Informações Pessoais
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="flex flex-col gap-1.5 w-full">
                                        <span className="text-slate-700 dark:text-white text-sm font-medium">
                                            Nome Completo
                                        </span>
                                        <input
                                            className="form-input w-full rounded-lg border-slate-300 dark:border-border-dark bg-slate-50 dark:bg-[#111a22] text-slate-900 dark:text-white placeholder:text-text-secondary focus:border-primary focus:ring-1 focus:ring-primary h-11 px-3"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </label>
                                    <label className="flex flex-col gap-1.5 w-full">
                                        <span className="text-slate-700 dark:text-white text-sm font-medium">
                                            E-mail
                                        </span>
                                        <input
                                            className="form-input w-full rounded-lg border-slate-300 dark:border-border-dark bg-slate-50 dark:bg-[#111a22] text-slate-900 dark:text-white placeholder:text-text-secondary focus:border-primary focus:ring-1 focus:ring-primary h-11 px-3"
                                            type="email"
                                            value={email}
                                            readOnly
                                            disabled
                                        />
                                    </label>
                                    <label className="flex flex-col gap-1.5 w-full md:col-span-2">
                                        <span className="text-slate-700 dark:text-white text-sm font-medium">
                                            Avatar URL (Opcional)
                                        </span>
                                        <input
                                            className="form-input w-full rounded-lg border-slate-300 dark:border-border-dark bg-slate-50 dark:bg-[#111a22] text-slate-900 dark:text-white placeholder:text-text-secondary focus:border-primary focus:ring-1 focus:ring-primary h-11 px-3"
                                            type="text"
                                            value={avatar}
                                            onChange={(e) => setAvatar(e.target.value)}
                                            placeholder="https://exemplo.com/avatar.jpg"
                                        />
                                    </label>
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg">
                                    <p className="text-sm text-blue-700 dark:text-blue-400">
                                        <strong>Função:</strong> {user?.role?.toUpperCase() || 'USER'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={loading}
                                    className="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[20px]">save</span>
                                    <span>{loading ? 'Salvando...' : 'Salvar Perfil'}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tab: Segurança */}
                    {activeTab === 'security' && (
                        <div className="flex flex-col gap-6">
                            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 shadow-sm">
                                <h3 className="text-slate-900 dark:text-white text-lg font-semibold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">lock</span>
                                    Alterar Senha
                                </h3>
                                <div className="flex flex-col gap-4 max-w-md">
                                    <label className="flex flex-col gap-1.5 w-full">
                                        <span className="text-slate-700 dark:text-white text-sm font-medium">
                                            Senha Atual
                                        </span>
                                        <input
                                            className="form-input w-full rounded-lg border-slate-300 dark:border-border-dark bg-slate-50 dark:bg-[#111a22] text-slate-900 dark:text-white placeholder:text-text-secondary focus:border-primary focus:ring-1 focus:ring-primary h-11 px-3"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                    </label>
                                    <label className="flex flex-col gap-1.5 w-full">
                                        <span className="text-slate-700 dark:text-white text-sm font-medium">
                                            Nova Senha
                                        </span>
                                        <input
                                            className="form-input w-full rounded-lg border-slate-300 dark:border-border-dark bg-slate-50 dark:bg-[#111a22] text-slate-900 dark:text-white placeholder:text-text-secondary focus:border-primary focus:ring-1 focus:ring-primary h-11 px-3"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </label>
                                    <label className="flex flex-col gap-1.5 w-full">
                                        <span className="text-slate-700 dark:text-white text-sm font-medium">
                                            Confirmar Nova Senha
                                        </span>
                                        <input
                                            className="form-input w-full rounded-lg border-slate-300 dark:border-border-dark bg-slate-50 dark:bg-[#111a22] text-slate-900 dark:text-white placeholder:text-text-secondary focus:border-primary focus:ring-1 focus:ring-primary h-11 px-3"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </label>
                                    <button
                                        onClick={handleChangePassword}
                                        disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                                        className="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">key</span>
                                        <span>{loading ? 'Alterando...' : 'Alterar Senha'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Notificações */}
                    {activeTab === 'notifications' && (
                        <div className="flex flex-col gap-6">
                            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 shadow-sm">
                                <h3 className="text-slate-900 dark:text-white text-lg font-semibold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">notifications</span>
                                    Preferências de Notificação
                                </h3>
                                <div className="flex flex-col gap-4">
                                    <label className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#111a22] cursor-pointer">
                                        <div>
                                            <p className="text-slate-900 dark:text-white font-medium">Notificações por E-mail</p>
                                            <p className="text-sm text-text-secondary">Receber notificações gerais por e-mail</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={emailNotifications}
                                            onChange={(e) => setEmailNotifications(e.target.checked)}
                                            className="h-5 w-5 rounded text-primary focus:ring-primary"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#111a22] cursor-pointer">
                                        <div>
                                            <p className="text-slate-900 dark:text-white font-medium">Atualizações de Projeto</p>
                                            <p className="text-sm text-text-secondary">Notificar quando houver mudanças em projetos</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={projectUpdates}
                                            onChange={(e) => setProjectUpdates(e.target.checked)}
                                            className="h-5 w-5 rounded text-primary focus:ring-primary"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#111a22] cursor-pointer">
                                        <div>
                                            <p className="text-slate-900 dark:text-white font-medium">Tarefas Atribuídas</p>
                                            <p className="text-sm text-text-secondary">Notificar quando uma tarefa for atribuída a você</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={taskAssigned}
                                            onChange={(e) => setTaskAssigned(e.target.checked)}
                                            className="h-5 w-5 rounded text-primary focus:ring-primary"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#111a22] cursor-pointer">
                                        <div>
                                            <p className="text-slate-900 dark:text-white font-medium">Comentários em Tarefas</p>
                                            <p className="text-sm text-text-secondary">Notificar sobre novos comentários nas suas tarefas</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={taskComments}
                                            onChange={(e) => setTaskComments(e.target.checked)}
                                            className="h-5 w-5 rounded text-primary focus:ring-primary"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Integrações */}
                    {activeTab === 'integrations' && (
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* GitHub */}
                                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:border-primary/50 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-slate-100 dark:bg-white p-2 rounded-lg size-12 flex items-center justify-center">
                                            <svg className="size-8" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                            </svg>
                                        </div>
                                        <span className="px-2 py-1 rounded-full bg-slate-500/10 text-slate-500 text-xs font-bold border border-slate-500/20">
                                            Disponível
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-slate-900 dark:text-white font-bold text-lg">GitHub</h3>
                                        <p className="text-text-secondary text-sm mt-1">
                                            Sincronize commits e pull requests com tarefas.
                                        </p>
                                    </div>
                                    <button className="w-full py-2 px-3 rounded-lg bg-primary hover:bg-blue-600 text-white transition-colors text-sm font-medium shadow-md shadow-blue-500/10">
                                        Conectar
                                    </button>
                                </div>

                                {/* Slack */}
                                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:border-primary/50 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-[#4A154B] p-2 rounded-lg size-12 flex items-center justify-center">
                                            <svg className="size-8" viewBox="0 0 24 24" fill="white">
                                                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                                            </svg>
                                        </div>
                                        <span className="px-2 py-1 rounded-full bg-slate-500/10 text-slate-500 text-xs font-bold border border-slate-500/20">
                                            Disponível
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-slate-900 dark:text-white font-bold text-lg">Slack</h3>
                                        <p className="text-text-secondary text-sm mt-1">
                                            Notificações em tempo real nos canais da equipe.
                                        </p>
                                    </div>
                                    <button className="w-full py-2 px-3 rounded-lg bg-primary hover:bg-blue-600 text-white transition-colors text-sm font-medium shadow-md shadow-blue-500/10">
                                        Conectar
                                    </button>
                                </div>

                                {/* Discord */}
                                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:border-primary/50 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-[#5865F2] p-2 rounded-lg size-12 flex items-center justify-center">
                                            <svg className="size-8" viewBox="0 0 24 24" fill="white">
                                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                                            </svg>
                                        </div>
                                        <span className="px-2 py-1 rounded-full bg-slate-500/10 text-slate-500 text-xs font-bold border border-slate-500/20">
                                            Disponível
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-slate-900 dark:text-white font-bold text-lg">Discord</h3>
                                        <p className="text-text-secondary text-sm mt-1">
                                            Integração de comunidade e suporte via Webhooks.
                                        </p>
                                    </div>
                                    <button className="w-full py-2 px-3 rounded-lg bg-primary hover:bg-blue-600 text-white transition-colors text-sm font-medium shadow-md shadow-blue-500/10">
                                        Conectar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Permissões (Admin Only) */}
                    {activeTab === 'permissions' && user?.role === 'ADMIN' && (
                        <div className="flex flex-col gap-6">
                            <div className="overflow-hidden bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-sm">
                                <div className="p-4 border-b border-border-dark flex justify-between items-center">
                                    <h3 className="text-slate-900 dark:text-white text-lg font-semibold">
                                        Controle de Acesso (RBAC)
                                    </h3>
                                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                        Somente Leitura
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-border-dark bg-slate-50 dark:bg-[#111a22]">
                                                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                                                    Permissão / Função
                                                </th>
                                                <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider text-primary w-32">
                                                    Admin
                                                </th>
                                                <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider text-text-secondary w-32">
                                                    Manager
                                                </th>
                                                <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider text-text-secondary w-32">
                                                    User
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-border-dark text-slate-700 dark:text-slate-300 text-sm">
                                            <tr>
                                                <td className="p-4 font-medium">Criar Projetos</td>
                                                <td className="p-4 text-center text-primary">
                                                    <span className="material-symbols-outlined">check_circle</span>
                                                </td>
                                                <td className="p-4 text-center text-primary">
                                                    <span className="material-symbols-outlined">check_circle</span>
                                                </td>
                                                <td className="p-4 text-center text-text-secondary opacity-30">
                                                    <span className="material-symbols-outlined">cancel</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 font-medium">Gerenciar Usuários</td>
                                                <td className="p-4 text-center text-primary">
                                                    <span className="material-symbols-outlined">check_circle</span>
                                                </td>
                                                <td className="p-4 text-center text-text-secondary opacity-30">
                                                    <span className="material-symbols-outlined">cancel</span>
                                                </td>
                                                <td className="p-4 text-center text-text-secondary opacity-30">
                                                    <span className="material-symbols-outlined">cancel</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 font-medium">Deletar Projetos</td>
                                                <td className="p-4 text-center text-primary">
                                                    <span className="material-symbols-outlined">check_circle</span>
                                                </td>
                                                <td className="p-4 text-center text-text-secondary opacity-30">
                                                    <span className="material-symbols-outlined">cancel</span>
                                                </td>
                                                <td className="p-4 text-center text-text-secondary opacity-30">
                                                    <span className="material-symbols-outlined">cancel</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 font-medium">Ver Relatórios</td>
                                                <td className="p-4 text-center text-primary">
                                                    <span className="material-symbols-outlined">check_circle</span>
                                                </td>
                                                <td className="p-4 text-center text-primary">
                                                    <span className="material-symbols-outlined">check_circle</span>
                                                </td>
                                                <td className="p-4 text-center text-primary">
                                                    <span className="material-symbols-outlined">check_circle</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Settings;
