import React from 'react';
import NavbarAdmin from '../../../../components/NavbarAdmin.jsx';
import AddContact from './addContact.jsx';

export default function AddContactPages() {
    return (
        <div className="flex min-h-screen bg-gradient-to-b from-base-100 to-base-200">
            <NavbarAdmin />
            <div className="w-full">
                <AddContact />
            </div>
        </div>
    );
}
