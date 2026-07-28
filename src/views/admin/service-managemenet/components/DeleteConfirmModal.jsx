import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const DeleteConfirmModal = ({ showModal, onClose, onConfirm }) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative w-full max-w-md bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-300 z-10">
                <div className="p-6 text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10 text-error">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-base-content">Delete Service</h3>
                        <p className="text-sm text-base-content/70 mt-2">
                            Are you sure you want to delete this service?
                        </p>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="btn btn-outline flex-1 gap-2 rounded-xl"
                        >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                        </button>
                        <button
                            onClick={onConfirm}
                            className="btn btn-error flex-1 gap-2 rounded-xl text-white"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
