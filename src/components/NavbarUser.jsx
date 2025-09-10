import React, { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from "../context/AuthContext";
import add from "../assets/svg/add.svg";
import { useLanguage } from "../context/LanguageContext";

function NavbarUsers() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { setIsAuthenticated, setUserRole } = useContext(AuthContext);

    const { lang, setLang } = useLanguage();

    const handleChange = (e) => {
        setLang(e.target.value);
    };

    const logout = () => {
        Cookies.remove("token");
        Cookies.remove("user");
        setIsAuthenticated(false);
        setUserRole(null);
        navigate("/");
    };

    const navItems = [
        { path: "/user/all/property", label: "All Property" },
        { path: "/user/home", label: "My Public Property" },
        { path: "/user/private/property", label: "My Private Property" },
        { path: "/user/saved/property", label: "Saved Property" },
        { path: "/user/add/property", label: <img src={add} className="w-7 h-7" /> },
    ];

    return (
        <nav className="bg-primary shadow-lg fixed top-0 z-50 w-full">
            <div className="max-w-6xl mx-auto px-4 backdrop-blur-lg">
                <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link
                    to="/user/all/property"
                    className="text-xl font-bold text-accent hover:text-accent-dark transition-colors"
                    >
                    Eluma
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="flex items-center gap-6">
                    {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                        `hidden md:flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            isActive
                            ? "bg-secondary text-white shadow-md"
                            : "text-white hover:bg-secondary hover:text-white hover:shadow-md"
                        }`
                        }
                    >
                        {item.label}
                    </NavLink>
                    ))}

                    <select value={lang} onChange={handleChange}>
                        <option value="en">English</option>
                        <option value="id">Indonesian</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="es">Spanish</option>
                    </select>

                    {/* Logout Button - Desktop */}
                    <button
                    onClick={logout}
                    className="hidden md:flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                    Logout
                    </button>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center gap-2">
                    <select value={lang} onChange={handleChange}>
                        <option value="en">English</option>
                        <option value="id">Indonesian</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="es">Spanish</option>
                    </select>

                    <button
                    onClick={logout}
                    className="md:hidden p-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clipRule="evenodd"
                        />
                    </svg>
                    </button>
                    <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-accent hover:bg-secondary focus:outline-none transition-colors"
                    aria-label="Toggle menu"
                    >
                    <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        {isMenuOpen ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                        ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
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
                                ? "text-primary bg-accent-light"
                                : "text-gray-700 hover:text-primary hover:bg-accent-light"
                            }`
                            }
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.label}
                        </NavLink>
                        ))}

                        {/* Logout Button - Mobile */}
                        <button
                            onClick={() => {
                                logout();
                                setIsMenuOpen(false);
                            }}
                            className="block w-full px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700 transition-colors text-center"
                            >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default NavbarUsers;
