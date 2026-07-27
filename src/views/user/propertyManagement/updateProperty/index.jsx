import React from 'react'
import UpdateProperty from './UpdateProperty.jsx'
import NavbarUsers from "../../../../components/NavbarUser.jsx";
import FooterLandingPage from "../../../../components/FooterLandingPage.jsx";

function index() {
    return (
        <div>
            <div className='mb-15'>
                <NavbarUsers />
            </div>
            <div className='text-4xl flex justify-center'>
                <UpdateProperty />
            </div>
            <div>
                <FooterLandingPage />
            </div>
        </div>
    )
}

export default index
