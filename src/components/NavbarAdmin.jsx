import { useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import Cookies from 'js-cookie';
import { AuthContext } from '../context/AuthContext';

export default function NavbarAdmin() {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useContext(AuthContext);

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        setIsAuthenticated(false);
        window.location.href = "/";
    };

    return (
        <div>
            <button onClick={logout} className="btn btn-outline px-4" >
                Logout
            </button>
        </div>
    );
}