import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from "react-scroll";

function NavbarLandingPage() {
    const [activeSection, setActiveSection] = useState("");

    return (
        <div className='flex gap-4'>
            <h1>navbar utama</h1>
            <div className='bg-slate-700 py-3 px-6'>
                <Link to={'/login'}>Login</Link>
            </div>

            <div className='bg-slate-700 py-3 px-6'>
                <Link to={'/register'}>Register</Link>
            </div>
        </div>
    )
}

export default NavbarLandingPage;
