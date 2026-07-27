import React from 'react';
import NavbarLandingPage from "../../../components/NavbarLandingPage.jsx";
import FooterLandingPage from "../../../components/FooterLandingPage.jsx";
import ContactContent from './ContactContent.jsx';

function Contact() {
    return (
        <div className="flex flex-col min-h-screen">
            <NavbarLandingPage />
            <main className="flex-grow">
                <ContactContent />
            </main>
            <FooterLandingPage />
        </div>
    );
}

export default Contact;
