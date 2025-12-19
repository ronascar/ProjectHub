import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

export default function MemberView() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data - em produção viria do banco de dados
    const memberData = {
        fullName: 'Ricardo Alves da Silva',
        email: 'ricardo.silva@techco.com',
        cpf: '123.456.789-00',
        phone: '(11) 98765-4321',
        birthDate: '15/05/1990',
        role: 'Desenvolvedor Full-stack',
        isActive: true,
        department: 'Engineering',
        projects: 12,
        tasks: 34,
        cep: '01310-100',
        street: 'Av. Paulista',
        number: '1578',
        complement: 'Apto 45 - Bloco B',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        avatar: 'https://i.pravatar.cc/200?u=ricardo'
    };

    const recentTasks = [
        { id: 1, name: 'Implementar autenticação OAuth2', project: 'API Core V2', status: 'Em Progresso', dueDate: '25 Out, 2023' },
        { id: 2, name: 'Refatorar componente de Dashboard', project: 'Frontend Web', status: 'Concluído', dueDate: '20 Out, 2023' },
        { id: 3, name: 'Revisar PR #402 - Database Schema', project: 'Database Migration', status: 'Revisão', dueDate: 'Hoje' }
    ];

    const getStatusBadge = (status) => {
        const styles = {
            'Em Progresso': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
            'Concluído': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800',
            'Revisão': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800'
        };
        return styles[status] || styles['Em Progresso'];
    };

    return (
        <div className="flex flex-1 justify-center py-8 px-4 md:px-8 lg:px-12 bg-background-light dark:bg-background-dark min-h-full">
            <div className="flex flex-col max-w-[1200px] flex-1 gap-8">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap items-center gap-2 px-1">
                    <Link to="/" className="text-slate-500 dark:text-text-secondary hover:text-primary transition-colors text-sm font-medium">Área de Trabalho</Link>
                    <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">/</span>
                    <Link to="/teams" className="text-slate-500 dark:text-text-secondary hover:text-primary transition-colors text-sm font-medium">Gerenciamento de Equipe</Link>
                    <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">/</span>
                    <span className="text-slate-900 dark:text-white text-sm font-medium">Visualizar Membro</span>
                </div>

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-200 dark:border-[#233648]">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight">Perfil do Membro</h1>
                        <p className="text-slate-500 dark:text-text-secondary text-base max-w-2xl">
                            Visualize as informações completas deste colaborador.
                        </p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                        <button
                            onClick={() => navigate('/teams')}
                            className="flex items-center justify-center rounded-lg h-10 px-5 border border-slate-300 dark:border-slate-600 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-dark transition-colors text-sm font-bold"
                        >
                            Voltar
                        </button>
                        <button
                            onClick={() => navigate(`/teams/edit/${id}`)}
                            className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all text-sm font-bold gap-2"
                        >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                            <span>Editar</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar: Profile Card */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-[#233648] p-6 flex flex-col items-center text-center shadow-sm">
                            <div className="size-32 rounded-full p-1 border-2 border-slate-300 dark:border-slate-600">
                                <div className="w-full h-full rounded-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${memberData.avatar}')` }}></div>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{memberData.fullName}</h3>
                                <span className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border border-blue-200 dark:border-blue-800/50">
                                    {memberData.role}
                                </span>
                                <div className="mt-3 flex items-center justify-center gap-2">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${memberData.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'}`}>
                                        {memberData.isActive ? '● Ativo' : '● Inativo'}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 w-full mt-8 border-t border-slate-200 dark:border-slate-700/50 pt-6">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{memberData.projects}</span>
                                    <span className="text-xs font-medium text-slate-500 dark:text-text-secondary uppercase tracking-wider">Projetos</span>
                                </div>
                                <div className="flex flex-col border-l border-slate-200 dark:border-slate-700/50">
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{memberData.tasks}</span>
                                    <span className="text-xs font-medium text-slate-500 dark:text-text-secondary uppercase tracking-wider">Tarefas</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Info Panel */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-[#233648] p-6 shadow-sm">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Informações Rápidas</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-slate-400 text-[20px]">badge</span>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500 dark:text-text-secondary">Departamento</span>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">{memberData.department}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-slate-400 text-[20px]">email</span>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500 dark:text-text-secondary">E-mail</span>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white break-all">{memberData.email}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-slate-400 text-[20px]">phone</span>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500 dark:text-text-secondary">Telefone</span>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">{memberData.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {/* Personal Data */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-[#233648] p-6 md:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700/50">
                                <span className="material-symbols-outlined text-primary">person</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dados Pessoais</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">Nome Completo</label>
                                    <p className="text-sm text-slate-900 dark:text-white font-medium">{memberData.fullName}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">E-mail Corporativo</label>
                                    <p className="text-sm text-slate-900 dark:text-white font-medium">{memberData.email}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">CPF</label>
                                    <p className="text-sm text-slate-900 dark:text-white font-medium">{memberData.cpf}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">Telefone / Celular</label>
                                    <p className="text-sm text-slate-900 dark:text-white font-medium">{memberData.phone}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">Data de Nascimento</label>
                                    <p className="text-sm text-slate-900 dark:text-white font-medium">{memberData.birthDate}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">Função</label>
                                    <p className="text-sm text-slate-900 dark:text-white font-medium">{memberData.role}</p>
                                </div>
                            </div>
                        </div>

                        {/* Address Data */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-[#233648] p-6 md:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700/50">
                                <span className="material-symbols-outlined text-primary">location_on</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Endereço</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">CEP</label>
                                    <p className="text-sm text-slate-900 dark:text-white font-medium">{memberData.cep}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">Logradouro</label>
                                    <p className="text-sm text-slate-900 dark:text-white font-medium">{memberData.street}, {memberData.number}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">Complemento</label>
                                    <p className="text-sm text-slate-900 dark:text-white font-medium">{memberData.complement}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">Bairro</label>
                                    <p className="text-sm text-slate-900 dark:text-white font-medium">{memberData.neighborhood}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">Cidade</label>
                                    <p className="text-sm text-slate-900 dark:text-white font-medium">{memberData.city}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">Estado</label>
                                    <p className="text-sm text-slate-900 dark:text-white font-medium">{memberData.state}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Tasks */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-[#233648] p-6 md:p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">assignment</span>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tarefas Recentes</h3>
                                </div>
                                <button className="text-primary hover:text-blue-400 text-sm font-bold flex items-center gap-1">
                                    Ver todas
                                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-slate-500 dark:text-text-secondary">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400">
                                        <tr>
                                            <th className="px-6 py-3 rounded-l-lg">Tarefa</th>
                                            <th className="px-6 py-3">Projeto</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3 rounded-r-lg">Prazo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTasks.map(task => (
                                            <tr key={task.id} className="bg-white dark:bg-transparent border-b dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                                <th className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                                    {task.name}
                                                </th>
                                                <td className="px-6 py-4">{task.project}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded border ${getStatusBadge(task.status)}`}>
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">{task.dueDate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
