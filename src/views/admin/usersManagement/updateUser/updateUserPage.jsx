import React from 'react'
import NavbarAdmin from '../../../../components/NavbarAdmin.jsx';
import UpdateUser from './updateUser';


function updateUserPage() {
    return (
        <div className="min-h-screen flex">

            <NavbarAdmin />

            <div className="flex-1 flex justify-center items-center">
                <UpdateUser />
            </div>

        </div>
    )
}

export default updateUserPage
