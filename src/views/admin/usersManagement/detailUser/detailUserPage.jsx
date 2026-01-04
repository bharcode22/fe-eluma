import React from 'react'
import NavbarAdmin from '../../../../components/NavbarAdmin.jsx';
import DetailUser from './detailUser.jsx';

function detailUserPage() {
    return (
        <div className='flex justify-center'>

            <NavbarAdmin />

            <div className='w-350'>
                <DetailUser />
            </div>

        </div>
    )
}

export default detailUserPage
