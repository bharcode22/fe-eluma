import React from 'react';
import NavbarLandingPage from "../../../components/NavbarLandingPage.jsx";
import FooterLandingPage from "../../../components/FooterLandingPage.jsx";
import AboutContent from './AboutContent.jsx';

function About() {
    return (
        <div className="flex flex-col min-h-screen">
            <NavbarLandingPage />
            <main className="flex-grow">
                <AboutContent />
            </main>
            <FooterLandingPage />
        </div>
    );
}

export default About;
