import React from 'react'

export default function quicAction() {
    return (
        <div>
                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-focus transition-colors">
                            All Property List
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-focus transition-colors">
                            All Users List
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-focus transition-colors">
                            All Owners List
                        </button>
                    </div>
                </div>
        </div>
    )
}

