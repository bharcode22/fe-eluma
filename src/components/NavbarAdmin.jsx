import React, { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from "../context/AuthContext";
import {
  LayoutDashboard,
  Home,
  Users,
  UserCog,
  Mail,
  Settings,
  FolderPlus,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Building,
  Briefcase,
  Contact
} from "lucide-react";

export default function NavbarAdmin() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserRole, userRole } = useContext(AuthContext);

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/");
  };

  const navItems = [
    { 
      path: "/admin/dashboard", 
      label: "Dashboard", 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      path: "/admin/property-management", 
      label: "Property Management", 
      icon: <Home size={20} /> 
    },
    { 
      path: "/admin/users-management", 
      label: "Users Management", 
      icon: <Users size={20} /> 
    },
    { 
      path: "/admin/property-owner-management", 
      label: "Property Owners", 
      icon: <UserCog size={20} /> 
    },
    { 
      path: "/admin/contact", 
      label: "Contact Management", 
      icon: <Mail size={20} /> 
    },
    { 
      path: "/admin/service-management", 
      label: "Service Management", 
      icon: <Settings size={20} /> 
    },
    { 
      path: "/admin/additional-management", 
      label: "Additional Management", 
      icon: <FolderPlus size={20} /> 
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col bg-gradient-to-b from-primary to-primary-dark shadow-xl transition-all duration-300 fixed left-0 top-0 h-full z-40 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Logo Section */}
        <div className="p-4 border-b border-primary-focus/30">
          <Link
            to="/admin/dashboard"
            className={`text-xl font-bold text-accent hover:text-accent-light transition-colors flex items-center ${isCollapsed ? 'justify-center' : ''}`}
          >
            {isCollapsed ? (
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EA</span>
              </div>
            ) : (
              <>
                <Building className="mr-2" size={24} />
                <span>Eluma Admin</span>
              </>
            )}
          </Link>
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-b border-primary-focus/20 bg-primary/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <UserCog size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin Panel</p>
                <p className="text-xs text-white/70 truncate capitalize">{userRole || 'Administrator'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-grow overflow-y-auto py-4">
          <div className="px-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex items-center px-3 py-3 rounded-lg mx-2 text-sm font-medium transition-all group"
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`transition-transform ${isActive ? 'scale-110' : ''} ${isActive
                        ? 'text-white'
                        : 'text-white/80 group-hover:text-white'
                      }`}
                    >
                      {item.icon}
                    </div>

                    {!isCollapsed && (
                      <>
                        <span className="ml-3">{item.label}</span>
                        {isActive && <ChevronRight className="ml-auto" size={16} />}
                      </>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-primary-focus/30 space-y-3">
          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <div className={`transition-transform ${isCollapsed ? 'rotate-180' : ''}`}>
              <ChevronRight size={20} />
            </div>
            {!isCollapsed && <span className="ml-2">Collapse Sidebar</span>}
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-3 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-error to-error/80 hover:from-error/90 hover:to-error/70 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-primary-dark shadow-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link
              to="/admin/dashboard"
              className="text-xl font-bold text-accent flex items-center"
            >
              <Building className="mr-2" size={24} />
              Eluma Admin
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <UserCog size={16} className="text-white" />
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-white hover:bg-error/20 transition-colors"
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div className={`md:hidden fixed inset-0 z-40 transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}>
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        ></div>
        
        {/* Sidebar Content */}
        <div className="relative bg-gradient-to-b from-primary to-primary-dark w-64 h-full overflow-y-auto shadow-2xl">
          {/* User Info */}
          <div className="p-6 border-b border-primary-focus/30 bg-primary/50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-lg">
                <UserCog size={24} className="text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Admin Panel</p>
                <p className="text-sm text-white/70 capitalize">{userRole || 'Administrator'}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="flex items-center px-4 py-4 rounded-xl text-base font-medium transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={`transition-transform ${isActive ? 'scale-110' : ''} ${isActive
                          ? 'text-white'
                          : 'text-white/80'
                        }`}
                      >
                        {item.icon}
                      </div>
                      <span className="ml-3">{item.label}</span>
                      {isActive && <ChevronRight className="ml-auto" size={18} />}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center justify-center px-6 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-error to-error/80 hover:from-error/90 hover:to-error/70 shadow-lg hover:shadow-xl transition-all"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 min-h-screen transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} md:pt-0 pt-16`}>
        {/* Your page content goes here */}
      </div>
    </>
  );
}