import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import Cookies from 'js-cookie';
import { AuthContext } from '../context/AuthContext';
import dahsboard from '../assets/svg/dashboard.svg'

export default function SidebarMenu() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setIsAuthenticated } = useContext(AuthContext);

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
    };

    return (
        <div>
            <a onClick={logout} style={{ cursor: 'pointer' }} className="btn btn-outline px-4">Logout</a>
        </div>
    );
}
