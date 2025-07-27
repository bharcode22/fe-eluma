import React from 'react'
import NavbarLandingPage from "../../../components/NavbarLandingPage.jsx";
import AboutContent from './AboutContent.jsx';

function About() {
    return (
        <div>
            <div>
                <NavbarLandingPage />
            </div>
            <div>
                <AboutContent />
            </div>
        </div>
    )
}

export default About
