import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import api from '../../../service/api.js';
const baseUrl = api.defaults.baseURL;

export default function StatsData() {
    const [stats, setStats] = useState({
        totalProperty: 0,
        totalUsers: 0,
        totalPropertyOwner: 0,
        totalService: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) {
                    console.error('Token tidak ditemukan. Harap login terlebih dahulu.');
                    return;
                }

                const response = await axios.get(`${baseUrl}/dashboard/stats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.message === 'success to get all stats data') {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error.response?.data?.message || error.message);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-secondary rounded-lg shadow-md p-6 border-l-4 border-primary">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Properti</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.totalProperty}</h3>
                        </div>
                        <div className="bg-primary bg-opacity-10 p-3 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-secondary rounded-lg shadow-md p-6 border-l-4 border-secondary">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Users</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.totalUsers}</h3>
                        </div>
                        <div className="bg-secondary bg-opacity-10 p-3 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-secondary rounded-lg shadow-md p-6 border-l-4 border-accent">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Property Owner</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.totalPropertyOwner}</h3>
                        </div>
                        <div className="bg-accent bg-opacity-10 p-3 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-secondary rounded-lg shadow-md p-6 border-l-4 border-accent">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Service</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stats.totalService}</h3>
                        </div>
                        <div className="bg-accent bg-opacity-10 p-3 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
