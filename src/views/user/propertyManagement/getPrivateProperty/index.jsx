import React from 'react'
import GetPrivateProperty from './GetPrivateProperty.jsx'
import NavbarUsers from "../../../../components/NavbarUser.jsx";

function index() {
    return (
        <div>
            <div className='mb-15'>
                <NavbarUsers />
            </div>
            <div>
                <GetPrivateProperty />
            </div>
        </div>
    )
}

export default index
