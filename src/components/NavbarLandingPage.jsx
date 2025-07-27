import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import LoginModal from '../../src/views/auth/LoginModal';
import RegisterModal from '../../src/views/auth/RegisterModal';

function NavbarLandingPage() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleOpenRegister = () => {
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(true);
    };

    const handleOpenLogin = () => {
        setIsRegisterModalOpen(false);
        setIsLoginModalOpen(true);
    };

    const navItems = [
        { path: '/', label: 'Properti' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Kontak' }
    ];

    return (
        <nav className="bg-primary shadow-lg fixed top-0 z-50 w-full">
            <div className="max-w-6xl mx-auto px-4 backdrop-blur-lg">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-xl font-bold text-accent hover:text-accent-dark transition-colors">
                            Eluma
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className='flex gap-6'>
                        {navItems.map((item) => (
                            <NavLink 
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => 
                                    `hidden md:flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        isActive 
                                            ? 'bg-secondary text-white shadow-md' 
                                            : 'text-white hover:bg-secondary hover:text-white hover:shadow-md'
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Auth Buttons - Desktop */}
                    <div className="hidden md:flex items-center space-x-2">
                        <button 
                            onClick={() => setIsLoginModalOpen(true)} 
                            className="px-4 py-2 bg-accent hover:bg-accent-dark font-medium text-white rounded-md transition-colors"
                        >
                            Masuk
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-accent hover:bg-secondary focus:outline-none transition-colors"
                            aria-label="Toggle menu"
                        >
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navItems.map((item) => (
                            <NavLink 
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => 
                                    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                        isActive 
                                            ? 'text-primary bg-accent-light' 
                                            : 'text-gray-700 hover:text-primary hover:bg-accent-light'
                                    }`
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </NavLink>
                        ))}

                        <div className="flex flex-col space-y-2 mt-2">
                            <button 
                                onClick={() => {
                                    setIsLoginModalOpen(true);
                                    setIsMenuOpen(false);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors text-left"
                            >
                                Login
                            </button>

                            <button 
                                onClick={() => {
                                    setIsRegisterModalOpen(true);
                                    setIsMenuOpen(false);
                                }}
                                className="px-4 py-2 rounded-md text-base font-medium text-white bg-accent hover:bg-accent-dark transition-colors text-center"
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <LoginModal 
                isOpen={isLoginModalOpen} 
                onClose={() => setIsLoginModalOpen(false)} 
                onRegisterClick={handleOpenRegister}
            />

            <RegisterModal 
                isOpen={isRegisterModalOpen} 
                onClose={() => setIsRegisterModalOpen(false)}
                onLoginClick={handleOpenLogin}
            />
        </nav>
    );
}

export default NavbarLandingPage;