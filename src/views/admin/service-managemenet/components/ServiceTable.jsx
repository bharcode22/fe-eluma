import React from 'react';
import {
    Settings,
    Edit,
    Trash2,
    Image as ImageIcon,
    Layers,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const ServiceTable = ({
    services,
    baseUrl,
    currentPage,
    totalPages,
    onPageChange,
    onOpenEditModal,
    onOpenDeleteModal
}) => {
    if (services.length === 0) {
        return (
            <div className="text-center py-16 space-y-3">
                <Settings className="w-12 h-12 text-base-content/30 mx-auto" />
                <h3 className="text-lg font-bold text-base-content">No Services Found</h3>
                <p className="text-sm text-base-content/60">Add a new service to display it here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-base-300 bg-base-200/60 text-xs font-semibold uppercase tracking-wider text-base-content/70">
                            <th className="px-4 py-3.5 rounded-l-xl">#</th>
                            <th className="px-4 py-3.5">Image</th>
                            <th className="px-4 py-3.5">Service Name</th>
                            <th className="px-4 py-3.5">Service Type</th>
                            <th className="px-4 py-3.5 text-center">Status</th>
                            <th className="px-4 py-3.5 text-center rounded-r-xl">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-base-200 text-sm">
                        {services.map((item, index) => (
                            <tr key={item.id} className="hover:bg-base-200/40 transition-colors">
                                <td className="px-4 py-4 text-base-content/60 font-medium">
                                    {index + 1 + (currentPage - 1) * 10}
                                </td>

                                <td className="px-4 py-4">
                                    <div className="w-12 h-12 rounded-xl bg-base-200 border border-base-300 overflow-hidden flex items-center justify-center shadow-sm">
                                        {item.imagesService && item.imagesService.length > 0 ? (
                                            <img
                                                src={`${baseUrl}${item.imagesService[0].imagesUrl}`}
                                                alt={item.service_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <ImageIcon className="w-5 h-5 text-base-content/40" />
                                        )}
                                    </div>
                                </td>

                                <td className="px-4 py-4 font-semibold text-base-content">
                                    {item.service_name || '-'}
                                </td>

                                <td className="px-4 py-4 text-base-content/80 text-xs">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-base-200 font-medium">
                                        <Layers className="w-3 h-3 text-primary" />
                                        {item.serviceType?.service_type || item.service_type || '-'}
                                    </span>
                                </td>

                                <td className="px-4 py-4 text-center">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${
                                        item.status === 'active' || !item.status ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                                    }`}>
                                        {item.status || 'Active'}
                                    </span>
                                </td>

                                <td className="px-4 py-4">
                                    <div className="flex justify-center items-center gap-1.5">
                                        <button
                                            onClick={() => onOpenEditModal(item)}
                                            className="btn btn-square btn-xs btn-ghost text-primary hover:bg-primary/10 rounded-lg"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onOpenDeleteModal(item.id)}
                                            className="btn btn-square btn-xs btn-ghost text-error hover:bg-error/10 rounded-lg"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-base-200">
                    <span className="text-xs text-base-content/60">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="btn btn-sm btn-outline gap-1 rounded-xl disabled:opacity-40"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                        </button>
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="btn btn-sm btn-outline gap-1 rounded-xl disabled:opacity-40"
                        >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceTable;
