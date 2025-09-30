import NavbarAdmin from '../../../components/NavbarAdmin.jsx';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'

export default function UsersManagement() {
    const [username, setUsername] = useState([]);
    useEffect(() => {
        const userData = Cookies.get('user');
        
        if (userData) {
            setUsername(JSON.parse(userData));
        }
    }, []);

    return (
        <div>
            <div>
                <NavbarAdmin />
            </div>
            <div>
                <h1 className='mt-20 text-4xl font-bold text-center text-primary'>
                    Users Management Comming Soon
                </h1>
            </div>
        </div>
    )
}
