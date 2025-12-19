import React, { useState } from 'react';

// Mock data para mensagens
const MOCK_MESSAGES = [
    {
        id: 1,
        user: 'Ana Silva',
        avatar: 'https://i.pravatar.cc/100?u=ana',
        action: 'mentioned you in',
        project: 'Website Redesign',
        message: 'Can you check the latest Figma mockup? I think the gradient on the hero section needs adjustment.',
        time: '2m ago',
        type: 'mention',
        unread: true
    },
    {
        id: 2,
        user: 'Carlos Mendes',
        avatar: 'https://i.pravatar.cc/100?u=carlos',
        action: 'completed a task in',
        project: 'Mobile App Q3',
        message: 'Marked "API Integration" as done.',
        time: '1h ago',
        type: 'status',
        unread: true
    },
    {
        id: 3,
        user: 'System Notification',
        avatar: null,
        action: 'Approval Requested',
        project: null,
        message: 'Client has requested approval for the Q3 Marketing Budget proposal.',
        time: '3h ago',
        type: 'approval',
        unread: false
    },
    {
        id: 4,
        user: 'Sofia Martinez',
        avatar: 'https://i.pravatar.cc/100?u=sofia',
        action: 'commented on',
        project: 'Design System',
        message: 'Added new color tokens.',
        time: 'Yesterday',
        type: 'comment',
        unread: false
    }
];

