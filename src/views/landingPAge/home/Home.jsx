import React, { useState } from 'react';
import NavbarLandingPage from "../../../components/NavbarLandingPage.jsx";
import FooterLandingPage from "../../../components/FooterLandingPage.jsx";
import GetAllProperty from "./GetAllProperty.jsx";
import Banner from "./Banner.jsx";

export default function Home() {
    const [bannerFilters, setBannerFilters] = useState({
        searchLocation: '',
        propertyType: '',
        priceRange: ''
    });

    return (
        <div className="flex flex-col min-h-screen">
            <NavbarLandingPage />
            <main className="flex-grow">
                <Banner bannerFilters={bannerFilters} setBannerFilters={setBannerFilters} />
                <GetAllProperty
                    bannerFilters={bannerFilters}
                    onClearFilters={() => setBannerFilters({ searchLocation: '', propertyType: '', priceRange: '' })}
                />
            </main>
            <FooterLandingPage />
        </div>
    );
}
