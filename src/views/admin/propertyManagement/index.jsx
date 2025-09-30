import NavbarAdmin from '../../../components/NavbarAdmin.jsx';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'
import PropertyList from './PropertyList.jsx';

export default function PropertyManagement() {
    const [username, setUsername] = useState([]);
    useEffect(() => {
        const userData = Cookies.get('user');
        
        if (userData) {
            setUsername(JSON.parse(userData));
        }
    }, []);

    return (
        <div className="flex h-screen">
            <div>
                <NavbarAdmin />
            </div>
            <div className='flex-1'>
                <PropertyList />
            </div>
        </div>
    )
}
