import React, { useState } from 'react';
import NavbarLandingPage from "../../../components/NavbarLandingPage.jsx";
import GetAllProperty from "./GetAllProperty.jsx";
import Banner from "./Banner.jsx";

export default function Home() {
    const [bannerFilters, setBannerFilters] = useState({
        searchLocation: '',
        propertyType: '',
        priceRange: ''
    });

    return (
        <div>
            <NavbarLandingPage />
            <Banner bannerFilters={bannerFilters} setBannerFilters={setBannerFilters} />
            <GetAllProperty
                bannerFilters={bannerFilters}
                onClearFilters={() => setBannerFilters({ searchLocation: '', propertyType: '', priceRange: '' })}
            />
        </div>
    );
}
