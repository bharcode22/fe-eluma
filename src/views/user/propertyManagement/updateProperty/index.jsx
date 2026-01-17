import React from 'react'
import UpdateProperty from './UpdateProperty.jsx'
import NavbarUsers from "../../../../components/NavbarUser.jsx";

function index() {
    return (
        <div>
            <div className='mb-15'>
                <NavbarUsers />
            </div>
            <div className='text-4xl flex justify-center'>
                <UpdateProperty />
            </div>
        </div>
    )
}

export default index
