import React, { useState, useEffect } from 'react';
import { messagesAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Inbox() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [showNewMessage, setShowNewMessage] = useState(false);
    const [newMessageTo, setNewMessageTo] = useState('');
    const [newMessageContent, setNewMessageContent] = useState('');

    // Load messages and users
    useEffect(() => {
        loadMessages();
        loadUsers();
    }, []);

    const loadMessages = async () => {
        try {
            setLoading(true);
            const data = await messagesAPI.list();
            setMessages(data);
            if (data.length > 0 && !selectedMessage) {
                setSelectedMessage(data[0]);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            const data = await usersAPI.list();
            setUsers(data.filter(u => u.id !== user?.id));
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const handleSelectMessage = async (message) => {
        setSelectedMessage(message);

        // Mark as read if it's a received message and unread
        if (message.receiverId === user?.id && !message.isRead) {
            try {
                await messagesAPI.markAsRead(message.id);
                setMessages(prev => prev.map(m =>
                    m.id === message.id ? { ...m, isRead: true } : m
                ));
            } catch (error) {
                console.error('Error marking message as read:', error);
            }
        }
    };

    const handleSendReply = async () => {
        if (!replyText.trim() || !selectedMessage) return;

        try {
            const receiverId = selectedMessage.senderId === user?.id
                ? selectedMessage.receiverId
                : selectedMessage.senderId;

            await messagesAPI.send(receiverId, replyText);
            setReplyText('');
            loadMessages(); // Reload to show new message
        } catch (error) {
            console.error('Error sending reply:', error);
            alert('Erro ao enviar mensagem');
        }
    };

    const handleSendNewMessage = async () => {
        if (!newMessageTo || !newMessageContent.trim()) {
            alert('Selecione um destinatário e escreva uma mensagem');
            return;
        }

        try {
            await messagesAPI.send(newMessageTo, newMessageContent);
            setNewMessageContent('');
            setNewMessageTo('');
            setShowNewMessage(false);
            loadMessages();
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Erro ao enviar mensagem');
        }
    };

    const formatTime = (date) => {
        const now = new Date();
        const messageDate = new Date(date);
        const diffInHours = (now - messageDate) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return `${Math.floor(diffInHours * 60)}m atrás`;
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h atrás`;
        } else if (diffInHours < 48) {
            return 'Ontem';
        } else {
            return messageDate.toLocaleDateString('pt-BR');
        }
    };

    const getOtherUser = (message) => {
        return message.senderId === user?.id ? message.receiver : message.sender;
    };

    const isUnread = (message) => {
        return message.receiverId === user?.id && !message.isRead;
    };

    return (
        <div className="flex flex-1 h-full overflow-hidden relative">
            {/* Content Split View */}
            <div className="flex flex-1 overflow-hidden">
                {/* LIST VIEW (Left Panel) */}
                <div className="w-full md:w-[400px] xl:w-[450px] flex flex-col border-r border-gray-200 dark:border-border-dark bg-white dark:bg-[#111a22] overflow-y-auto shrink-0">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-border-dark flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Caixa de Entrada</h2>
                        <button
                            onClick={() => setShowNewMessage(true)}
                            className="p-2 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors"
                            title="Nova Mensagem"
                        >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                    </div>

                    {/* Messages List */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                                <p className="text-slate-500 dark:text-slate-400">Carregando mensagens...</p>
                            </div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-3 text-center px-4">
                                <span className="material-symbols-outlined text-6xl text-slate-400">mail</span>
                                <p className="text-slate-500 dark:text-slate-400">Nenhuma mensagem ainda</p>
                                <button
                                    onClick={() => setShowNewMessage(true)}
                                    className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Enviar primeira mensagem
                                </button>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const otherUser = getOtherUser(msg);
                            const unread = isUnread(msg);

                            return (
                                <div
                                    key={msg.id}
                                    onClick={() => handleSelectMessage(msg)}
                                    className={`flex gap-4 p-4 border-l-[3px] cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1f2e3d] transition-colors group relative ${selectedMessage?.id === msg.id
                                        ? 'border-l-primary bg-gray-50 dark:bg-[#1c2936]'
                                        : 'border-l-transparent border-b border-b-gray-100 dark:border-b-[#1c2936]'
                                        }`}
                                >
                                    <div className="shrink-0 relative">
                                        {otherUser?.avatar ? (
                                            <div className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 border border-gray-200 dark:border-[#233648]" style={{ backgroundImage: `url("${otherUser.avatar}")` }}></div>
                                        ) : (
                                            <div className="flex items-center justify-center bg-primary/20 text-primary rounded-full h-10 w-10 border border-gray-200 dark:border-[#324d67]">
                                                <span className="font-bold text-sm">{otherUser?.name?.charAt(0).toUpperCase()}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col justify-start min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <p className={`text-sm truncate pr-2 ${unread ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-900 dark:text-white font-medium'}`}>
                                                {otherUser?.name}
                                            </p>
                                            <p className={`text-xs whitespace-nowrap ${unread ? 'text-primary font-medium' : 'text-slate-500 dark:text-text-secondary'}`}>
                                                {formatTime(msg.createdAt)}
                                            </p>
                                        </div>
                                        <p className={`text-sm font-normal line-clamp-2 ${unread ? 'text-slate-700 dark:text-white/80' : 'text-slate-500 dark:text-text-secondary'}`}>
                                            {msg.senderId === user?.id && <span className="text-xs mr-1">Você: </span>}
                                            {msg.content}
                                        </p>
                                    </div>
                                    {unread && (
                                        <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-amber-500"></div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* DETAIL VIEW (Right Panel) */}
                <div className="hidden md:flex flex-1 flex-col bg-white dark:bg-[#111a22] relative">
                    {selectedMessage ? (
                        <div className="flex flex-col h-full">
                            {/* Context Header */}
                            <div className="px-8 py-5 border-b border-gray-200 dark:border-border-dark bg-white dark:bg-[#111a22] flex justify-between items-center shadow-sm z-10">
                                <div className="flex items-center gap-3">
                                    {getOtherUser(selectedMessage)?.avatar ? (
                                        <div className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 border border-gray-200" style={{ backgroundImage: `url("${getOtherUser(selectedMessage).avatar}")` }}></div>
                                    ) : (
                                        <div className="flex items-center justify-center bg-primary/20 text-primary rounded-full h-10 w-10">
                                            <span className="font-bold">{getOtherUser(selectedMessage)?.name?.charAt(0).toUpperCase()}</span>
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                            {getOtherUser(selectedMessage)?.name}
                                        </h2>
                                        <p className="text-xs text-slate-500 dark:text-text-secondary">
                                            {getOtherUser(selectedMessage)?.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleSelectMessage(selectedMessage)}
                                        className="p-2 text-slate-500 dark:text-text-secondary hover:text-primary dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-[#233648] transition-colors"
                                        title="Atualizar"
                                    >
                                        <span className="material-symbols-outlined">refresh</span>
                                    </button>
                                </div>
                            </div>

                            {/* Conversation Stream */}
                            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 bg-slate-50 dark:bg-[#0f161d]">
                                {/* Date Divider */}
                                <div className="flex justify-center my-2">
                                    <div className="bg-white dark:bg-[#1c2936] text-slate-500 dark:text-text-secondary text-xs py-1 px-3 rounded-full border border-gray-200 dark:border-[#233648] shadow-sm">
                                        {new Date(selectedMessage.createdAt).toLocaleDateString('pt-BR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>

                                {/* Message */}
                                <div className={`flex gap-4 ${selectedMessage.senderId === user?.id ? 'flex-row-reverse' : ''}`}>
                                    <div className="shrink-0 mt-1">
                                        {selectedMessage.senderId === user?.id ? (
                                            user?.avatar ? (
                                                <div className="bg-center bg-no-repeat bg-cover rounded-full h-8 w-8" style={{ backgroundImage: `url("${user.avatar}")` }}></div>
                                            ) : (
                                                <div className="flex items-center justify-center bg-primary/20 text-primary rounded-full h-8 w-8">
                                                    <span className="font-bold text-xs">{user?.name?.charAt(0).toUpperCase()}</span>
                                                </div>
                                            )
                                        ) : (
                                            getOtherUser(selectedMessage)?.avatar ? (
                                                <div className="bg-center bg-no-repeat bg-cover rounded-full h-8 w-8" style={{ backgroundImage: `url("${getOtherUser(selectedMessage).avatar}")` }}></div>
                                            ) : (
                                                <div className="flex items-center justify-center bg-primary/20 text-primary rounded-full h-8 w-8">
                                                    <span className="font-bold text-xs">{getOtherUser(selectedMessage)?.name?.charAt(0).toUpperCase()}</span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div className="flex flex-col max-w-[80%]">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                {selectedMessage.senderId === user?.id ? 'Você' : getOtherUser(selectedMessage)?.name}
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-text-secondary">
                                                {new Date(selectedMessage.createdAt).toLocaleTimeString('pt-BR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <div className={`p-3 rounded-lg border shadow-sm ${selectedMessage.senderId === user?.id
                                                ? 'bg-primary/10 border-primary/20 rounded-tr-none'
                                                : 'bg-white dark:bg-[#1c2936] border-gray-200 dark:border-[#233648] rounded-tl-none'
                                            }`}>
                                            <p className="text-sm text-slate-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                                                {selectedMessage.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Area */}
                            <div className="p-6 bg-white dark:bg-[#111a22] border-t border-gray-200 dark:border-[#233648]">
                                {/* Input */}
                                <div className="bg-slate-50 dark:bg-[#1c2936] rounded-xl border border-gray-200 dark:border-[#233648] focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-sm">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        className="w-full bg-transparent border-none text-slate-900 dark:text-white text-sm focus:ring-0 placeholder:text-slate-400 dark:placeholder:text-text-secondary/60 p-3 h-20 resize-none"
                                        placeholder={`Responder para ${getOtherUser(selectedMessage)?.name}...`}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                                handleSendReply();
                                            }
                                        }}
                                    ></textarea>
                                    <div className="flex justify-between items-center p-2 pt-0">
                                        <span className="text-[10px] text-slate-500 dark:text-text-secondary px-2">Pressione Ctrl+Enter para enviar</span>
                                        <button
                                            onClick={handleSendReply}
                                            disabled={!replyText.trim()}
                                            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Enviar Resposta
                                            <span className="material-symbols-outlined text-[16px]">send</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="flex flex-col items-center gap-3 text-center px-4">
                                <span className="material-symbols-outlined text-6xl text-slate-400">mail</span>
                                <p className="text-slate-500 dark:text-slate-400">Selecione uma mensagem para visualizar</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* New Message Modal */}
            {showNewMessage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-2xl max-w-lg w-full">
                        <div className="p-6 border-b border-gray-200 dark:border-border-dark flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nova Mensagem</h3>
                            <button
                                onClick={() => setShowNewMessage(false)}
                                className="text-slate-500 hover:text-slate-700 dark:hover:text-white"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Para:
                                </label>
                                <select
                                    value={newMessageTo}
                                    onChange={(e) => setNewMessageTo(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white rounded-lg p-2.5 focus:ring-primary focus:border-primary"
                                >
                                    <option value="">Selecione um usuário...</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Mensagem:
                                </label>
                                <textarea
                                    value={newMessageContent}
                                    onChange={(e) => setNewMessageContent(e.target.value)}
                                    rows="6"
                                    className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white rounded-lg p-3 focus:ring-primary focus:border-primary resize-none"
                                    placeholder="Digite sua mensagem..."
                                ></textarea>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 dark:border-border-dark flex justify-end gap-3">
                            <button
                                onClick={() => setShowNewMessage(false)}
                                className="px-4 py-2 border border-slate-200 dark:border-border-dark rounded-lg text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-background-dark transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSendNewMessage}
                                disabled={!newMessageTo || !newMessageContent.trim()}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Enviar
                                <span className="material-symbols-outlined text-[16px]">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
