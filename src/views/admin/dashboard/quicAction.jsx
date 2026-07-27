import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, UserCog, ChevronRight, Zap } from 'lucide-react';

export default function QuicAction() {
    const actions = [
        {
            title: "Property Management",
            desc: "View and manage all property listings",
            path: "/admin/property-management",
            icon: Home,
            btnText: "Manage Properties"
        },
        {
            title: "User Management",
            desc: "View, edit, and manage platform users",
            path: "/admin/users-management",
            icon: Users,
            btnText: "Manage Users"
        },
        {
            title: "Property Owners",
            desc: "View registered property owner details",
            path: "/admin/property-owner-management",
            icon: UserCog,
            btnText: "Manage Owners"
        }
    ];

    return (
        <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <Zap className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-base-content">Quick Actions</h2>
                    <p className="text-sm text-base-content/60">Shortcuts to manage your system</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {actions.map((act, index) => {
                    const Icon = act.icon;
                    return (
                        <Link
                            key={index}
                            to={act.path}
                            className="flex flex-col justify-between p-5 bg-base-200/50 hover:bg-base-200 rounded-xl border border-base-300/80 transition-all hover:-translate-y-1 hover:shadow-md group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-primary text-white rounded-xl shadow-md group-hover:scale-110 transition-transform">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <ChevronRight className="w-4 h-4 text-base-content/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base-content text-base mb-1">{act.title}</h3>
                                <p className="text-xs text-base-content/70 mb-4">{act.desc}</p>
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                                    {act.btnText}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
