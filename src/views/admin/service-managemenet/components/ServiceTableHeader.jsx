import React from 'react';
import { Settings, Plus } from 'lucide-react';

const ServiceTableHeader = ({ onOpenAddModal }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3.5 bg-primary/10 rounded-2xl text-primary">
                    <Settings className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-base-content">
                        Service Management
                    </h1>
                    <p className="text-base-content/70 text-sm mt-0.5">
                        Create, update, and manage services offered on the platform
                    </p>
                </div>
            </div>

            <button
                onClick={onOpenAddModal}
                className="btn btn-primary gap-2 shadow-md hover:shadow-lg self-start md:self-auto"
            >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
            </button>
        </div>
    );
};

export default ServiceTableHeader;
