import React from 'react';
import NavbarAdmin from '../../../../components/NavbarAdmin.jsx';
import UpdateContact from './updateContact.jsx';

export default function UpdateContactPage() {
    return (
        <div className="flex min-h-screen bg-gradient-to-b from-base-100 to-base-200">
            <NavbarAdmin />
            <div className="w-full">
                <UpdateContact />
            </div>
        </div>
    );
}
