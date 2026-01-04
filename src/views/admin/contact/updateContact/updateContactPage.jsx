import React from 'react';
import NavbarAdmin from '../../../../components/NavbarAdmin.jsx';
import UpdateContact from './updateContact.jsx';

export default function AddContactPages() {
    return (
        <div className="min-h-screen flex">

            <NavbarAdmin />

            <div className="flex-1 flex justify-center items-center">
                <UpdateContact />
            </div>

        </div>
    );
}
