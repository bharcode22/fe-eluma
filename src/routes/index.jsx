import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Routes, Route, Navigate } from "react-router-dom";

// Landing Page
import Home from "../views/landingPAge/home/Home.jsx";
import DetailPropertyLandingPage from "../views/landingPAge/components/landingPageDetailPrperty.jsx";
import ServicePage from "../views/landingPAge/Service/servicePage.jsx";
import Contact from "../views/landingPAge/Contact/Contact.jsx";
import About from "../views/landingPAge/About/About.jsx";

// halaman admin
// dashboard
import Dashboard from "../views/admin/dashboard/index.jsx"

// property management
import PropertyManagement from "../views/admin/propertyManagement/index.jsx"
import UpdatePropertyPage from "../views/admin/propertyManagement/updateProperty/updatePropertyPage.jsx"
import DetailPropertyPage from "../views/admin/propertyManagement/detailProperty/detailPropertyPage.jsx"
import AddPropertyPage from "../views/admin/propertyManagement/addProperty/addPropertyPage.jsx"
import UpdateImagesOnly from "../views/admin/propertyManagement/updateProperty/UpdateImagesOnly.jsx"

// users management
import UsersManagement from "../views/admin/usersManagement/index.jsx"
import DetailUserPage from "../views/admin/usersManagement/detailUser/detailUserPage.jsx"
import UpdateUserPage from "../views/admin/usersManagement/updateUser/updateUserPage.jsx"
// property owner management
import PropertyOwnerManagement from "../views/admin/property-owner-management/index.jsx"
// contact management
import ContactMabagement from "../views/admin/contact/index.jsx"
import AddContactPage from "../views/admin/contact/addContact/addContactPage.jsx"
import UpdateContactPage from "../views/admin/contact/updateContact/updateContactPage.jsx"
// additional management
import AdditionalManagement from "../views/admin/additional-management/index.jsx"
// service management
import ServiceManagement from "../views/admin/service-managemenet/index.jsx"

// halaman user
import HomeUsers from "../views/user/HomeUser.jsx"
import AddProperty from "../views/user/propertyManagement/addProperty/index.jsx"
import UpdateProperty from "../views/user/propertyManagement/updateProperty/index.jsx"
import UpdateImageOnly from "../views/user/propertyManagement/updateProperty/UpdateImagesOnly.jsx";
import GetAllPropertyByUsers from "../views/user/propertyManagement/getAllProperty/index.jsx"
import GetPrivateProperty from "../views/user/propertyManagement/getPrivateProperty/index.jsx"
import GetSavedProperty from "../views/user/propertyManagement/savedProperty/index.jsx"
import ServicePageUser from "../views/user/Service/servicePage.jsx"

export default function AppRoutes() {
    const { isAuthenticated, userRole } = useContext(AuthContext);
    return (
        <Routes>
            {/* landing page */}
            <Route path="/" element={<Home />} />
            <Route path="/detail/:id" element={<DetailPropertyLandingPage />} />
            <Route path="/service" element={<ServicePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* admin */}
            {/* dashboard */}
            <Route path="/admin/dashboard" element={
                isAuthenticated && userRole === 'admin' ? <Dashboard /> : <Navigate to="/" replace />
            } />
            {/* property management */}
            <Route path="/admin/property-management" element={
                isAuthenticated && userRole === 'admin' ? <PropertyManagement /> : <Navigate to="/" replace />
            } />
            <Route path="/admin/update-property-management/:id" element={
                isAuthenticated && userRole === 'admin' ? <UpdatePropertyPage /> : <Navigate to="/" replace />
            } />
            <Route path="/admin/detail-property-management/:id" element={
                isAuthenticated && userRole === 'admin' ? <DetailPropertyPage /> : <Navigate to="/" replace />
            } />
            <Route path="/admin/add-property-management" element={
                isAuthenticated && userRole === 'admin' ? <AddPropertyPage /> : <Navigate to="/" replace />
            } />
            <Route path="/admin/update-images-only/:id" element={
                isAuthenticated && userRole === 'admin' ? <UpdateImagesOnly /> : <Navigate to="/" replace />
            } />

            {/* users management */}
            <Route path="/admin/users-management" element={
                isAuthenticated && userRole === 'admin' ? <UsersManagement /> : <Navigate to="/" replace />
            } />
            <Route path="/admin/users-management/detail/:id" element={
                isAuthenticated && userRole === 'admin' ? <DetailUserPage /> : <Navigate to="/" replace />
            } />
            <Route path="/admin/users-management/update/:id" element={
                isAuthenticated && userRole === 'admin' ? <UpdateUserPage /> : <Navigate to="/" replace />
            } />
            {/* additional management */}
            <Route path="/admin/additional-management" element={
                isAuthenticated && userRole === 'admin' ? <AdditionalManagement /> : <Navigate to="/" replace />
            } />
            {/* property owner management */}
            <Route path="/admin/property-owner-management" element={
                isAuthenticated && userRole === 'admin' ? <PropertyOwnerManagement /> : <Navigate to="/" replace />
            } />
            {/* contact management */}
            <Route path="/admin/contact" element={
                isAuthenticated && userRole === 'admin' ? <ContactMabagement /> : <Navigate to="/" replace />
            } />
            <Route path="/admin/add/contact" element={
                isAuthenticated && userRole === 'admin' ? <AddContactPage /> : <Navigate to="/" replace />
            } />
            <Route path="/admin/update/contact/:id" element={
                isAuthenticated && userRole === 'admin' ? <UpdateContactPage /> : <Navigate to="/" replace />
            } />
            {/* service management */}
            <Route path="/admin/service-management" element={
                isAuthenticated && userRole === 'admin' ? <ServiceManagement /> : <Navigate to="/" replace />
            } />

            {/* user */}
            <Route path="/user/home" element={
                isAuthenticated && userRole === 'user' ? <HomeUsers /> : <Navigate to="/" replace />
            } />
            <Route path="/user/service" element={
                isAuthenticated && userRole === 'user' ? <ServicePageUser /> : <Navigate to="/" replace />
            } />
            <Route path="/user/add/property" element={
                isAuthenticated && userRole === 'user' ? <AddProperty /> : <Navigate to="/" replace />
            } />
            <Route path="/user/update/property/:id" element={
                isAuthenticated && userRole === 'user' ? <UpdateProperty /> : <Navigate to="/" replace />
            } />
            <Route path="/user/all/property" element={
                isAuthenticated && userRole === 'user' ? <GetAllPropertyByUsers /> : <Navigate to="/" replace />
            } />
            <Route path="/user/private/property" element={
                isAuthenticated && userRole === 'user' ? <GetPrivateProperty /> : <Navigate to="/" replace />
            } />
            <Route path="/user/saved/property" element={
                isAuthenticated && userRole === 'user' ? <GetSavedProperty /> : <Navigate to="/" replace />
            } />
            <Route path="/user/update/image/property/:id" element={
                isAuthenticated && userRole === 'user' ? <UpdateImageOnly /> : <Navigate to="/" replace />
            } />
        </Routes>
    );
}
