import React from 'react'
import GetSavedProperty from './GetSavedProperty.jsx'
import NavbarUsers from "../../../../components/NavbarUser.jsx";

function index() {
    return (
        <div>
            <div className='mb-15'>
                <NavbarUsers />
            </div>
            <div>
                <GetSavedProperty />
            </div>
        </div>
    )
}

export default index
