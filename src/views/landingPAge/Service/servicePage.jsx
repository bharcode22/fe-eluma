import React from 'react'
import NavbarLandingPage from "../../../components/NavbarLandingPage.jsx";
import Service from './service';

function servicePage() {
    return (
        <div>
            <div>
                <NavbarLandingPage />
            </div>
            <div>
                <Service />
            </div>
        </div>
    )
}

export default servicePage
