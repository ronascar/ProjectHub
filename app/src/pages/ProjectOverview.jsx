import React from 'react';

export default function ProjectOverview() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Description */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Descrição do Projeto</h3>
                    </div>
                    <div className="p-6">
                        <p className="text-slate-600 dark:text-[#94a3b8] leading-relaxed mb-4">
                            O objetivo principal deste projeto é redesenhar completamente o site corporativo da Acme Corp para alinhar com a nova identidade de marca lançada no Q4 2023. O projeto inclui a migração do legado WordPress para uma arquitetura Headless moderna, focando em performance (Core Web Vitals), acessibilidade e escalabilidade para múltiplos idiomas.
                        </p>
                        <p className="text-slate-600 dark:text-[#94a3b8] leading-relaxed">
                            Além do frontend, será desenvolvido um painel administrativo customizado para a equipe de marketing gerenciar campanhas e landing pages de forma autônoma.
                        </p>
                    </div>
                </div>
                {/* Scope */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Escopo & Entregáveis</h3>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
                                <div>
                                    <p className="text-slate-900 dark:text-white font-medium">Design System & UI Kit</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Criação de biblioteca de componentes no Figma.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary mt-0.5">pending</span>
                                <div>
                                    <p className="text-slate-900 dark:text-white font-medium">Desenvolvimento Frontend</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Implementação das páginas institucionais e blog.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-slate-400 dark:text-slate-600 mt-0.5">radio_button_unchecked</span>
                                <div>
                                    <p className="text-slate-900 dark:text-white font-medium">Integração CMS</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Configuração de content models e webhooks.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-slate-400 dark:text-slate-600 mt-0.5">radio_button_unchecked</span>
                                <div>
                                    <p className="text-slate-900 dark:text-white font-medium">QA & Homologação</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Testes automatizados e aprovação do cliente.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* Tech Stack */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-border-dark">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Stack Tecnológica</h3>
                    </div>
                    <div className="p-6 flex flex-wrap gap-3">
                        <span className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium flex items-center gap-2">
                            <img alt="React logo" className="size-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQAxvaFcGsg8N8dHuodEj0Bu1KUtWW6pk3wr7kqYgy4IQRttrNzcp2t3D1dHiTSWBE7Y_SgHy0Bcw2Cr9i6RIkxcaihSO1_tfgGuNkfswd8esOQhvt4njuMtFkreNGb4w8mJWwhDlUv022w7udBkemotZEy3cJ1IwwwllQvizmKPqLGxrQ6PQ-PnqrAHd3tURBfV-UW0SUQggHaOnKgE3SSuPglNLZUAHdnM4579AXNBnQ3kERNy3ym58_uqS7C_Ccf7S0PrJeB3s" />
                            React
                        </span>
                        <span className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium flex items-center gap-2">
                            <img alt="NextJS logo" className="size-4 invert dark:invert-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6vnxoAH-BS0jvK7o7psPhU4RrRAS5_zbIAVqsBjQ5h8ePIj7YPNiGQF7NL53Tc4k0ZwAPh3eQtGhRqkG0__1dcZrZjHG3Qy118VeUA0VU9ouShJElJ430eATJsEETC-47NcGMEKJNGpuq-Z39S07cG_DRWLGfw9_hYNpbliCPE6TyAAbEvQkID5WW1amsJcstHD5vcWZGnhncNxB68wznnVIOOmV0vQrhuOOe8iVcbh9tHnl7u_vQk-Ljy1YnSs94AjWsA8tVzeM" />
                            Next.js 14
                        </span>
                        <span className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium flex items-center gap-2">
                            <img alt="Typescript logo" className="size-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiwW1bZ9oe6Gl0ioxMNJUt2joXMo_Pwj7Pg3aAUbN7i4HTqpNPr9z1Of6ZBOySyFoNFmba3qELBr1wvK6UYWXENtlVqinaLtV-5-bKMrB3NqFSUGATnB29-fTbcvtt3UubxdyzB0gDUczZemZutk-Bulrej2V5r0-SD5TGch7BS-GT4F2rXbULfVK3HEOE_TaaoFeatcLbVtk2e3qhumQu4axs_fFHW_KbcnaYHWHAKthB1p8d4xpRM88gKgLwkS7-xvLE1IZk9iQ" />
                            TypeScript
                        </span>
                        <span className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium flex items-center gap-2">
                            <img alt="Tailwind logo" className="size-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbXToQAMVdz-BTaDFdOanxUBj_IUXK-rb2nVM0R7gZklMwI9QkpFOWx4kilWOZd1WB6fIb4Yr2i6w5LZOsg_dx-ER8L2G5746c0xFKjifzGBFhZB1Nkhz8Yb1Qy67es4ZpItm6OeU6PAXtD_irvHgfiJ9NRs9RY0G3Er9y4IbSqwIILEVlAAvWYOn98Dlx3yqgzBl8dCXuWpN9l05Yhr_2WjP4M2qD_KfelZJtsxh7b3R6nOKAlVG_DTUUdYDTO8Qyby8fNNHb-fY" />
                            Tailwind CSS
                        </span>
                        <span className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium flex items-center gap-2">
                            <img alt="Postgres logo" className="size-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8N5Jq1wDUXS3rj5YP4C1cCNFs4XnSJjg3pbIunJ1lJfGU0aT4veG7ZqxJl_zMrcGbIVjQ-XFm2zM3rgwfThrm_H-CpZRIBaMTjbzc42Zprp6wDIg_u3Wj38KnFySND2DrqRoxBzPcuCavIbxD4IgkrHJkwWrfjEVAwRBEM0axOwjE4pWibsSceJYlR-7-d1djQJ8trRvHz-S-ip4bJwZRzF0ZNctyTLcHVwseaIAhMSOtX3s2uEg-h1KPJ5IfOexaKZTsZhuBJ18" />
                            PostgreSQL
                        </span>
                    </div>
                </div>
            </div>
            {/* Right Column (Sidebar) */}
            <div className="flex flex-col gap-6">
                {/* Client Info */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-[#94a3b8] mb-4">Cliente</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-12 rounded-lg bg-white dark:bg-background-dark p-1 flex items-center justify-center border border-slate-200 dark:border-border-dark">
                            {/* Placeholder logo */}
                            <svg className="size-8 text-slate-900 dark:text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">Acme Corp</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">San Francisco, CA</p>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-slate-200 dark:border-border-dark">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Contato Principal</p>
                        <div className="flex items-center gap-2">
                            <div className="size-6 rounded-full bg-cover" data-alt="Contact person avatar" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC1laberwXeUqz2AvsQ3Fp0Z7pJueYnSoUIibzARpAIEollpwsLZF7zbSCC6YFoo40cdMk47bSeXbE4oQjnxjRAbpaZL2juh5kJ3hbgZgkcrgSfP7BjDB7TlP9dV6M2PmVZEVghhYEyG1Eqeg0XEMRyBIS1R26bOj4U4WWklz0TukFeq57Rs-ljVtCD5rxCrw47chj3aSCWZLac35FtQtr2dWclq1OkQBhPYmx1GOnHB-uzSPrpTi-mKCO6y-5RL5G7IGr7gabFraE')" }}></div>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">Sarah Connor</span>
                        </div>
                    </div>
                </div>
                {/* Timeline */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-[#94a3b8] mb-4">Linha do Tempo</h3>
                    <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-6">
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1.5 size-3 bg-green-500 rounded-full border-2 border-white dark:border-card-dark"></div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Início</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">10 Jan 2024</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1.5 size-3 bg-primary rounded-full border-2 border-white dark:border-card-dark ring-4 ring-primary/20"></div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Estimativa</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">15 Mar 2024</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1.5 size-3 bg-slate-300 dark:bg-slate-600 rounded-full border-2 border-white dark:border-card-dark"></div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Entrega Final</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">20 Mar 2024</p>
                        </div>
                    </div>
                </div>
                {/* Resources / Links */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-[#94a3b8] mb-4">Recursos</h3>
                    <div className="flex flex-col gap-3">
                        <a className="group flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-[#334155] hover:border-primary/50 transition-colors" href="#">
                            <div className="flex items-center gap-3">
                                <div className="bg-white dark:bg-[#233648] p-1.5 rounded-md">
                                    <img alt="GitHub Logo" className="size-5 dark:invert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsJHnYtllVTWemL3s68JwRvuiN1OO8L5Mak6B0R6tZY9UstuTx7LCGeMEZTJpqy23ToeuYSqsfp_m-cBa5S01UxBH4qMFY6h_TqnBmZr1q9Dn-Nwmar9VX1tdml9US8MojFdmo01E8EMivw3qn69NufEH9fxPCjCgTLa10CHW94N7TRcsHKLiABdZRzSJ1qKXhpLZ3b9CVeXtD9gk1ramhCyDQsuuWZEPZt-thiuGFWsjUhLDESIqrsO3dXb2JjckmnBJjSGx9GcE" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Repositório</span>
                                    <span className="text-xs text-slate-500">github.com/agencia/acme-web</span>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 text-[18px]">open_in_new</span>
                        </a>
                        <a className="group flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-[#334155] hover:border-primary/50 transition-colors" href="#">
                            <div className="flex items-center gap-3">
                                <div className="bg-white dark:bg-[#233648] p-1.5 rounded-md">
                                    <span className="material-symbols-outlined text-purple-500 text-[20px]">rocket_launch</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Staging Env</span>
                                    <span className="text-xs text-slate-500">staging.acme.com</span>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 text-[18px]">open_in_new</span>
                        </a>
                        <a className="group flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-[#334155] hover:border-primary/50 transition-colors" href="#">
                            <div className="flex items-center gap-3">
                                <div className="bg-white dark:bg-[#233648] p-1.5 rounded-md">
                                    <img alt="Figma Logo" className="size-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcRqVoZOMk5JHsfAxEo9GkycGvcOIs5QsUxTDUiXJxBdOWYPRggNjhoujADJ9Vt0qEGFyDLXSbETumJLmptGD7zkEQI6S-ikUPetT_tRhutbYVl3mfcuP7tAmvm1JHiD6Q-MMShoes9EKsqTMmxdADyOI5q-YuDnTukyaiP5qlqxuH7gaILODjkcz4PxZnaR60jZ2IBpyA_kKSbwZg8MvusUC5C0SILTiSfABdkFstvOes_Zbn_1kEtlN8haTulXUe0uZ5UHAdbK8" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Design File</span>
                                    <span className="text-xs text-slate-500">figma.com/file/...</span>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 text-[18px]">open_in_new</span>
                        </a>
                        <button className="mt-2 w-full py-2 flex items-center justify-center gap-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:text-primary hover:border-primary transition-colors">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Adicionar Recurso
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
