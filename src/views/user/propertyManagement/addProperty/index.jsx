import React from 'react'
import AddProperty from './AddNewProperty'
import NavbarUsers from "../../../../components/NavbarUser.jsx";
import FooterLandingPage from "../../../../components/FooterLandingPage.jsx";

function index() {
    return (
        <div>
            <div className='mb-15'>
                <NavbarUsers />
            </div>
            <div>
                <AddProperty />
            </div>
            <div>
                <FooterLandingPage />
            </div>
        </div>
    )
}

export default index
