import React from 'react'
import NavbarAdmin from '../../../components/NavbarAdmin.jsx'
import DetailPropertyManagement from './detailPropertyManagement.jsx'

export default  function DetailProperty({id}) {
    return (
        <div className='flex items-center justify-center'>
            <div>
                <NavbarAdmin />
            </div>
            <div>
                <DetailPropertyManagement id={id} />
            </div>
        </div>
    )
}