export default function Inbox() {
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [selectedMessage, setSelectedMessage] = useState(messages[0]);
    const [replyText, setReplyText] = useState('');

    const handleSelectMessage = (message) => {
        setSelectedMessage(message);
        // Marcar como lida
        setMessages(prev => prev.map(m =>
            m.id === message.id ? { ...m, unread: false } : m
        ));
    };

    const handleSendReply = () => {
        if (!replyText.trim()) return;
        console.log('Sending reply:', replyText);
        setReplyText('');
        // Aqui você adicionaria a lógica para enviar a resposta
    };

    const handleApprove = () => {
        console.log('Approved');
        // Lógica de aprovação
    };

    const handleSnooze = () => {
        console.log('Snoozed');
        // Lógica de adiar
    };

    return (
        <div className="flex flex-1 h-full overflow-hidden relative">
            {/* Content Split View */}
            <div className="flex flex-1 overflow-hidden">
                {/* LIST VIEW (Left Panel) */}
                <div className="w-full md:w-[400px] xl:w-[450px] flex flex-col border-r border-gray-200 dark:border-border-dark bg-white dark:bg-[#111a22] overflow-y-auto shrink-0">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            onClick={() => handleSelectMessage(msg)}
                            className={`flex gap-4 p-4 border-l-[3px] cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1f2e3d] transition-colors group relative ${selectedMessage?.id === msg.id
                                ? 'border-l-primary bg-gray-50 dark:bg-[#1c2936]'
                                : 'border-l-transparent border-b border-b-gray-100 dark:border-b-[#1c2936]'
                                }`}
                        >
                            <div className="shrink-0 relative">
                                {msg.avatar ? (
                                    <div className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 border border-gray-200 dark:border-[#233648]" style={{ backgroundImage: `url("${msg.avatar}")` }}></div>
                                ) : (
                                    <div className="flex items-center justify-center bg-gray-100 dark:bg-[#233648] text-slate-700 dark:text-white rounded-full h-10 w-10 border border-gray-200 dark:border-[#324d67]">
                                        <span className="font-bold text-sm">TF</span>
                                    </div>
                                )}
                                <div className={`absolute -bottom-1 -right-1 rounded-full p-[2px] border-2 border-white dark:border-[#111a22] ${msg.type === 'mention' ? 'bg-primary text-white' :
                                    msg.type === 'status' ? 'bg-emerald-500 text-white' :
                                        'bg-amber-500 text-white'
                                    }`}>
                                    <span className="material-symbols-outlined text-[12px] leading-none block">
                                        {msg.type === 'mention' ? 'alternate_email' :
                                            msg.type === 'status' ? 'check_circle' :
                                                'assignment_turned_in'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col justify-start min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <p className={`text-sm truncate pr-2 ${msg.unread ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-900 dark:text-white font-medium'}`}>{msg.user}</p>
                                    <p className={`text-xs whitespace-nowrap ${msg.unread ? 'text-primary font-medium' : 'text-slate-500 dark:text-text-secondary'}`}>{msg.time}</p>
                                </div>
                                <p className="text-slate-500 dark:text-text-secondary text-xs mb-1 truncate">
                                    {msg.action} {msg.project && <span className={msg.type === 'mention' ? 'text-primary font-medium' : msg.type === 'status' ? 'text-emerald-500 font-medium' : 'text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wide'}>{msg.project}</span>}
                                </p>
                                <p className={`text-sm font-normal line-clamp-2 ${msg.unread ? 'text-slate-700 dark:text-white/80' : 'text-slate-500 dark:text-text-secondary'}`}>{msg.message}</p>
                            </div>
                            {msg.unread && (
                                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* DETAIL VIEW (Right Panel) */}
                <div className="hidden md:flex flex-1 flex-col bg-white dark:bg-[#111a22] relative">
                    <div className="flex flex-col h-full">
                        {/* Context Header */}
                        <div className="px-8 py-5 border-b border-gray-200 dark:border-border-dark bg-white dark:bg-[#111a22] flex justify-between items-center shadow-sm z-10">
                            <div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-text-secondary mb-1">
                                    <span className="flex items-center gap-1 hover:text-primary dark:hover:text-white cursor-pointer transition-colors">
                                        <span className="material-symbols-outlined text-[14px]">folder</span>
                                        Website Redesign
                                    </span>
                                    <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                                    <span className="hover:text-primary dark:hover:text-white cursor-pointer transition-colors">Tasks</span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                    Fix Login Bug #402
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500 text-xs font-bold border border-amber-500/20 uppercase tracking-wide">In Review</span>
                                </h2>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleSnooze} className="p-2 text-slate-500 dark:text-text-secondary hover:text-primary dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-[#233648] transition-colors" title="Snooze">
                                    <span className="material-symbols-outlined">snooze</span>
                                </button>
                                <button className="p-2 text-slate-500 dark:text-text-secondary hover:text-primary dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-[#233648] transition-colors" title="More options">
                                    <span className="material-symbols-outlined">more_vert</span>
                                </button>
                            </div>
                        </div>

                        {/* Conversation Stream */}
                        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 bg-slate-50 dark:bg-[#0f161d]">
                            {/* System Message */}
                            <div className="flex justify-center my-2">
                                <div className="bg-white dark:bg-[#1c2936] text-slate-500 dark:text-text-secondary text-xs py-1 px-3 rounded-full border border-gray-200 dark:border-[#233648] shadow-sm">
                                    Today, October 24
                                </div>
                            </div>

                            {/* Previous Comment */}
                            <div className="flex gap-4">
                                <div className="bg-center bg-no-repeat bg-cover rounded-full h-8 w-8 shrink-0 mt-1" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuATvO2yujB5AMGv9P9w5UubH2YvKSjEgRtTlEcnlmVTqIAnG-9XAml2bmehnVXW-sRjMv2WXZ5N2DD-Q7_agvLAAiL_OJvS67HIeVerahFpFPA8V60c8hO8fR0Ubi9lz80VGlYiKcmNTIJjUCvxwbE1OA40uD7gCLYtNiz86LmW8dLo4S7Dx3nRry-NVVgWXuOuVKVuAItsR9OxdId3jyo95w1eipflNDLyGamVAtti71G6eVuQVXkHevOBthOI204KR34iHaqUpVw")' }}></div>
                                <div className="flex flex-col max-w-[80%]">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">John Doe</span>
                                        <span className="text-xs text-slate-500 dark:text-text-secondary">09:42 AM</span>
                                    </div>
                                    <div className="bg-white dark:bg-[#1c2936] p-3 rounded-lg rounded-tl-none border border-gray-200 dark:border-[#233648] shadow-sm">
                                        <p className="text-sm text-slate-700 dark:text-gray-200 leading-relaxed">I've pushed the fix to the staging environment. Can someone review it?</p>
                                    </div>
                                </div>
                            </div>

                            {/* System Action */}
                            <div className="flex items-center gap-4 pl-12 opacity-70">
                                <div className="w-0.5 h-full bg-gray-200 dark:bg-[#233648]"></div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-text-secondary">
                                    <span className="material-symbols-outlined text-[14px]">history</span>
                                    <span>John Doe changed status from <span className="text-slate-900 dark:text-white font-medium">In Progress</span> to <span className="text-amber-600 dark:text-amber-500 font-medium">In Review</span></span>
                                </div>
                            </div>

                            {/* Current Focus Message (Highlighted) */}
                            <div className="flex gap-4 group/message">
                                <div className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 shrink-0 mt-1 ring-2 ring-primary ring-offset-2 ring-offset-slate-50 dark:ring-offset-[#0f161d]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCWc8T5DZpySaiHOdTzTj3k9J-w_sKIot7MosAvp0iq1Q-UHMa1y8LdJ4fGuJKmn49T-aeaCD3Uv6txivKCZQkH2aCklRQaJxTqLdBHOmI1H5umkDot_H9dBCInl45CsU4Oen2ekZPCVKVTRlamNeyYHxV73iAryDZIOYiIKUbBLaWkVLNrfhUOTkmbWGOwVDN9y9wt_Tv8SgZv987O2vB9YWPT8ZnEa9S44nJlop3hVrbKjBQdDaUFntNeAKt1gbCQ8BB65QAzAVU")' }}></div>
                                <div className="flex flex-col w-full">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">Ana Silva</span>
                                        <span className="text-xs text-slate-500 dark:text-text-secondary">10:15 AM</span>
                                    </div>
                                    <div className="bg-white dark:bg-[#1c2936] p-4 rounded-xl rounded-tl-none border border-primary/20 dark:border-primary/30 shadow-md relative group-hover/message:bg-gray-50 dark:group-hover/message:bg-[#203040] transition-colors">
                                        <p className="text-sm text-slate-900 dark:text-white leading-relaxed">
                                            <span className="text-primary font-medium bg-primary/10 px-1 rounded">@Pedro Santos</span> Can you check the latest Figma mockup? I think the gradient on the hero section needs adjustment to match the dark mode palette better.
                                        </p>
                                        {/* Attachment Preview */}
                                        <div className="mt-3 flex gap-3">
                                            <div className="group cursor-pointer border border-gray-200 dark:border-[#324d67] rounded-lg overflow-hidden bg-white dark:bg-[#111a22] hover:border-primary transition-colors">
                                                <div className="h-20 w-32 bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(135deg, #137fec 0%, #101922 100%)' }}></div>
                                                <div className="p-2 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[#92adc9] text-[16px]">image</span>
                                                    <span className="text-[10px] text-slate-500 dark:text-text-secondary font-medium">hero-gradient.png</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="p-6 bg-white dark:bg-[#111a22] border-t border-gray-200 dark:border-[#233648]">
                            {/* Quick Actions */}
                            <div className="flex gap-2 mb-4">
                                <button onClick={handleApprove} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-[#1c2936] border border-gray-200 dark:border-[#233648] hover:border-emerald-500/50 hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10 transition-colors group text-emerald-600 dark:text-emerald-500">
                                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                    <span className="text-xs font-medium">Approve Fix</span>
                                </button>
                                <button onClick={handleSnooze} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-[#1c2936] border border-gray-200 dark:border-[#233648] hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors group text-primary">
                                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                                    <span className="text-xs font-medium">Remind me later</span>
                                </button>
                            </div>
                            {/* Input */}
                            <div className="bg-slate-50 dark:bg-[#1c2936] rounded-xl border border-gray-200 dark:border-[#233648] focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-sm">
                                <div className="p-2 border-b border-gray-200 dark:border-[#233648] flex gap-1">
                                    <button className="p-1.5 text-slate-500 dark:text-text-secondary hover:text-primary dark:hover:text-white rounded hover:bg-gray-100 dark:hover:bg-[#233648]"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
                                    <button className="p-1.5 text-slate-500 dark:text-text-secondary hover:text-primary dark:hover:text-white rounded hover:bg-gray-100 dark:hover:bg-[#233648]"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
                                    <button className="p-1.5 text-slate-500 dark:text-text-secondary hover:text-primary dark:hover:text-white rounded hover:bg-gray-100 dark:hover:bg-[#233648]"><span className="material-symbols-outlined text-[18px]">list</span></button>
                                    <div className="w-[1px] bg-gray-200 dark:bg-[#233648] mx-1"></div>
                                    <button className="p-1.5 text-slate-500 dark:text-text-secondary hover:text-primary dark:hover:text-white rounded hover:bg-gray-100 dark:hover:bg-[#233648]"><span className="material-symbols-outlined text-[18px]">attach_file</span></button>
                                    <button className="p-1.5 text-slate-500 dark:text-text-secondary hover:text-primary dark:hover:text-white rounded hover:bg-gray-100 dark:hover:bg-[#233648]"><span className="material-symbols-outlined text-[18px]">sentiment_satisfied</span></button>
                                </div>
                                <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} className="w-full bg-transparent border-none text-slate-900 dark:text-white text-sm focus:ring-0 placeholder:text-slate-400 dark:placeholder:text-text-secondary/60 p-3 h-20 resize-none" placeholder="Reply to Ana..."></textarea>
                                <div className="flex justify-between items-center p-2 pt-0">
                                    <span className="text-[10px] text-slate-500 dark:text-text-secondary px-2">Press ⌘+Enter to send</span>
                                    <button onClick={handleSendReply} className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                                        Send Reply
                                        <span className="material-symbols-outlined text-[16px]">send</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
