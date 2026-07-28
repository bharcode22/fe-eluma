import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
    Globe,
    DollarSign,
    Menu,
    X,
    Home,
    Building2,
    Info,
    Phone,
    LogIn,
    UserPlus,
    User,
    Heart,
    ChevronDown,
    Settings,
    HelpCircle,
    Shield,
    Sparkles,
    LogOut
} from 'lucide-react';
import LoginModal from '../../src/views/auth/LoginModal';
import RegisterModal from '../../src/views/auth/RegisterModal';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { AuthContext } from '../context/AuthContext';

// ==================== Sub-Components ====================

const LanguageSelector = ({ value, onChange, className = '' }) => {
    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
        { code: 'fr', name: 'French', flag: '🇫🇷' },
        { code: 'de', name: 'German', flag: '🇩🇪' },
        { code: 'es', name: 'Spanish', flag: '🇪🇸' }
    ];

    const selectedLang = languages.find(lang => lang.code === value);

    return (
        <div className={`relative group ${className}`}>
            <button className="flex items-center gap-2 px-3 py-2 bg-base-100 hover:bg-base-200 rounded-lg text-base-content transition-colors border border-base-300 min-w-[120px]">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{selectedLang?.flag} {selectedLang?.name}</span>
                <ChevronDown className="w-3 h-3 ml-auto opacity-60" />
            </button>
            <div className="absolute top-full right-0 sm:left-0 mt-1 w-full bg-base-100 border border-base-300 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {languages.map(lang => (
                    <button
                        key={lang.code}
                        onClick={() => onChange({ target: { value: lang.code } })}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-base-200 transition-colors ${value === lang.code ? 'bg-primary/10 text-primary' : 'text-base-content'
                            }`}
                    >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-sm">{lang.name}</span>
                        {value === lang.code && <Sparkles className="w-3 h-3 ml-auto text-primary" />}
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

    const selectedCurrency = currencies.find(curr => curr.code === value);

    return (
        <div className={`relative group ${className}`}>
            <button className="flex items-center gap-2 px-3 py-2 bg-base-100 hover:bg-base-200 rounded-lg text-base-content transition-colors border border-base-300 min-w-[90px]">
                <DollarSign className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">{selectedCurrency?.code}</span>
                <ChevronDown className="w-3 h-3 ml-auto opacity-60" />
            </button>
            <div className="absolute top-full right-0 sm:left-0 mt-1 w-full bg-base-100 border border-base-300 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {currencies.map(curr => (
                    <button
                        key={curr.code}
                        onClick={() => onChange({ target: { value: curr.code } })}
                        className={`flex items-center justify-between w-full px-3 py-2 text-left hover:bg-base-200 transition-colors ${value === curr.code ? 'bg-primary/10 text-primary' : 'text-base-content'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{curr.code}</span>
                            <span className="text-xs text-base-content/60">{curr.symbol}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

const MobileMenuButton = ({ isOpen, onClick }) => (
    <button
        onClick={onClick}
        className="inline-flex items-center justify-center p-2 rounded-lg bg-base-100 hover:bg-base-200 text-base-content border border-base-300 transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
    >
        {isOpen ? (
            <X className="w-5 h-5 text-base-content" />
        ) : (
            <Menu className="w-5 h-5 text-base-content" />
        )}
    </button>
);

const NavItem = ({ path, label, icon: Icon, onClick, isMobile = false }) => (
    <NavLink
        to={path}
        className={({ isActive }) =>
            `flex items-center gap-2 ${isMobile ? 'px-4 py-3 text-base' : 'px-3 py-2 text-sm'
            } rounded-lg font-medium transition-all ${isActive
                ? 'bg-primary text-primary-content shadow-md'
                : 'text-base-content hover:bg-base-200 hover:text-base-content hover:shadow-sm'
            }`
        }
        onClick={onClick}
    >
        {Icon && <Icon className="w-4 h-4" />}
        <span>{label}</span>
    </NavLink>
);

// ==================== Main Component ====================

function NavbarLandingPage() {
    // State Management
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Auth Context
    const authCtx = useContext(AuthContext);
    const isAuthenticated = authCtx?.isAuthenticated || false;
    const user = authCtx?.user || null;
    const logout = authCtx?.logout || (() => { });

    // Context
    const { lang, setLang } = useLanguage();
    const { currency, setCurrency } = useCurrency();

    // Navigation Items
    const navItems = [
        { path: '/', label: 'Properties', icon: Home },
        { path: '/service', label: 'Services', icon: Building2 },
        { path: '/about', label: 'About', icon: Info },
        { path: '/contact', label: 'Contact', icon: Phone }
    ];

    // User Menu Items
    const userMenuItems = [
        { label: 'My Profile', icon: User, path: '/user/profile' },
        { label: 'Favorites', icon: Heart, path: '/user/saved/property' },
    ];

    // Event Handlers
    const handleLanguageChange = (e) => setLang(e.target.value);
    const handleCurrencyChange = (e) => setCurrency(e.target.value);

    const handleOpenRegister = () => {
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(true);
    };

    const handleOpenLogin = () => {
        setIsRegisterModalOpen(false);
        setIsLoginModalOpen(true);
    };

    const handleLoginSuccess = () => {
        setIsLoginModalOpen(false);
    };

    const handleRegisterSuccess = () => {
        setIsRegisterModalOpen(false);
    };

    const closeMenu = () => setIsMenuOpen(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // ==================== Render ====================
    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-base-100/90 backdrop-blur-md border-b border-base-300 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link
                                to="/"
                                className="flex items-center gap-2 group"
                            >
                                <div className="p-2 bg-gradient-to-br from-primary to-primary/70 rounded-lg">
                                    <Home className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                                    Eluma
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                {navItems.map((item) => (
                                    <NavItem
                                        key={item.path}
                                        path={item.path}
                                        label={item.label}
                                        icon={item.icon}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Desktop Controls */}
                        <div className="hidden lg:flex items-center gap-2">
                            {/* Language & Currency */}
                            <div className="flex items-center gap-2">
                                <LanguageSelector value={lang} onChange={handleLanguageChange} />
                                <CurrencySelector value={currency} onChange={handleCurrencyChange} />
                            </div>

                            {/* Auth Buttons / Profile Dropdown */}
                            {!isAuthenticated ? (
                                <div className="flex items-center gap-2 ml-4">
                                    <button
                                        onClick={() => setIsLoginModalOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-base-200 hover:bg-base-300 font-medium text-base-content rounded-lg transition-colors"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => setIsRegisterModalOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 font-medium text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Sign Up
                                    </button>
                                </div>
                            ) : (
                                <div className="relative group ml-4">
                                    <button className="flex items-center gap-2 px-3 py-2 bg-base-200 hover:bg-base-300 rounded-lg transition-colors">
                                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                                            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                                        </div>
                                        <span className="text-sm font-medium text-base-content max-w-[120px] truncate">
                                            {user?.name || user?.username || 'My Account'}
                                        </span>
                                        <ChevronDown className="w-3 h-3 opacity-60" />
                                    </button>
                                    <div className="absolute top-full right-0 mt-1 w-48 bg-base-100 border border-base-300 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        {userMenuItems.map((item, index) => (
                                            <Link
                                                key={index}
                                                to={item.path}
                                                className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-base-200 transition-colors border-b border-base-300 text-sm text-base-content"
                                            >
                                                <item.icon className="w-4 h-4 text-base-content/70" />
                                                <span>{item.label}</span>
                                            </Link>
                                        ))}
                                        <button
                                            onClick={logout}
                                            className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-error/10 text-error transition-colors text-sm font-medium"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Controls Button */}
                        <div className="flex lg:hidden items-center gap-2">
                            <MobileMenuButton isOpen={isMenuOpen} onClick={toggleMenu} />
                        </div>
                    </div>
                </div>
            </nav>
            <div className="h-16" />

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-base-100/95 backdrop-blur-sm pt-16">
                    <div className="h-full overflow-y-auto">
                        <div className="px-4 py-4 space-y-3">
                            {/* Mobile Navigation Links */}
                            <div className="space-y-1">
                                {navItems.map((item) => (
                                    <NavItem
                                        key={item.path}
                                        path={item.path}
                                        label={item.label}
                                        icon={item.icon}
                                        onClick={closeMenu}
                                        isMobile={true}
                                    />
                                ))}
                            </div>

                            {/* Mobile User Menu if Logged In */}
                            {isAuthenticated && (
                                <div className="py-3 border-t border-base-300 space-y-1">
                                    <div className="flex items-center gap-3 px-4 py-2 mb-2 bg-base-200/60 rounded-xl">
                                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                                            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                                        </div>
                                        <div className="truncate">
                                            <div className="font-medium text-base-content truncate">{user?.name || user?.username || 'User'}</div>
                                            <div className="text-xs text-base-content/60 truncate">{user?.email || 'Logged In'}</div>
                                        </div>
                                    </div>
                                    {userMenuItems.map((item, index) => (
                                        <Link
                                            key={index}
                                            to={item.path}
                                            onClick={closeMenu}
                                            className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-base-200 transition-colors rounded-lg text-sm text-base-content font-medium"
                                        >
                                            <item.icon className="w-4 h-4 text-base-content/70" />
                                            <span>{item.label}</span>
                                        </Link>
                                    ))}
                                    <button
                                        onClick={() => {
                                            logout();
                                            closeMenu();
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-error/10 text-error transition-colors rounded-lg text-sm font-medium"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}

                            {/* Mobile Auth Buttons if Not Logged In */}
                            {!isAuthenticated && (
                                <div className="py-3 space-y-2 border-t border-base-300">
                                    <button
                                        onClick={() => {
                                            setIsLoginModalOpen(true);
                                            closeMenu();
                                        }}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-base-200 hover:bg-base-300 font-medium text-base-content rounded-xl transition-colors"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsRegisterModalOpen(true);
                                            closeMenu();
                                        }}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 font-medium text-white rounded-xl transition-all shadow-md"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Sign Up
                                    </button>
                                </div>
                            )}

                            {/* Mobile Language & Currency Selector (Matching Desktop) */}
                            <div className="py-3 space-y-3 border-t border-base-300">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-base-content/70">Language</span>
                                    <LanguageSelector value={lang} onChange={handleLanguageChange} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-base-content/70">Currency</span>
                                    <CurrencySelector value={currency} onChange={handleCurrencyChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onRegisterClick={handleOpenRegister}
                onSuccess={handleLoginSuccess}
            />

            <RegisterModal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
                onLoginClick={handleOpenLogin}
                onSuccess={handleRegisterSuccess}
            />
        </>
    );
}

export default NavbarLandingPage;