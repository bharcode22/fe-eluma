import React from 'react'
import AddProperty from './AddNewProperty'
import NavbarUsers from "../../../../components/NavbarUser.jsx";

function index() {
    return (
        <div>
            <div className='mb-15'>
                <NavbarUsers />
            </div>
            <div>
                <AddProperty />
            </div>
        </div>
    )
}

export default index
