import React from 'react'
import NavbarAdmin from '../../../../components/NavbarAdmin.jsx'
import AddPropertyForm from './addProperty.jsx'

export default  function AddProperty({id}) {
    return (
        <div className='flex items-center justify-center'>
            <div>
                <NavbarAdmin />
            </div>
            <div>
                <AddPropertyForm />
            </div>
        </div>
    )
}
