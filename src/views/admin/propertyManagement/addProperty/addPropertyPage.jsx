import React from 'react';
import NavbarAdmin from '../../../../components/NavbarAdmin.jsx';
import AddPropertyForm from './addProperty.jsx';

export default function AddPropertyPage() {
    return (
        <div className="flex min-h-screen bg-gradient-to-b from-base-100 to-base-200">
            <NavbarAdmin />
            <div className="w-full">
                <AddPropertyForm />
            </div>
        </div>
    );
}
