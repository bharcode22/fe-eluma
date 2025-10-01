import React from 'react';
import { Link } from 'react-router-dom';

export default function QuicAction() {
    return (
        <div>
            {/* Quick Actions */}
            <div className="bg-secondary rounded-lg shadow-md p-6">
                {/* <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2> */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to="/admin/property-management"
                        className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-focus transition-colors"
                    >
                        All Property List
                    </Link>
                    <Link
                        to="/admin/users-management"
                        className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-focus transition-colors"
                    >
                        All Users List
                    </Link>
                    <Link
                        to="/admin/property-owner-management"
                        className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-focus transition-colors"
                    >
                        All Owners List
                    </Link>
                </div>
            </div>
        </div>
    );
}

