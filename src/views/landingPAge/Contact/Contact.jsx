import React from 'react'
import NavbarLandingPage from "../../../components/NavbarLandingPage.jsx";
import ContactContent from './ContactContent.jsx';

function Contact() {
    return (
        <div>
            <div>
                <NavbarLandingPage />
            </div>
            <div>
                <ContactContent />
            </div>
        </div>
    )
}

export default Contact
