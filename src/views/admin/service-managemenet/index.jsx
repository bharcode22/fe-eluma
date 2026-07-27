import React from 'react';
import NavbarAdmin from '../../../components/NavbarAdmin.jsx';
import ServicePage from './servicePage.jsx';

export default function ServiceManagement() {
    return (
        <div className="flex min-h-screen bg-gradient-to-b from-base-100 to-base-200">
            <NavbarAdmin />
            <div className="w-full">
                <ServicePage />
            </div>
        </div>
    );
}
