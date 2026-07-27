import React from 'react'
import NavbarUser from "../../../components/NavbarUser.jsx";
import Service from './service';
import FooterLandingPage from "../../../components/FooterLandingPage.jsx";

function servicePageUser() {
    return (
        <div>
            <div>
                <NavbarUser />
            </div>
            <div>
                <Service />
            </div>
            <div>
                <FooterLandingPage />
            </div>
        </div>
    )
}

export default servicePageUser
