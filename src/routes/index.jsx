import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../views/home/index.jsx";
import Register from "../views/auth/Register.jsx";
import Login from "../views/auth/Login.jsx";

// halaman admin
import Dashboard from "../views/admin/dashboard/index.jsx"

// halaman user
import HomeUsers from "../views/user/home/index.jsx"

export default function AppRoutes() {
    const { isAuthenticated, userRole } = useContext(AuthContext);

    return (
        <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/register" element={
                isAuthenticated ? <Navigate to={userRole === 'admin' ? "/admin/dashboard" : "/user/home"} replace /> : <Register />
            } />

            <Route path="/login" element={
                isAuthenticated ? <Navigate to={userRole === 'admin' ? "/admin/dashboard" : "/user/home"} replace /> : <Login />
            } />

            {/* admin */}
            <Route path="/admin/dashboard" element={
                isAuthenticated && userRole === 'admin' ? <Dashboard /> : <Navigate to="/login" replace />
            } />

            {/* user */}
            <Route path="/user/home" element={
                isAuthenticated && userRole === 'user' ? <HomeUsers /> : <Navigate to="/login" replace />
            } />
        </Routes>
    );
}
