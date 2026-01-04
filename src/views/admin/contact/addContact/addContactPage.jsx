import React from 'react';
import NavbarAdmin from '../../../../components/NavbarAdmin.jsx';
import AddContact from './addContact.jsx';

export default function AddContactPages() {
    return (
        <div className="min-h-screen flex">

            <NavbarAdmin />

            <div className="flex-1 flex justify-center items-center">
                <AddContact />
            </div>

        </div>
    );
}
