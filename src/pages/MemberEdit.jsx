import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { usersAPI } from '../services/api';
import { uploadAvatar, deleteAvatar } from '../services/upload';

export default function MemberEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const numberInputRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [currentAvatar, setCurrentAvatar] = useState(null);
    const fileInputRef = useRef(null);

    // Form data
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        cpf: '',
        phone: '',
        birthDate: '',
        role: 'Desenvolvedor Full-stack',
        isActive: true,
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: 'SP'
    });

    const [loadingCep, setLoadingCep] = useState(false);

    // Load user data
    useEffect(() => {
        const loadUser = async () => {
            try {
                setLoading(true);
                const user = await usersAPI.get(id);
                
                // Mapear role da API para o formato do formulário
                const roleMap = {
                    'ADMIN': 'Administrador',
                    'MANAGER': 'Gerente de Projetos',
                    'MEMBER': user.department || 'Desenvolvedor Full-stack'
                };
                
                setFormData({
                    fullName: user.name || '',
                    email: user.email || '',
                    cpf: '',
                    phone: user.phone || '',
                    birthDate: '',
                    role: roleMap[user.role] || 'Desenvolvedor Full-stack',
                    isActive: user.isActive !== false,
                    cep: '',
                    street: '',
                    number: '',
                    complement: '',
                    neighborhood: '',
                    city: '',
                    state: 'SP'
                });
                
                setCurrentAvatar(user.avatar);
                setAvatarPreview(user.avatar);
                setError(null);
            } catch (err) {
                console.error('Erro ao carregar usuário:', err);
                setError('Erro ao carregar dados do usuário');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadUser();
        }
    }, [id]);

    // Máscaras
    const maskCPF = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const maskPhone = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    };

    const maskCEP = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{3})\d+?$/, '$1');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === 'checkbox' ? checked : value;

        // Aplicar máscaras
        if (name === 'cpf') newValue = maskCPF(value);
        if (name === 'phone') newValue = maskPhone(value);
        if (name === 'cep') newValue = maskCEP(value);

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleCepBlur = async () => {
        const cep = formData.cep.replace(/\D/g, '');

        if (cep.length === 8) {
            setLoadingCep(true);
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        street: data.logradouro || '',
                        neighborhood: data.bairro || '',
                        city: data.localidade || '',
                        state: data.uf || ''
                    }));

                    // Foca no campo número após buscar o CEP
                    setTimeout(() => {
                        numberInputRef.current?.focus();
                    }, 100);
                } else {
                    alert('CEP não encontrado!');
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
                alert('Erro ao buscar CEP. Tente novamente.');
            } finally {
                setLoadingCep(false);
            }
        }
    };

    const handleSave = async () => {
        if (!formData.fullName || !formData.email) {
            alert('Nome e e-mail são obrigatórios');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            // Mapear role para o formato da API
            const roleMap = {
                'Administrador': 'ADMIN',
                'Gerente de Projetos': 'MANAGER',
                'Desenvolvedor Full-stack': 'MEMBER',
                'Designer UI/UX': 'MEMBER',
                'QA Tester': 'MEMBER'
            };

            let avatarUrl = currentAvatar;

            // Upload novo avatar se houver arquivo
            if (avatarFile) {
                try {
                    // Deletar avatar antigo se existir
                    if (currentAvatar) {
                        await deleteAvatar(currentAvatar).catch(err => 
                            console.warn('Não foi possível deletar avatar antigo:', err)
                        );
                    }
                    
                    // Upload novo avatar
                    avatarUrl = await uploadAvatar(avatarFile, id);
                } catch (uploadError) {
                    console.error('Erro ao fazer upload do avatar:', uploadError);
                    alert('Aviso: Não foi possível fazer upload da nova imagem. As outras alterações serão salvas.');
                }
            }

            const userData = {
                name: formData.fullName,
                role: roleMap[formData.role] || 'MEMBER',
                department: formData.role,
                phone: formData.phone || null,
                isActive: formData.isActive,
                avatar: avatarUrl
            };

            await usersAPI.update(id, userData);
            console.log('Usuário atualizado com sucesso');
            navigate('/teams');
        } catch (err) {
            console.error('Erro ao atualizar usuário:', err);
            setError(err.message || 'Erro ao atualizar usuário. Verifique suas permissões.');
            alert(err.message || 'Erro ao atualizar usuário');
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de arquivo
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecione apenas arquivos de imagem (JPG, PNG, GIF)');
                return;
            }

            // Validar tamanho (máx 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('A imagem deve ter no máximo 5MB');
                return;
            }

            setAvatarFile(file);

            // Criar preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const removeAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(currentAvatar);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCancel = () => {
        navigate('/teams');
    };

    return (
        <div className="flex flex-1 justify-center py-8 px-4 md:px-8 lg:px-12 bg-background-light dark:bg-background-dark min-h-full">
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-3">
                        <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                        <p className="text-slate-500 dark:text-slate-400">Carregando dados do membro...</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col max-w-[1200px] flex-1 gap-8">
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-center gap-2">
                            <span className="material-symbols-outlined">error</span>
                            <span>{error}</span>
                        </div>
                    )}
                    
                    {/* Breadcrumbs */}
                    <div className="flex flex-wrap items-center gap-2 px-1">
                    <Link to="/" className="text-slate-500 dark:text-text-secondary hover:text-primary transition-colors text-sm font-medium">Área de Trabalho</Link>
                    <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">/</span>
                    <Link to="/teams" className="text-slate-500 dark:text-text-secondary hover:text-primary transition-colors text-sm font-medium">Gerenciamento de Equipe</Link>
                    <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">/</span>
                    <span className="text-slate-900 dark:text-white text-sm font-medium">Editar Membro</span>
                </div>

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-200 dark:border-[#233648]">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight">Editar Membro</h1>
                        <p className="text-slate-500 dark:text-text-secondary text-base max-w-2xl">
                            Gerencie os dados pessoais, informações de contato, endereço e permissões de função para este colaborador.
                        </p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                        <button
                            onClick={handleCancel}
                            className="flex items-center justify-center rounded-lg h-10 px-5 border border-slate-300 dark:border-slate-600 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-dark transition-colors text-sm font-bold"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all text-sm font-bold gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                                    <span>Salvando...</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[20px]">save</span>
                                    <span>Salvar Alterações</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar: Profile Card */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-[#233648] p-6 flex flex-col items-center text-center shadow-sm">
                            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                <div className="size-32 rounded-full p-1 border-2 border-dashed border-slate-300 dark:border-slate-600 group-hover:border-primary transition-colors">
                                    {avatarPreview ? (
                                        <div className="w-full h-full rounded-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${avatarPreview}')` }}></div>
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-4xl text-slate-400">person</span>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-[20px] block">edit</span>
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                            {avatarFile && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeAvatar(); }}
                                    className="mt-3 text-xs text-red-600 dark:text-red-400 hover:underline"
                                >
                                    Remover nova foto
                                </button>
                            )}
                            <div className="mt-4">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{formData.fullName}</h3>
                                <span className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border border-blue-200 dark:border-blue-800/50">
                                    {formData.role}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 w-full mt-8 border-t border-slate-200 dark:border-slate-700/50 pt-6">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">12</span>
                                    <span className="text-xs font-medium text-slate-500 dark:text-text-secondary uppercase tracking-wider">Projetos</span>
                                </div>
                                <div className="flex flex-col border-l border-slate-200 dark:border-slate-700/50">
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">34</span>
                                    <span className="text-xs font-medium text-slate-500 dark:text-text-secondary uppercase tracking-wider">Tarefas</span>
                                </div>
                            </div>
                        </div>

                        {/* Role & Permissions Quick Panel */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-[#233648] p-6 shadow-sm">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Acesso & Função</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-text-secondary mb-1.5 uppercase">Função na Empresa</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
                                    >
                                        <option>Administrador</option>
                                        <option>Gerente de Projetos</option>
                                        <option>Desenvolvedor Full-stack</option>
                                        <option>Designer UI/UX</option>
                                        <option>QA Tester</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">Status da Conta</span>
                                        <span className="text-xs text-slate-500 dark:text-text-secondary">Permitir acesso ao sistema</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Forms */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {/* Personal Data */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-[#233648] p-6 md:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700/50">
                                <span className="material-symbols-outlined text-primary">person</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dados Pessoais</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">Nome Completo</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 transition-colors placeholder:text-slate-400"
                                        placeholder="Digite o nome completo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">E-mail Corporativo</label>
                                    <div className="flex items-center">
                                        <span className="inline-flex items-center px-3 h-[46px] text-sm text-slate-500 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600">
                                            <span className="material-symbols-outlined text-[18px]">email</span>
                                        </span>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="rounded-none rounded-r-lg bg-slate-50 border text-slate-900 focus:ring-primary focus:border-primary block flex-1 min-w-0 w-full text-sm border-slate-300 p-3 dark:bg-[#111a22] dark:border-slate-600 dark:placeholder-slate-400 dark:text-white h-[46px]"
                                            placeholder="nome@empresa.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">CPF</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        name="cpf"
                                        value={formData.cpf}
                                        onChange={handleChange}
                                        maxLength={14}
                                        className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 transition-colors"
                                        placeholder="000.000.000-00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">Telefone / Celular</label>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        maxLength={15}
                                        className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 transition-colors"
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">Data de Nascimento</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address Data */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-[#233648] p-6 md:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700/50">
                                <span className="material-symbols-outlined text-primary">location_on</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Endereço Completo</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">CEP</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            name="cep"
                                            value={formData.cep}
                                            onChange={handleChange}
                                            onBlur={handleCepBlur}
                                            maxLength={9}
                                            className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 pr-10 transition-colors"
                                            placeholder="00000-000"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                                            {loadingCep ? (
                                                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                                            ) : (
                                                <span className="material-symbols-outlined text-[18px]">search</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-4">
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">Logradouro</label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 transition-colors"
                                        placeholder="Rua, Avenida, etc."
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">Número</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        name="number"
                                        value={formData.number}
                                        onChange={handleChange}
                                        ref={numberInputRef}
                                        className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 transition-colors"
                                        placeholder="Nº"
                                    />
                                </div>
                                <div className="md:col-span-4">
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">Complemento</label>
                                    <input
                                        type="text"
                                        name="complement"
                                        value={formData.complement}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 transition-colors"
                                        placeholder="Apto, Bloco, etc."
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">Bairro</label>
                                    <input
                                        type="text"
                                        name="neighborhood"
                                        value={formData.neighborhood}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 transition-colors"
                                        placeholder="Bairro"
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">Cidade</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 transition-colors"
                                        placeholder="Cidade"
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-text-secondary uppercase mb-2">Estado</label>
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-3"
                                    >
                                        <option>AC</option>
                                        <option>AL</option>
                                        <option>AP</option>
                                        <option>AM</option>
                                        <option>BA</option>
                                        <option>CE</option>
                                        <option>DF</option>
                                        <option>ES</option>
                                        <option>GO</option>
                                        <option>MA</option>
                                        <option>MT</option>
                                        <option>MS</option>
                                        <option>MG</option>
                                        <option>PA</option>
                                        <option>PB</option>
                                        <option>PR</option>
                                        <option>PE</option>
                                        <option>PI</option>
                                        <option>RJ</option>
                                        <option>RN</option>
                                        <option>RS</option>
                                        <option>RO</option>
                                        <option>RR</option>
                                        <option>SC</option>
                                        <option>SP</option>
                                        <option>SE</option>
                                        <option>TO</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}
