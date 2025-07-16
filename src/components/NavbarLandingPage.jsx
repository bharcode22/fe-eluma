import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from "react-scroll";
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

    return (
        <nav className="bg-primary shadow-lg fixed top-0 z-50 w-full">
            <div className="max-w-6xl mx-auto px-4 backdrop-blur-lg">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-xl font-bold text-accent">
                            Eluma
                        </Link>
                    </div>

                <div className='flex gap-10'>
                    <a className="hidden md:flex items-center space-x-1">
                        <ScrollLink 
                            to="home" 
                            smooth={true} 
                            duration={500} 
                            className="px-3 py-4 text-white border-none bg-transparent hover:bg-secondary hover:text-white hover:rounded hover:shadow-md transition duration-300"

                            // activeClass="text-amber-600 font-semibold"
                        >
                            Layanan
                        </ScrollLink>
                    </a>

                    <a className="hidden md:flex items-center space-x-1">
                        <ScrollLink 
                            to="home" 
                            smooth={true} 
                            duration={500} 
                            className="px-3 py-4 text-white border-none bg-transparent hover:bg-secondary hover:text-white hover:rounded hover:shadow-md transition duration-300"

                            // activeClass="text-amber-600 font-semibold"
                        >
                            Tentang
                        </ScrollLink>
                    </a>

                    <a className="hidden md:flex items-center space-x-1">
                        <ScrollLink 
                            to="home" 
                            smooth={true} 
                            duration={500} 
                            className="px-3 py-4 text-white border-none bg-transparent hover:bg-secondary hover:text-white hover:rounded hover:shadow-md transition duration-300"

                            // activeClass="text-amber-600 font-semibold"
                        >
                            Kontak
                        </ScrollLink>
                    </a>

                </div>

                    {/* Auth Buttons - Desktop */}
                    <div className="hidden md:flex items-center space-x-2">
                        <button onClick={() => setIsLoginModalOpen(true)} className="px-4 py-2 btn btn-accent font-medium text-white rounded-l" >
                            Masuk
                        </button>

                        {/* <button 
                            onClick={() => {
                                setIsRegisterModalOpen(true);
                                setIsMenuOpen(false);
                            }}
                            className="block px-3 py-2 rounded-md text-base font-medium text-secondary bg-accent hover:bg-accent-200 transition-colors w-full text-center"
                        >
                            Register
                        </button> */}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-amber-600 hover:bg-amber-50 focus:outline-none transition-colors"
                        >
                            <svg 
                                className="h-6 w-6" 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
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

            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <ScrollLink 
                            to="home" 
                            smooth={true} 
                            duration={500} 
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            activeClass="text-amber-600 font-semibold"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </ScrollLink>

                        <div className="flex flex-col space-y-2 mt-2">
                            <button 
                                onClick={() => {
                                    setIsLoginModalOpen(true);
                                    setIsMenuOpen(false);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors text-left"
                            >
                                Login
                            </button>

                            <button 
                                onClick={() => {
                                    setIsRegisterModalOpen(true);
                                    setIsMenuOpen(false);
                                }}
                                className="px-4 py-2 rounded-md text-base font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors text-center"
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
    )
}

export default NavbarLandingPage;