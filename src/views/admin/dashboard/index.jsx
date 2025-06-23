import NavbarAdmin from '../../../components/NavbarAdmin.jsx';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'

export default function Dashboard() {
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
                <h1>
                    Halaman admin
                </h1>
            </div>
        </div>
    )
}
