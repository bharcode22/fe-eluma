import React from 'react';
import NavbarAdmin from '../../../../components/NavbarAdmin.jsx';
import UpdatePropertyForm from './updatePropertyManagement.jsx';

export default function UpdatePropertyPage({ id }) {
    return (
        <div className="flex min-h-screen bg-gradient-to-b from-base-100 to-base-200">
            <NavbarAdmin />
            <div className="w-full">
                <UpdatePropertyForm id={id} />
            </div>
        </div>
    );
}
