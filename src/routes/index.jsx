import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Routes, Route, Navigate } from "react-router-dom";

// Landing Page
import Home from "../views/landingPAge/home/Home.jsx";
import DetailPropertyLandingPage from "../views/landingPAge/components/landingPageDetailPrperty.jsx";
import Contact from "../views/landingPAge/Contact/Contact.jsx";
import About from "../views/landingPAge/About/About.jsx";

// halaman admin
import Dashboard from "../views/admin/dashboard/index.jsx"

// halaman user
import HomeUsers from "../views/user/HomeUser.jsx"
import AddProperty from "../views/user/propertyManagement/addProperty/index.jsx"

export default function AppRoutes() {
    const { isAuthenticated, userRole } = useContext(AuthContext);
    return (
        <Routes>
            {/* landing page */}
            <Route path="/" element={<Home />} />
            <Route path="/detail/:id" element={<DetailPropertyLandingPage />} />
            <Route path="/about" element={ <About />} />
            <Route path="/contact" element={<Contact />} />

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
