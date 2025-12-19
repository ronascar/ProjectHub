import React from 'react';

export default function CustomConfirm({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'warning' }) {
    if (!isOpen) return null;

    const icons = {
        danger: (
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30">
                <svg className="h-10 w-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
        ),
        warning: (
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <svg className="h-10 w-10 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
        ),
        info: (
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <svg className="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        )
    };

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-[#1e293b] shadow-2xl transition-all w-full max-w-md">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Content */}
                    <div className="p-8">
                        {/* Icon */}
                        <div className="mb-6">
                            {icons[type]}
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-3">
                            {title}
                        </h3>

                        {/* Message */}
                        <p className="text-center text-slate-600 dark:text-slate-300 mb-8">
                            {message}
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 rounded-xl px-6 py-3 text-base font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all focus:outline-none focus:ring-4 focus:ring-slate-300 dark:focus:ring-slate-600"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 rounded-xl px-6 py-3 text-base font-semibold text-white bg-red-600 hover:bg-red-700 shadow-lg transition-all hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-red-500"
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Hook para usar o confirm customizado
export function useCustomConfirm() {
    const [confirmState, setConfirmState] = React.useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'warning',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        onConfirm: () => { }
    });

    const showConfirm = ({ title, message, type = 'warning', confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm }) => {
        return new Promise((resolve) => {
            setConfirmState({
                isOpen: true,
                title,
                message,
                type,
                confirmText,
                cancelText,
                onConfirm: () => {
                    if (onConfirm) onConfirm();
                    resolve(true);
                }
            });
        });
    };

    const closeConfirm = () => {
        setConfirmState(prev => ({ ...prev, isOpen: false }));
    };

    const ConfirmComponent = () => (
        <CustomConfirm
            isOpen={confirmState.isOpen}
            onClose={closeConfirm}
            onConfirm={confirmState.onConfirm}
            title={confirmState.title}
            message={confirmState.message}
            type={confirmState.type}
            confirmText={confirmState.confirmText}
            cancelText={confirmState.cancelText}
        />
    );

    return { showConfirm, ConfirmComponent };
}
