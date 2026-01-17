import React, { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
    Home,
    Building,
    Briefcase,
    Heart,
    Plus,
    LogOut,
    User,
    Settings,
    Globe,
    DollarSign,
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    Sparkles,
    Sun,
    Moon,
    History,
    Package,
    MessageSquare,
    HelpCircle,
} from 'lucide-react';
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useCurrency } from "../context/CurrencyContext";

const NavbarUsers = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [hasNotifications, setHasNotifications] = useState(true);
    const navigate = useNavigate();
    
    const { setIsAuthenticated, setUserRole } = useContext(AuthContext);
    const { lang, setLang } = useLanguage();
    const { currency, setCurrency } = useCurrency();

    const handleLanguageChange = (e) => setLang(e.target.value);
    const handleCurrencyChange = (e) => setCurrency(e.target.value);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    const clearNotifications = () => setHasNotifications(false);

    const logout = () => {
        Cookies.remove("token");
        Cookies.remove("user");
        setIsAuthenticated(false);
        setUserRole(null);
        navigate("/", { replace: true });
    };

    const navItems = [
        { path: "/user/all/property", label: "Properties", icon: Building },
        { path: "/user/service", label: "Services", icon: Briefcase },
        { path: "/user/home", label: "Public Properties", icon: Home },
        { path: "/user/private/property", label: "My Properties", icon: Package },
        { path: "/user/saved/property", icon: Heart },
        // { path: "/user/add/property", icon: Plus },
    ];

    const userMenuItems = [
        { label: "My Profile", icon: User, path: "/user/profile" },
        { label: "Settings", icon: Settings, path: "/user/settings" },
        { label: "Booking History", icon: History, path: "/user/bookings" },
        { label: "Messages", icon: MessageSquare, path: "/user/messages" },
        { label: "Help Center", icon: HelpCircle, path: "/user/help" },
    ];

    const LanguageSelector = ({ value, onChange, className = '' }) => {
        const languages = [
            { code: 'en', name: 'English', flag: '🇺🇸' },
            { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
            { code: 'fr', name: 'French', flag: '🇫🇷' },
            { code: 'de', name: 'German', flag: '🇩🇪' },
            { code: 'es', name: 'Spanish', flag: '🇪🇸' }
        ];

        const selectedLang = languages.find(l => l.code === value);

        return (
            <div className={`relative group ${className}`}>
                <button className="flex items-center gap-2 px-3 py-2 bg-base-100 hover:bg-base-200 rounded-lg text-base-content transition-colors border border-base-300 min-w-[120px]">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">{selectedLang?.flag} {selectedLang?.name}</span>
                    <ChevronDown className="w-3 h-3 ml-auto" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-full bg-base-100 border border-base-300 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {languages.map(l => (
                        <button
                            key={l.code}
                            onClick={() => onChange({ target: { value: l.code } })}
                            className={`flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-base-200 transition-colors ${value === l.code ? 'bg-primary/10 text-primary' : 'text-base-content'}`}
                        >
                            <span className="text-lg">{l.flag}</span>
                            <span className="text-sm">{l.name}</span>
                            {value === l.code && <Sparkles className="w-3 h-3 ml-auto text-primary" />}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const CurrencySelector = ({ value, onChange, className = '' }) => {
        const currencies = [
            { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
            { code: 'USD', symbol: '$', name: 'US Dollar' },
            { code: 'EUR', symbol: '€', name: 'Euro' },
            { code: 'GBP', symbol: '£', name: 'British Pound' },
            { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
        ];

        const selectedCurrency = currencies.find(c => c.code === value);

        return (
            <div className={`relative group ${className}`}>
                <button className="flex items-center gap-2 px-3 py-2 bg-base-100 hover:bg-base-200 rounded-lg text-base-content transition-colors border border-base-300 min-w-[100px]">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-medium">{selectedCurrency?.code}</span>
                    <ChevronDown className="w-3 h-3 ml-auto" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-full bg-base-100 border border-base-300 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {currencies.map(c => (
                        <button
                            key={c.code}
                            onClick={() => onChange({ target: { value: c.code } })}
                            className={`flex items-center justify-between w-full px-3 py-2 text-left hover:bg-base-200 transition-colors ${value === c.code ? 'bg-primary/10 text-primary' : 'text-base-content'}`}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{c.code}</span>
                                <span className="text-xs text-base-content/60">{c.symbol}</span>
                            </div>
                            <span className="text-xs text-base-content/60">{c.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const NavItem = ({ path, label, icon: Icon, onClick, isCTA = false, isMobile = false }) => (
        <NavLink
            to={path}
            className={({ isActive }) =>
                `group flex items-center gap-2 ${isMobile ? 'px-4 py-3 text-base' : 'px-3 py-2 text-sm'} rounded-lg font-medium transition-all ${isActive
                    ? isCTA ? 'bg-secondary text-secondary-content shadow-md' : 'bg-primary text-primary-content shadow-md'
                    : isCTA ? 'bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary hover:to-secondary text-white shadow-md hover:shadow-lg' : 'text-base-content hover:bg-base-200 hover:text-base-content hover:shadow-sm'
                }`
            }
            onClick={onClick}
        >
            {Icon && <Icon className={`w-4 h-4 ${isCTA ? '' : ''}`} />}
            <span>{label}</span>
            {!isCTA && !isMobile && (
                <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
        </NavLink>
    );

    const closeMenu = () => setIsMenuOpen(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const ThemeToggle = () => (
        <button
            type="button"
            onClick={toggleDarkMode}
            className="inline-flex items-center justify-center p-2 rounded-lg bg-base-100 hover:bg-base-200 text-base-content border border-base-300 transition-colors"
            aria-label="Toggle theme"
        >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
    );

    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-base-100/90 backdrop-blur-md border-b border-base-300 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link to="/user/all/property" className="flex items-center gap-2 group">
                                <div className="p-2 bg-gradient-to-br from-primary to-primary/70 rounded-lg">
                                    <Home className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                                        Eluma
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                {navItems.map((item) => (
                                    <div key={item.path} className="group">
                                        <NavItem 
                                            path={item.path} 
                                            label={item.label} 
                                            icon={item.icon}
                                            isCTA={item.isCTA}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Desktop Controls */}
                        <div className="hidden lg:flex items-center gap-3">
                            
                            {/* Language & Currency */}
                            <div className="flex items-center gap-2">
                                <LanguageSelector value={lang} onChange={handleLanguageChange} />
                                <CurrencySelector value={currency} onChange={handleCurrencyChange} />
                            </div>
                            
                            {/* User Menu */}
                            <div className="relative group">
                                <button 
                                    className="flex items-center gap-2 px-3 py-2 bg-base-200 hover:bg-base-300 rounded-lg transition-colors"
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <ChevronDown className="w-3 h-3" />
                                </button>
                                
                                {/* User Dropdown */}
                                {isUserMenuOpen && (
                                    <div className="absolute top-full right-0 mt-1 w-64 bg-base-100 border border-base-300 rounded-lg shadow-xl z-50">
                                        <div className="p-4 border-b border-base-300">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-base-content">John Doe</div>
                                                    <div className="text-sm text-base-content/60">john@example.com</div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="p-2">
                                            {userMenuItems.map((item, index) => (
                                                <Link
                                                    key={index}
                                                    to={item.path}
                                                    className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-base-200 transition-colors rounded-lg"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <item.icon className="w-4 h-4 text-base-content/70" />
                                                    <span className="text-sm">{item.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                        
                                        <div className="p-2 border-t border-base-300">
                                            <button
                                                onClick={logout}
                                                className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-base-200 hover:bg-base-300 font-medium text-base-content rounded-lg transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Controls */}
                        <div className="flex lg:hidden items-center gap-2">
                            <button
                                onClick={logout}
                                className="inline-flex items-center justify-center p-2 rounded-lg bg-base-100 hover:bg-base-200 text-base-content border border-base-300 transition-colors"
                                aria-label="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center p-2 rounded-lg bg-base-100 hover:bg-base-200 text-base-content border border-base-300 transition-colors"
                                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                            >
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="h-16" />

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-base-100/95 backdrop-blur-sm pt-16">
                    <div className="h-full overflow-y-auto">
                        <div className="px-4 py-4 space-y-1">
                            {/* User Info */}
                            <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-base-content">John Doe</div>
                                        <div className="text-xs text-base-content/60">john@example.com</div>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            {navItems.map((item) => (
                                <NavItem
                                    key={item.path}
                                    path={item.path}
                                    label={item.label}
                                    icon={item.icon}
                                    onClick={closeMenu}
                                    isCTA={item.isCTA}
                                    isMobile={true}
                                />
                            ))}

                            {/* Settings Section */}
                            <div className="px-4 py-4 space-y-3 border-t border-base-300">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-base-content">Language</span>
                                    <LanguageSelector value={lang} onChange={handleLanguageChange} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-base-content">Currency</span>
                                    <CurrencySelector value={currency} onChange={handleCurrencyChange} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-base-content">Theme</span>
                                    <ThemeToggle />
                                </div>
                            </div>

                            {/* User Menu */}
                            <div className="px-4 py-4 space-y-2 border-t border-base-300">
                                <div className="text-sm font-medium text-base-content/70 mb-2">Account</div>
                                {userMenuItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.path}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-base-200 transition-colors rounded-lg"
                                        onClick={closeMenu}
                                    >
                                        <item.icon className="w-4 h-4 text-base-content/70" />
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* Logout */}
                            <div className="px-4 py-4 border-t border-base-300">
                                <button
                                    onClick={() => {
                                        logout();
                                        closeMenu();
                                    }}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-error/10 hover:bg-error/20 font-medium text-error rounded-lg transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NavbarUsers;