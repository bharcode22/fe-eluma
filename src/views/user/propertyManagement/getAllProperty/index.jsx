import React from 'react';
import NavbarUsers from "../../../../components/NavbarUser.jsx";
import GetAllPropertyUser from "./GetAllPropertyByUsers.jsx";
import FooterLandingPage from "../../../../components/FooterLandingPage.jsx";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-base-100">
            <NavbarUsers />
            <main className="flex-grow">
                <GetAllPropertyUser />
            </main>
            <FooterLandingPage />
        </div>
    );
}
