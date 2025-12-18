import { useState } from 'react';

const Settings = () => {
    const [companyName, setCompanyName] = useState('Acme Agency');
    const [logoUrl, setLogoUrl] = useState('https://cdn.acme.com/logo.png');
    const [timezone, setTimezone] = useState('UTC-3');
    const [language, setLanguage] = useState('pt-BR');

    const handleSave = () => {
        // TODO: Implement save functionality
        console.log('Salvando configurações...', {
            companyName,
            logoUrl,
            timezone,
            language
        });
    };

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
                    {/* Page Heading & Action */}
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
                                Configurações do Sistema
                            </h1>
                            <p className="text-text-secondary text-base">
                                Gerencie configurações globais, permissões e integrações.
                            </p>
                        </div>
                        <button
                            onClick={handleSave}
                            className="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined text-[20px]">save</span>
                            <span>Salvar Alterações</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 px-6 py-8">
                <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-10">
                    {/* Section: Geral */}
                    <section className="flex flex-col gap-4">
                        <div className="border-b border-border-dark pb-2">
                            <h2 className="text-slate-900 dark:text-white text-xl font-bold">Geral</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Card 1: Identidade */}
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
                                        <div className="flex gap-2">
                                            <input
                                                className="form-input w-full rounded-lg border-slate-300 dark:border-border-dark bg-slate-50 dark:bg-[#111a22] text-slate-900 dark:text-white placeholder:text-text-secondary focus:border-primary focus:ring-1 focus:ring-primary h-11 px-3"
                                                type="text"
                                                value={logoUrl}
                                                onChange={(e) => setLogoUrl(e.target.value)}
                                            />
                                            <button className="h-11 px-4 rounded-lg bg-surface-dark-lighter hover:bg-border-dark text-white border border-border-dark transition-colors flex items-center justify-center">
                                                <span className="material-symbols-outlined">upload</span>
                                            </button>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Card 2: Localização */}
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
                    </section>

                    {/* Section: Usuários & RBAC */}
                    <section className="flex flex-col gap-4">
                        <div className="border-b border-border-dark pb-2 flex justify-between items-end">
                            <h2 className="text-slate-900 dark:text-white text-xl font-bold">
                                Usuários &amp; Permissões (RBAC)
                            </h2>
                            <button className="text-primary text-sm font-semibold hover:underline">
                                Gerenciar Funções
                            </button>
                        </div>
                        <div className="overflow-hidden bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-border-dark bg-slate-50 dark:bg-[#111a22]">
                                            <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                                                Permissão / Função
                                            </th>
                                            <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider text-white bg-primary/10 w-32">
                                                Admin
                                            </th>
                                            <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider text-text-secondary w-32">
                                                Gerente
                                            </th>
                                            <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider text-text-secondary w-32">
                                                Dev
                                            </th>
                                            <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider text-text-secondary w-32">
                                                Cliente
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
                                            <td className="p-4 text-center text-text-secondary opacity-30">
                                                <span className="material-symbols-outlined">cancel</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-medium">Visualizar Orçamento</td>
                                            <td className="p-4 text-center text-primary">
                                                <span className="material-symbols-outlined">check_circle</span>
                                            </td>
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
                                            <td className="p-4 font-medium">Deletar Tarefas</td>
                                            <td className="p-4 text-center text-primary">
                                                <span className="material-symbols-outlined">check_circle</span>
                                            </td>
                                            <td className="p-4 text-center text-text-secondary opacity-30">
                                                <span className="material-symbols-outlined">cancel</span>
                                            </td>
                                            <td className="p-4 text-center text-text-secondary opacity-30">
                                                <span className="material-symbols-outlined">cancel</span>
                                            </td>
                                            <td className="p-4 text-center text-text-secondary opacity-30">
                                                <span className="material-symbols-outlined">cancel</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-medium">Comentar em Tarefas</td>
                                            <td className="p-4 text-center text-primary">
                                                <span className="material-symbols-outlined">check_circle</span>
                                            </td>
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
                    </section>

                    {/* Section: Integrações */}
                    <section className="flex flex-col gap-4">
                        <div className="border-b border-border-dark pb-2">
                            <h2 className="text-slate-900 dark:text-white text-xl font-bold">Integrações</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Integration Card: GitHub */}
                            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-5 flex flex-col gap-4 shadow-sm relative group hover:border-primary/50 transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="bg-slate-100 dark:bg-white p-2 rounded-lg size-12 flex items-center justify-center">
                                        <img
                                            alt="GitHub Logo"
                                            className="size-8"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA426BxB5Cjf1WiDK7wqqdxeQUi3Al-n2B0GBE2FxmaoCbddRBU7_oGgnQReBnXpC0HxReWsY4D_PSXm6iUxj1p6kJfub1loPv87Ci92XxwXxiwnHabZd_5CIYypgT0raYDId7mXZgneDvsSBeBpOHfdjNo1LWsinWHezPVEKCJ_n3KOXfJnnj224d1jSWna9QflK5iym7w2-o9GaBggfUadODkW-WQf9OoY3TxPIB4H8OChtYwGsdSIH1r7Iv8h8OogSa5BTVMbRQ"
                                        />
                                    </div>
                                    <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">
                                        Conectado
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-slate-900 dark:text-white font-bold text-lg">GitHub</h3>
                                    <p className="text-text-secondary text-sm mt-1">
                                        Sincronize commits e pull requests com tarefas.
                                    </p>
                                </div>
                                <div className="mt-auto pt-2">
                                    <button className="w-full py-2 px-3 rounded-lg border border-border-dark text-slate-700 dark:text-white hover:bg-surface-dark-lighter transition-colors text-sm font-medium">
                                        Configurar
                                    </button>
                                </div>
                            </div>

                            {/* Integration Card: Slack */}
                            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-5 flex flex-col gap-4 shadow-sm relative group hover:border-primary/50 transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="bg-slate-100 dark:bg-white p-2 rounded-lg size-12 flex items-center justify-center">
                                        <img
                                            alt="Slack Logo"
                                            className="size-8"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ_YneE-uN2aRoHv34z4h2hwcsL_2DWXTfA0cxlP2NnPjV8GFVsuRdXnbsQZocJwSHLPmKuIUuBBy9Nql1c0_xRMkmBYe7SBH9EQAbEtGZ71WDLd5TPpcFQs2_SBxTgGFh9jQ1haeW78vzhOorWbduy55cVS0WpVmCcRiKHsgS_VGIEQrgZM-Ywb2zcF_-4gh2XA-TfBLaI4ljEZynCYWx4o4qFSCmB5VuepHP9UlCdaQmvAjx-GO_uAyGNI6nnRltvUG8g4ybf94"
                                        />
                                    </div>
                                    <span className="px-2 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20">
                                        Desconectado
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-slate-900 dark:text-white font-bold text-lg">Slack</h3>
                                    <p className="text-text-secondary text-sm mt-1">
                                        Notificações em tempo real nos canais da equipe.
                                    </p>
                                </div>
                                <div className="mt-auto pt-2">
                                    <button className="w-full py-2 px-3 rounded-lg bg-primary hover:bg-blue-600 text-white transition-colors text-sm font-medium shadow-md shadow-blue-500/10">
                                        Conectar
                                    </button>
                                </div>
                            </div>

                            {/* Integration Card: Discord */}
                            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-5 flex flex-col gap-4 shadow-sm relative group hover:border-primary/50 transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="bg-[#5865F2] p-2 rounded-lg size-12 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white text-3xl">chat</span>
                                    </div>
                                    <span className="px-2 py-1 rounded-full bg-slate-500/10 text-text-secondary text-xs font-bold border border-slate-500/20">
                                        Opcional
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-slate-900 dark:text-white font-bold text-lg">Discord</h3>
                                    <p className="text-text-secondary text-sm mt-1">
                                        Integração de comunidade e suporte via Webhooks.
                                    </p>
                                </div>
                                <div className="mt-auto pt-2">
                                    <button className="w-full py-2 px-3 rounded-lg bg-primary hover:bg-blue-600 text-white transition-colors text-sm font-medium shadow-md shadow-blue-500/10">
                                        Conectar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: SLAs & Automation */}
                    <section className="flex flex-col gap-4 pb-12">
                        <div className="border-b border-border-dark pb-2">
                            <h2 className="text-slate-900 dark:text-white text-xl font-bold">
                                SLAs &amp; Automação
                            </h2>
                        </div>
                        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-6 shadow-sm">
                            <div className="flex flex-col gap-6">
                                {/* SLA Item: Prioridade Crítica */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-border-dark">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                                            <span className="material-symbols-outlined">priority_high</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="text-slate-900 dark:text-white font-semibold">
                                                Prioridade Crítica
                                            </h4>
                                            <p className="text-text-secondary text-sm">
                                                Tempo de resposta alvo para bugs de produção.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <div className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-slate-300 dark:border-border-dark rounded-md px-3 py-1.5">
                                            <span className="text-slate-900 dark:text-white text-sm font-bold">1h</span>
                                            <span className="text-text-secondary text-xs">Resposta</span>
                                        </div>
                                        <div className="h-px w-4 bg-border-dark"></div>
                                        <div className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-slate-300 dark:border-border-dark rounded-md px-3 py-1.5">
                                            <span className="text-slate-900 dark:text-white text-sm font-bold">4h</span>
                                            <span className="text-text-secondary text-xs">Resolução</span>
                                        </div>
                                        <button className="text-text-secondary hover:text-white p-1">
                                            <span className="material-symbols-outlined">edit</span>
                                        </button>
                                    </div>
                                </div>

                                {/* SLA Item: Prioridade Alta */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-border-dark">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                                            <span className="material-symbols-outlined">warning</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="text-slate-900 dark:text-white font-semibold">
                                                Prioridade Alta
                                            </h4>
                                            <p className="text-text-secondary text-sm">
                                                Problemas funcionais que não bloqueiam todo o sistema.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <div className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-slate-300 dark:border-border-dark rounded-md px-3 py-1.5">
                                            <span className="text-slate-900 dark:text-white text-sm font-bold">4h</span>
                                            <span className="text-text-secondary text-xs">Resposta</span>
                                        </div>
                                        <div className="h-px w-4 bg-border-dark"></div>
                                        <div className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-slate-300 dark:border-border-dark rounded-md px-3 py-1.5">
                                            <span className="text-slate-900 dark:text-white text-sm font-bold">24h</span>
                                            <span className="text-text-secondary text-xs">Resolução</span>
                                        </div>
                                        <button className="text-text-secondary hover:text-white p-1">
                                            <span className="material-symbols-outlined">edit</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Add SLA Button */}
                                <button className="flex items-center justify-center gap-2 w-full py-3 border border-dashed border-border-dark rounded-lg text-text-secondary hover:text-primary hover:border-primary hover:bg-primary/5 transition-all">
                                    <span className="material-symbols-outlined">add</span>
                                    <span className="font-medium">Adicionar Regra de SLA</span>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Settings;
