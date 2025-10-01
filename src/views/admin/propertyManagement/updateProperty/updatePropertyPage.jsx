import React from 'react'
import NavbarAdmin from '../../../../components/NavbarAdmin.jsx'
import UpdatePropertyForm from './updatePropertyManagement.jsx'

export default  function updatePropertyPage({id}) {
    return (
        <div className='flex items-center justify-center'>
            <div>
                <NavbarAdmin />
            </div>
            <div>
                <UpdatePropertyForm id={id} />
            </div>
        </div>
    )
}

