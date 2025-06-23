import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { AuthContext } from '../../../src/context/AuthContext.jsx';

function NavbarLandingPage() {
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
        navigate("/login", { replace: true });
    };

    return (
        <div>
            <a onClick={logout} style={{ cursor: 'pointer' }} className="btn btn-outline px-4">Logout</a>
        </div>
    );
}

export default NavbarLandingPage;
