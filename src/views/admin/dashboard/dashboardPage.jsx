import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { LayoutDashboard, Sparkles } from 'lucide-react';
import StatsData from './statsData.jsx';
import LatestPropertyList from './latestPropertyList.jsx';
import QuicAction from './quicAction.jsx';
import DashboardSkeleton from './dashboardSkeleton.jsx';
import ServerMetricsWidget from './components/ServerMetricsWidget.jsx';

export default function DashboardPage() {
    const [username, setUsername] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = Cookies.get('user');
        if (userData) {
            try {
                setUsername(JSON.parse(userData));
            } catch (e) {
                setUsername({ name: 'Admin' });
            }
        }

        // Brief loading timer to ensure clean rendering transition
        const timer = setTimeout(() => {
            setLoading(false);
        }, 400);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-primary/10 rounded-2xl text-primary">
                            <LayoutDashboard className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-base-content">
                                    Admin Dashboard
                                </h1>
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-base-content/70 text-sm md:text-base mt-0.5">
                                Welcome back, <span className="font-semibold text-primary">{username.name || 'Administrator'}</span>! Here is your system overview.
                            </p>
                        </div>
                    </div>
                </div>

                <StatsData />
                <ServerMetricsWidget />
                <QuicAction />
                <LatestPropertyList />
            </div>
        </div>
    );
}
