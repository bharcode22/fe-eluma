import React, { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from "../context/AuthContext";

export default function NavbarAdmin() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { setIsAuthenticated, setUserRole } = useContext(AuthContext);

    const logout = () => {
        Cookies.remove("token");
        Cookies.remove("user");
        setIsAuthenticated(false);
        setUserRole(null);
        navigate("/");
    };

    const navItems = [
        { path: "/admin/dashboard", label: "Dashboard" },
        { path: "/admin/property-management", label: "Properti Management" },
        { path: "/admin/users-management", label: "Users Management" },
        { path: "/admin/property-owner-management", label: "Property Owner Management" },
        { path: "/admin/additional-management", label: "Additional Management" },
        { path: "/admin/service-management", label: "Service Management" },
    ];

    return (
        <div className="flex h-screen">
            {/* Sidebar Navigation */}
            <nav className="bg-primary/50 shadow-lg fixed left-0 top-0 h-full z-50 w-64 flex flex-col">
                {/* Logo */}
                <div className="p-4 border-b border-primary-focus">
                    <Link
                        to="/admin/dashboard"
                        className="text-xl font-bold text-accent hover:text-accent-dark transition-colors flex items-center"
                    >
                        Eluma Admin
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="flex-grow overflow-y-auto py-4">
                    <div className="px-2 space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-secondary text-white shadow-md"
                                            : "text-white hover:bg-secondary hover:text-white hover:shadow-md"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </div>

                {/* logout button */}
                <div className="p-4 border-t border-primary-focus">
                    <div className="space-y-3">
                        {/* Logout Button */}
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium text-error-content bg-error bg-opacity-70 hover:bg-red-700 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>

            </nav>

            {/* Mobile Toggle Button - Fixed at the top left corner */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-white bg-primary hover:text-accent hover:bg-secondary focus:outline-none transition-colors"
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

            {/* Mobile Sidebar - Slide in from left */}
            <div className={`md:hidden fixed inset-0 z-40 transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}>
                {/* Overlay */}
                <div 
                    className="absolute inset-0 bg-black bg-opacity-50"
                    onClick={() => setIsMenuOpen(false)}
                ></div>
                
                {/* Sidebar Content */}
                <div className="relative bg-primary w-64 h-full overflow-y-auto">
                    {/* Logo */}
                    <div className="p-4 border-b border-primary-focus">
                        <Link
                            to="/admin/dashboard"
                            className="text-xl font-bold text-accent hover:text-accent-dark transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Eluma Admin
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="px-2 py-4 space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-secondary text-white shadow-md"
                                            : "text-white hover:bg-secondary hover:text-white hover:shadow-md"
                                    }`
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-primary-focus">
                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    logout();
                                    setIsMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium text-error-content bg-error bg-opacity-70 hover:bg-red-700 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Add padding to account for sidebar */}
            <div className="flex-1 ml-64 md:ml-64">
                {/* Your page content goes here */}
            </div>
        </div>
    );
}