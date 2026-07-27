import React from 'react';
import NavbarLandingPage from "../../../components/NavbarLandingPage.jsx";
import FooterLandingPage from "../../../components/FooterLandingPage.jsx";
import Service from './service';

function servicePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <NavbarLandingPage />
            <main className="flex-grow">
                <Service />
            </main>
            <FooterLandingPage />
        </div>
    );
}

export default servicePage;
