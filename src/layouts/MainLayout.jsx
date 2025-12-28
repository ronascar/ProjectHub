import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function MainLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="flex h-[100dvh] w-full overflow-hidden">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar isMobile={true} onClose={closeMobileMenu} />
            </div>

            <main className="flex flex-1 flex-col overflow-hidden bg-background-light dark:bg-background-dark">
                <Header onMenuToggle={toggleMobileMenu} />
                <div className="flex-1 overflow-y-auto pb-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
