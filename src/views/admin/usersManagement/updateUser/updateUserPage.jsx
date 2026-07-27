import React from 'react';
import NavbarAdmin from '../../../../components/NavbarAdmin.jsx';
import UpdateUser from './updateUser';

function updateUserPage() {
    return (
        <div className="min-h-screen flex bg-base-200/50">
            <div>
                <NavbarAdmin />
            </div>
            <div className="flex-1 min-w-0 py-8">
                <UpdateUser />
            </div>
        </div>
    );
}

export default updateUserPage;
