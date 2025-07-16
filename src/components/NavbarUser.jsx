import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { AuthContext } from '../context/AuthContext.jsx';

function NavbarUsers() {
    const navigate = useNavigate();
    const { setIsAuthenticated, setUserRole } = useContext(AuthContext);
    const [activeSection, setActiveSection] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            const sections = ["about", "dataset", "algoritma", "deployment"];
            const scrollPosition = window.scrollY + window.innerHeight / 2;

            sections.forEach((section) => {
                const element = document.getElementById(section);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetBottom = offsetTop + element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                        setActiveSection(section);
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        setIsAuthenticated(false);
        setUserRole(null);
        window.location.href = "/";
    };

    return (
        <nav className="bg-primary shadow-lg fixed top-0 z-50 w-full">
            <div className="max-w-6xl mx-auto px-4 backdrop-blur-lg">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a href="/" className="text-xl font-bold text-accent">Eluma</a>
                    </div>
                    {/* Tombol kanan */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/user/add/property')}
                            className="btn btn-primary px-4"
                        >
                            Tambah Properti
                        </button>
                        <button
                            onClick={logout}
                            className="btn btn-outline px-4"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavbarUsers;
