import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clientsAPI } from '../services/api';
import { useCustomConfirm } from '../components/CustomConfirm';

export default function ClientsList() {
    const navigate = useNavigate();
    const { showConfirm, ConfirmComponent } = useCustomConfirm();

    // State
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [openMenuId, setOpenMenuId] = useState(null);
    const itemsPerPage = 8;

    // Load clients from API
    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await clientsAPI.list();
            setClients(data);
        } catch (err) {
            console.error('Error loading clients:', err);
            setError('Erro ao carregar clientes. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Filter clients
    const filteredClients = useMemo(() => {
        return clients.filter(client => {
            const matchesSearch =
                client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (client.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (client.company || '').toLowerCase().includes(searchTerm.toLowerCase());

            return matchesSearch;
        });
    }, [clients, searchTerm]);

    // Pagination
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedClients = filteredClients.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // Pagination handlers
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    // Toggle action menu
    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    // Action handlers
    const handleViewClient = (id) => {
        navigate(`/clients/${id}`);
    };

    const handleEditClient = (id) => {
        navigate(`/clients/edit/${id}`);
    };

    const handleDeleteClient = async (client) => {
        showConfirm({
            title: 'Excluir Cliente',
            message: `Tem certeza que deseja excluir o cliente "${client.name}"? Esta ação não pode ser desfeita.`,
            type: 'danger',
            confirmText: 'Sim, Excluir',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                try {
                    await clientsAPI.delete(client.id);
                    await loadClients();
                    const newTotalPages = Math.ceil((clients.length - 1) / itemsPerPage);
                    if (currentPage > newTotalPages && newTotalPages > 0) {
                        setCurrentPage(newTotalPages);
                    }
                } catch (err) {
                    console.error('Error deleting client:', err);
                    setError('Erro ao excluir cliente. Tente novamente.');
                }
            }
        });
    };

    const formatPhone = (phone) => {
        if (!phone) return 'Sem telefone';
        // Format phone number (11) 98765-4321
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
        }
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
        }
        return phone;
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            <ConfirmComponent />
            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
                    {/* Page Heading & Primary Action */}
                    <div className="flex flex-wrap justify-between items-end gap-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                                Clientes
                            </h1>
                            <p className="text-base font-normal text-slate-500 dark:text-text-secondary">
                                Gerencie seus clientes e informações de contato.
                            </p>
                        </div>
                        <Link
                            to="/clients/create"
                            className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold leading-normal shadow-lg shadow-blue-500/20"
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span className="truncate">Novo Cliente</span>
                        </Link>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <span className="material-symbols-outlined text-red-400">error</span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search Bar */}
                    <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between bg-gray-100 dark:bg-surface-dark p-2 rounded-xl border border-gray-200 dark:border-border-dark">
                        <div className="flex w-full lg:max-w-md items-center rounded-lg bg-white dark:bg-[#233648] h-10 border border-transparent focus-within:border-primary transition-colors">
                            <div className="text-gray-400 dark:text-text-secondary pl-3 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </div>
                            <input
                                className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-text-secondary focus:ring-0 text-sm h-full px-3"
                                placeholder="Buscar por nome, empresa ou email..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>

                    {/* Clients Grid */}
                    <div className="w-full">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="text-center">
                                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                                    <p className="mt-4 text-gray-500 dark:text-gray-400">Carregando clientes...</p>
                                </div>
                            </div>
                        ) : filteredClients.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <span className="material-symbols-outlined text-gray-400 dark:text-gray-600" style={{ fontSize: '64px' }}>person_off</span>
                                <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Nenhum cliente encontrado</p>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {searchTerm
                                        ? 'Tente ajustar os filtros de busca'
                                        : 'Comece criando seu primeiro cliente'}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Grid of Client Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {paginatedClients.map((client) => (
                                        <div
                                            key={client.id}
                                            className="group relative bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-border-dark p-6 hover:shadow-lg dark:hover:shadow-black/20 transition-all"
                                        >
                                            {/* Options Menu */}
                                            <div className="absolute top-4 right-4">
                                                <button
                                                    onClick={() => toggleMenu(client.id)}
                                                    className="flex size-8 items-center justify-center rounded-full text-gray-400 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-[#324d67] hover:text-slate-900 dark:hover:text-white transition-colors"
                                                >
                                                    <span className="material-symbols-outlined">more_vert</span>
                                                </button>
                                                {openMenuId === client.id && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1d2832] border border-slate-200 dark:border-[#233648] rounded-lg shadow-xl py-1 z-50">
                                                        <button
                                                            onClick={() => { handleViewClient(client.id); setOpenMenuId(null); }}
                                                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#2c3b4a] flex items-center gap-2"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                            Visualizar
                                                        </button>
                                                        <button
                                                            onClick={() => { handleEditClient(client.id); setOpenMenuId(null); }}
                                                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#2c3b4a] flex items-center gap-2"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                                            Editar
                                                        </button>
                                                        <div className="border-t border-slate-100 dark:border-[#233648] my-1"></div>
                                                        <button
                                                            onClick={() => { handleDeleteClient(client); setOpenMenuId(null); }}
                                                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                                            Excluir
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Avatar & Name */}
                                            <div className="flex flex-col items-center text-center mb-4">
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold mb-3">
                                                    {getInitials(client.name)}
                                                </div>
                                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                                                    {client.name}
                                                </h3>
                                                {client.company && (
                                                    <p className="text-sm text-gray-500 dark:text-text-secondary">
                                                        {client.company}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Contact Info */}
                                            <div className="space-y-2 border-t border-gray-200 dark:border-border-dark pt-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="material-symbols-outlined text-[18px]">email</span>
                                                    <span className="truncate">{client.email || 'Sem email'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="material-symbols-outlined text-[18px]">phone</span>
                                                    <span>{formatPhone(client.phone)}</span>
                                                </div>
                                            </div>

                                            {/* View Button */}
                                            <button
                                                onClick={() => handleViewClient(client.id)}
                                                className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 dark:bg-[#233648] hover:bg-gray-200 dark:hover:bg-[#324d67] text-slate-900 dark:text-white rounded-lg transition-colors text-sm font-medium"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                                Ver Detalhes
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-[#192633] px-6 py-3 rounded-b-xl mt-6">
                                        {/* Mobile pagination */}
                                        <div className="flex flex-1 justify-between sm:hidden">
                                            <button
                                                onClick={goToPreviousPage}
                                                disabled={currentPage === 1}
                                                className={`relative inline-flex items-center rounded-md border border-gray-300 dark:border-border-dark bg-white dark:bg-[#233648] px-4 py-2 text-sm font-medium transition-colors ${currentPage === 1 ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-700 dark:text-text-secondary hover:bg-gray-50 dark:hover:bg-[#324d67]'}`}
                                            >
                                                Anterior
                                            </button>
                                            <span className="flex items-center text-sm text-gray-500 dark:text-text-secondary">
                                                {currentPage} / {totalPages}
                                            </span>
                                            <button
                                                onClick={goToNextPage}
                                                disabled={currentPage === totalPages}
                                                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-border-dark bg-white dark:bg-[#233648] px-4 py-2 text-sm font-medium transition-colors ${currentPage === totalPages ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-700 dark:text-text-secondary hover:bg-gray-50 dark:hover:bg-[#324d67]'}`}
                                            >
                                                Próximo
                                            </button>
                                        </div>
                                        {/* Desktop pagination */}
                                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-text-secondary">
                                                    Mostrando <span className="font-medium text-slate-900 dark:text-white">{filteredClients.length === 0 ? 0 : startIndex + 1}</span> a{' '}
                                                    <span className="font-medium text-slate-900 dark:text-white">{Math.min(endIndex, filteredClients.length)}</span> de{' '}
                                                    <span className="font-medium text-slate-900 dark:text-white">{filteredClients.length}</span> clientes
                                                </p>
                                            </div>
                                            <div>
                                                <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                                    <button
                                                        onClick={goToPreviousPage}
                                                        disabled={currentPage === 1}
                                                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-300 dark:ring-border-dark focus:z-20 focus:outline-offset-0 transition-colors ${currentPage === 1 ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed bg-gray-100 dark:bg-[#1a2836]' : 'text-gray-400 dark:text-text-secondary hover:bg-gray-50 dark:hover:bg-[#324d67]'}`}
                                                    >
                                                        <span className="sr-only">Anterior</span>
                                                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                                    </button>
                                                    {getPageNumbers().map((page, index) => (
                                                        page === '...' ? (
                                                            <span
                                                                key={`ellipsis-${index}`}
                                                                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-text-secondary ring-1 ring-inset ring-gray-300 dark:ring-border-dark"
                                                            >
                                                                ...
                                                            </span>
                                                        ) : (
                                                            <button
                                                                key={page}
                                                                onClick={() => goToPage(page)}
                                                                aria-current={currentPage === page ? 'page' : undefined}
                                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 transition-colors ${currentPage === page
                                                                    ? 'z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                                                                    : 'text-gray-700 dark:text-text-secondary ring-1 ring-inset ring-gray-300 dark:ring-border-dark hover:bg-gray-50 dark:hover:bg-[#324d67]'
                                                                    }`}
                                                            >
                                                                {page}
                                                            </button>
                                                        )
                                                    ))}
                                                    <button
                                                        onClick={goToNextPage}
                                                        disabled={currentPage === totalPages}
                                                        className={`relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 dark:ring-border-dark focus:z-20 focus:outline-offset-0 transition-colors ${currentPage === totalPages ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed bg-gray-100 dark:bg-[#1a2836]' : 'text-gray-400 dark:text-text-secondary hover:bg-gray-50 dark:hover:bg-[#324d67]'}`}
                                                    >
                                                        <span className="sr-only">Próximo</span>
                                                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                                    </button>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
