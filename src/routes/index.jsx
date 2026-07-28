import React, { useContext, lazy, Suspense } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from 'lucide-react';

// Landing Page (Direct import for initial load speed)
import Home from "../views/landingPAge/home/Home.jsx";
import DetailPropertyLandingPage from "../views/landingPAge/components/landingPageDetailPrperty.jsx";
import ServicePage from "../views/landingPAge/Service/servicePage.jsx";
import Contact from "../views/landingPAge/Contact/Contact.jsx";
import About from "../views/landingPAge/About/About.jsx";
import PrivacyPolicy from "../views/landingPAge/PrivacyPolicy.jsx";
import TermsOfService from "../views/landingPAge/TermsOfService.jsx";

// Lazy Loaded Admin Views (Code-Splitting)
const Dashboard = lazy(() => import("../views/admin/dashboard/index.jsx"));
const PropertyManagement = lazy(() => import("../views/admin/propertyManagement/index.jsx"));
const UpdatePropertyPage = lazy(() => import("../views/admin/propertyManagement/updateProperty/updatePropertyPage.jsx"));
const DetailPropertyPage = lazy(() => import("../views/admin/propertyManagement/detailProperty/detailPropertyPage.jsx"));
const AddPropertyPage = lazy(() => import("../views/admin/propertyManagement/addProperty/addPropertyPage.jsx"));
const UpdateImagesOnly = lazy(() => import("../views/admin/propertyManagement/updateProperty/UpdateImagesOnly.jsx"));

const UsersManagement = lazy(() => import("../views/admin/usersManagement/index.jsx"));
const DetailUserPage = lazy(() => import("../views/admin/usersManagement/detailUser/detailUserPage.jsx"));
const UpdateUserPage = lazy(() => import("../views/admin/usersManagement/updateUser/updateUserPage.jsx"));
const PropertyOwnerManagement = lazy(() => import("../views/admin/property-owner-management/index.jsx"));
const ContactMabagement = lazy(() => import("../views/admin/contact/index.jsx"));
const AddContactPage = lazy(() => import("../views/admin/contact/addContact/addContactPage.jsx"));
const UpdateContactPage = lazy(() => import("../views/admin/contact/updateContact/updateContactPage.jsx"));
const AdditionalManagement = lazy(() => import("../views/admin/additional-management/index.jsx"));
const ServiceManagement = lazy(() => import("../views/admin/service-managemenet/index.jsx"));
const AdminProfile = lazy(() => import("../views/admin/profile/AdminProfile.jsx"));

// Lazy Loaded User Views
const HomeUsers = lazy(() => import("../views/user/HomeUser.jsx"));
const AddProperty = lazy(() => import("../views/user/propertyManagement/addProperty/index.jsx"));
const UpdateProperty = lazy(() => import("../views/user/propertyManagement/updateProperty/index.jsx"));
const UpdateImageOnly = lazy(() => import("../views/user/propertyManagement/updateProperty/UpdateImagesOnly.jsx"));
const GetAllPropertyByUsers = lazy(() => import("../views/user/propertyManagement/getAllProperty/index.jsx"));
const GetPrivateProperty = lazy(() => import("../views/user/propertyManagement/getPrivateProperty/index.jsx"));
const GetSavedProperty = lazy(() => import("../views/user/propertyManagement/savedProperty/index.jsx"));
const ServicePageUser = lazy(() => import("../views/user/Service/servicePage.jsx"));
const UserProfile = lazy(() => import("../views/user/UserProfile.jsx"));

const PageLoader = () => (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center space-y-3">
            <Loader2 className="w-9 h-9 animate-spin text-primary mx-auto" />
            <p className="text-xs font-semibold text-base-content/60">Loading Page Module...</p>
        </div>
    </div>
);

export default function AppRoutes() {
    const { isAuthenticated, userRole } = useContext(AuthContext);

    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Landing Page Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/detail/:id" element={<DetailPropertyLandingPage />} />
                <Route path="/service" element={<ServicePage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />

                {/* Protected Admin Routes */}
                <Route path="/admin/dashboard" element={
                    isAuthenticated && userRole === 'admin' ? <Dashboard /> : <Navigate to="/" replace />
                } />
                <Route path="/admin/property-management" element={
                    isAuthenticated && userRole === 'admin' ? <PropertyManagement /> : <Navigate to="/" replace />
                } />
                <Route path="/admin/update/property/:id" element={
                    isAuthenticated && userRole === 'admin' ? <UpdatePropertyPage /> : <Navigate to="/" replace />
                } />
                <Route path="/admin/detail/property/:id" element={
                    isAuthenticated && userRole === 'admin' ? <DetailPropertyPage /> : <Navigate to="/" replace />
                } />
                <Route path="/admin/add/property" element={
                    isAuthenticated && userRole === 'admin' ? <AddPropertyPage /> : <Navigate to="/" replace />
                } />
                <Route path="/admin/update/image/property/:id" element={
                    isAuthenticated && userRole === 'admin' ? <UpdateImagesOnly /> : <Navigate to="/" replace />
                } />
                <Route path="/admin/users-management" element={
                    isAuthenticated && userRole === 'admin' ? <UsersManagement /> : <Navigate to="/" replace />
                } />
                <Route path="/admin/detail/user/:id" element={
                    isAuthenticated && userRole === 'admin' ? <DetailUserPage /> : <Navigate to="/" replace />
                } />
                <Route path="/admin/update/user/:id" element={
                    isAuthenticated && userRole === 'admin' ? <UpdateUserPage /> : <Navigate to="/" replace />
                } />
                <Route path="/admin/property-owner-management" element={
                    isAuthenticated && userRole === 'admin' ? <PropertyOwnerManagement /> : <Navigate to="/" replace />
                } />
                <Route path="/admin/additional-management" element={
                    isAuthenticated && userRole === 'admin' ? <AdditionalManagement /> : <Navigate to="/" replace />
                } />
                <Route path="/admin/contact" element={
                    isAuthenticated && userRole === 'admin' ? <ContactMabagement /> : <Navigate to="/" replace />
                } />
                <Route path="/admin/add/contact" element={
                    isAuthenticated && userRole === 'admin' ? <AddContactPage /> : <Navigate to="/" replace />
                } />
                <Route path="/admin/update/contact/:id" element={
                    isAuthenticated && userRole === 'admin' ? <UpdateContactPage /> : <Navigate to="/" replace />
                } />
                <Route path="/admin/service-management" element={
                    isAuthenticated && userRole === 'admin' ? <ServiceManagement /> : <Navigate to="/" replace />
                } />
                <Route path="/admin/profile" element={
                    isAuthenticated && userRole === 'admin' ? <AdminProfile /> : <Navigate to="/" replace />
                } />

                {/* Protected User Routes */}
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
                <Route path="/user/profile" element={
                    isAuthenticated && userRole === 'user' ? <UserProfile /> : <Navigate to="/" replace />
                } />
            </Routes>
        </Suspense>
    );
}
