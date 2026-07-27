import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Building, Users, UserCheck, Briefcase } from 'lucide-react';
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
                if (!token) return;

                const response = await axios.get(`${baseUrl}/dashboard/stats`, {
                    headers: { Authorization: `Bearer ${token}` },
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

    const cards = [
        {
            title: "Total Properties",
            value: stats.totalProperty,
            icon: Building,
            bgColor: "bg-primary/10",
            textColor: "text-primary",
            borderColor: "border-primary/30"
        },
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            bgColor: "bg-info/10",
            textColor: "text-info",
            borderColor: "border-info/30"
        },
        {
            title: "Property Owners",
            value: stats.totalPropertyOwner,
            icon: UserCheck,
            bgColor: "bg-success/10",
            textColor: "text-success",
            borderColor: "border-success/30"
        },
        {
            title: "Active Services",
            value: stats.totalService,
            icon: Briefcase,
            bgColor: "bg-warning/10",
            textColor: "text-warning",
            borderColor: "border-warning/30"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div
                        key={index}
                        className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-sm hover:shadow-md transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-base-content/70 mb-1">
                                    {card.title}
                                </p>
                                <h3 className="text-3xl font-bold text-base-content group-hover:scale-105 transition-transform origin-left">
                                    {card.value}
                                </h3>
                            </div>
                            <div className={`w-14 h-14 rounded-2xl ${card.bgColor} flex items-center justify-center border ${card.borderColor}`}>
                                <Icon className={`w-7 h-7 ${card.textColor}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
