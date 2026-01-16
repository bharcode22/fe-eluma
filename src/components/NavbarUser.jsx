import React, { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from "../context/AuthContext";
import add from "../assets/svg/add.svg";
import { useLanguage } from "../context/LanguageContext";
import { useCurrency } from "../context/CurrencyContext";

const NavbarUsers = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { setIsAuthenticated, setUserRole } = useContext(AuthContext);
    const { lang, setLang } = useLanguage();
    const { currency, setCurrency } = useCurrency();

    const logout = () => {
        Cookies.remove("token");
        Cookies.remove("user");
        setIsAuthenticated(false);
        setUserRole(null);
        navigate("/");
    };

    const navItems = [
        { path: "/user/all/property", label: "Property" },
        { path: "/user/service", label: "Service" },
        { path: "/user/home", label: "Public Property" },
        { path: "/user/private/property", label: "My Private Property" },
        { path: "/user/saved/property", label: "Saved Property" },
        { path: "/user/add/property", label: <img src={add} alt="Add" className="w-7 h-7" /> },
    ];

    // Sub-component for Selectors to avoid duplication
    const Selectors = ({ className = "" }) => (
        <>
            <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className={`bg-secondary text-white px-3 py-2 rounded-md text-sm font-medium border border-secondary-content focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
            >
                {['en', 'id', 'fr', 'de', 'es'].map(l => (
                    <option key={l} value={l}>{l === 'en' ? 'English' : l === 'id' ? 'Indonesian' : l.charAt(0).toUpperCase() + l.slice(1)}</option>
                ))}
            </select>

            <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={`bg-secondary text-white px-3 py-2 rounded-md text-sm font-medium border border-secondary-content focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
            >
                {['IDR', 'USD', 'EUR'].map(c => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>
        </>
    );

    return (
        <nav className="bg-primary shadow-lg fixed top-0 z-50 w-full">
            <div className="max-w-6xl mx-auto px-4 backdrop-blur-lg">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/user/all/property" className="text-xl font-bold text-accent hover:text-accent-dark transition-colors">
                        Eluma
                    </Link>

                    {/* Desktop View */}
                    <div className="hidden md:flex items-center gap-4">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? "bg-secondary text-white shadow-md" : "text-white hover:bg-secondary"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                        <Selectors />
                        <button onClick={logout} className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-error-content bg-error bg-opacity-70 hover:bg-red-700 transition-colors">
                            Logout
                        </button>
                    </div>

                    {/* Mobile View Controls */}
                    <div className="md:hidden flex items-center gap-2">
                        <Selectors />
                        <button onClick={logout} className="p-2 rounded-md text-error-content bg-error bg-opacity-70 hover:bg-red-700">
                            <LogoutIcon />
                        </button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-white hover:bg-secondary rounded-md" aria-label="Toggle menu">
                            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive ? "text-primary bg-accent-light" : "text-gray-700 hover:bg-accent-light"
                                    }`
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                        <button
                            onClick={() => { logout(); setIsMenuOpen(false); }}
                            className="block w-full px-3 py-2 rounded-md text-base font-medium text-error-content bg-error bg-opacity-70 text-center"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

// Simple Icon Components for cleaner JSX
const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
    </svg>
);

const MenuIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CloseIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export default NavbarUsers;
