import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'
import StatsData from './statsData.jsx';
import LatestPropertyList from './latestPropertyList.jsx';
import QuicAction from './quicAction.jsx';

export default function DashboardPage() {
    const [username, setUsername] = useState([]);
    useEffect(() => {
        const userData = Cookies.get('user');
        
        if (userData) {
            setUsername(JSON.parse(userData));
        }
    }, []);

    return (
        <div>
            {/* Main Content */}
            <div className="flex-1 ml-64 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
                    <p className="text-gray-600">Selamat datang, {username.name}!</p>
                </div>

                <StatsData />
                <LatestPropertyList />
                <QuicAction />
            </div>
        </div>
    )
}
