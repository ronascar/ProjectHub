import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        setIsLoading(true);

        try {
            await login(email, password);
        } catch (err) {
            setLoginError(err.message || 'Credenciais inválidas. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-row overflow-hidden">
            {/* Left Side: Visual/Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-surface-dark items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200')" }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-[2px]" />
                <div className="relative z-10 p-12 max-w-lg text-center">
                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10">
                        <span className="material-symbols-outlined text-4xl">grid_view</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
                        Gerencie Projetos com Precisão
                    </h2>
                    <p className="text-text-secondary text-lg leading-relaxed">
                        Escalável, seguro e projetado para equipes de alto desempenho. Junte-se a milhares de desenvolvedores e agências otimizando seu fluxo de trabalho.
                    </p>
                    {/* Testimonial / Social Proof */}
                    <div className="mt-12 pt-8 border-t border-border-dark/50 flex flex-col items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <img
                                    key={i}
                                    alt="User Avatar"
                                    className="h-10 w-10 rounded-full border-2 border-background-dark"
                                    src={`https://i.pravatar.cc/150?img=${i}`}
                                />
                            ))}
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background-dark bg-surface-dark text-xs font-medium text-white hover:bg-surface-dark/80">
                                +2k
                            </div>
                        </div>
                        <p className="text-sm text-text-secondary">Confiado por equipes em todo o mundo</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex w-full lg:w-1/2 flex-col justify-center items-center px-6 py-12 lg:px-20 bg-background-light dark:bg-background-dark">
                <div className="w-full max-w-[440px] flex flex-col gap-6">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-4">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white shadow-lg">
                            <span className="material-symbols-outlined text-2xl">grid_view</span>
                        </div>
                    </div>

                    {/* Header Section */}
                    <div className="flex flex-col text-center lg:text-left">
                        <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight pb-2">
                            Bem vindo novamente
                        </h1>
                        <p className="text-slate-500 dark:text-text-secondary text-base font-normal leading-normal">
                            Informe seus dados para acessar sua conta.
                        </p>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
                        {/* Error Message */}
                        {loginError && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">error</span>
                                {loginError}
                            </div>
                        )}

                        {/* Demo Credentials Info */}
                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-sm">
                            <p className="font-medium mb-1">Credenciais de teste:</p>
                            <p className="text-xs opacity-80">Email: admin@nexuspm.com</p>
                            <p className="text-xs opacity-80">Senha: password123</p>
                        </div>

                        {/* Email Field */}
                        <label className="flex flex-col gap-2">
                            <span className="text-slate-700 dark:text-white text-sm font-medium leading-normal">
                                Email
                            </span>
                            <div className="relative">
                                <input
                                    className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-text-secondary px-4 pl-11 text-base font-normal leading-normal transition-all"
                                    placeholder="name@company.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-text-secondary flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </div>
                            </div>
                        </label>

                        {/* Password Field */}
                        <label className="flex flex-col gap-2">
                            <span className="text-slate-700 dark:text-white text-sm font-medium leading-normal">
                                Senha
                            </span>
                            <div className="relative flex w-full items-stretch rounded-lg">
                                <input
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg rounded-r-none border-r-0 text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-text-secondary px-4 pl-11 text-base font-normal leading-normal transition-all"
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-text-secondary flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-[20px]">lock</span>
                                </div>
                                <button
                                    className="text-gray-400 dark:text-text-secondary hover:text-primary dark:hover:text-primary transition-colors flex border border-gray-300 dark:border-border-dark border-l-0 bg-white dark:bg-surface-dark items-center justify-center px-4 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {showPassword ? 'visibility' : 'visibility_off'}
                                    </span>
                                </button>
                            </div>
                        </label>

                        {/* Options Row */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    className="form-checkbox rounded border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark text-primary focus:ring-offset-background-dark focus:ring-primary h-4 w-4"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span className="text-sm font-medium text-slate-600 dark:text-text-secondary group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                    Lembrar pelos próximos 30 dias
                                </span>
                            </label>
                            <a className="text-sm font-semibold text-primary hover:text-blue-400 transition-colors" href="#">
                                Esqueceu sua senha?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            className="w-full bg-primary hover:bg-blue-600 active:bg-blue-700 text-white font-semibold h-12 rounded-lg shadow-md shadow-primary/20 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Entrando...
                                </>
                            ) : (
                                'Acessar'
                            )}
                        </button>
                    </form>

                    {/* Social Login Divider */}
                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-border-dark" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background-light dark:bg-background-dark px-2 text-slate-500 dark:text-text-secondary">
                                Ou continue com
                            </span>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 h-11 px-4 rounded-lg border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-[#203040] text-slate-700 dark:text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 h-11 px-4 rounded-lg border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-[#203040] text-slate-700 dark:text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50">
                            <svg aria-hidden="true" className="w-5 h-5 dark:text-white text-slate-800" fill="currentColor" viewBox="0 0 24 24">
                                <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd" />
                            </svg>
                            GitHub
                        </button>
                    </div>

                    {/* Footer Section */}
                    <div className="mt-4 text-center">
                        <p className="text-sm text-slate-500 dark:text-text-secondary">
                            Não tem uma conta?{' '}
                            <a className="font-semibold text-primary hover:text-blue-400 transition-colors" href="#">
                                Cadastre-se
                            </a>
                        </p>
                    </div>
                    <div className="mt-auto pt-8 text-center text-xs text-slate-400 dark:text-slate-600">
                        <p>Project Hub © 2025 Todos direitos reservados.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
