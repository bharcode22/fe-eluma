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
  ShieldCheck,
  Package,
  Layers
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
      icon: LayoutDashboard
    },
    {
      path: "/admin/property-management",
      label: "Property",
      icon: Home
    },
    {
      path: "/admin/users-management",
      label: "Users Management",
      icon: Users
    },
    {
      path: "/admin/property-owner-management",
      label: "Property Owners",
      icon: UserCog
    },
    {
      path: "/admin/contact",
      label: "Contact Management",
      icon: Mail
    },
    {
      path: "/admin/service-management",
      label: "Service Management",
      icon: Settings
    },
    {
      path: "/admin/additional-management",
      label: "Additional Management",
      icon: FolderPlus
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col bg-base-100/95 backdrop-blur-md border-r border-base-300 shadow-sm transition-all duration-300 fixed left-0 top-0 h-full z-40 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Logo Section */}
        <div className="p-4 border-b border-base-300">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 group ${isCollapsed ? 'justify-center' : ''}`}
          >
            <div className="p-2.5 bg-gradient-to-br from-primary to-primary/70 rounded-xl shadow-md group-hover:scale-105 transition-transform">
              <Building className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Eluma Admin
                </span>
                <span className="text-xs text-base-content/60 font-medium">Control Center</span>
              </div>
            )}
          </Link>
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <div className="mx-3 my-4 p-3 bg-gradient-to-r from-primary/5 to-secondary/5 border border-base-300/60 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-md">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-base-content truncate">Admin Panel</p>
                <span className="inline-block px-2 py-0.5 text-xs font-semibold text-primary bg-primary/10 rounded-full capitalize">
                  {userRole || 'Administrator'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-grow overflow-y-auto px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20 font-semibold'
                    : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-base-content/70'}`} />
                    {!isCollapsed && (
                      <>
                        <span>{item.label}</span>
                        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                      </>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-3 border-t border-base-300 space-y-2">
          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors"
          >
            <div className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
              <ChevronRight className="w-4 h-4" />
            </div>
            {!isCollapsed && <span>Collapse Sidebar</span>}
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-error bg-error/10 hover:bg-error/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-base-100/90 backdrop-blur-md border-b border-base-300 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-base-content bg-base-200 hover:bg-base-300 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2"
            >
              <div className="p-1.5 bg-primary rounded-lg text-white">
                <Building size={18} />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Eluma Admin
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={logout}
              className="p-2 rounded-xl text-error bg-error/10 hover:bg-error/20 transition-colors"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-base-100/95 backdrop-blur-md pt-16">
          <div className="h-full overflow-y-auto p-4 space-y-4">
            {/* User Info */}
            <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-base-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white shadow-md">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-base font-bold text-base-content">Admin Panel</p>
                  <p className="text-xs text-base-content/60 capitalize">{userRole || 'Administrator'}</p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive
                        ? 'bg-primary text-white shadow-md font-semibold'
                        : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="pt-4 border-t border-base-300">
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-error/10 hover:bg-error/20 font-semibold text-error rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area Adjuster */}
      <div className={`flex-1 min-h-screen transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} md:pt-0 pt-16`}>
      </div>
    </>
  );
}