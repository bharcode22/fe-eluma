import React from 'react';
import NavbarAdmin from '../../../components/NavbarAdmin.jsx';
import AdditionalManagementPage from './additionalManagement.jsx';

export default function AdditionalManagement() {
    return (
        <div className="flex min-h-screen bg-base-200/50">
            <div>
                <NavbarAdmin />
            </div>
            <div className="flex-1 min-w-0">
                <AdditionalManagementPage />
            </div>
        </div>
    );
}
