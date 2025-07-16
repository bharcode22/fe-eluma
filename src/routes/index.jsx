import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../views/home/index.jsx";
import DetailPropertyLandingPage from "../views/landingPageDetailProperty/landingPageDetailPrperty.jsx";

// halaman admin
import Dashboard from "../views/admin/dashboard/index.jsx"

// halaman user
import HomeUsers from "../views/user/home/index.jsx"
import AddProperty from "../views/getMyPeopery/AddNewProperty.jsx"

export default function AppRoutes() {
    const { isAuthenticated, userRole } = useContext(AuthContext);
    return (
        <Routes>
            {/* landing page */}
            <Route path="/" element={<Home />} />
            <Route path="/detail/:id" element={<DetailPropertyLandingPage />} />

            {/* admin */}
            <Route path="/admin/home" element={
                isAuthenticated && userRole === 'admin' ? <Dashboard /> : <Navigate to="/" replace />
            } />

            {/* user */}
            <Route path="/user/home" element={
                isAuthenticated && userRole === 'user' ? <HomeUsers /> : <Navigate to="/" replace />
            } />
            <Route path="/user/add/property" element={
                isAuthenticated && userRole === 'user' ? <AddProperty /> : <Navigate to="/" replace />
            } />
        </Routes>
    );
}
