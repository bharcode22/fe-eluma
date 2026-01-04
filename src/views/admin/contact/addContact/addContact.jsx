import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import api from '../../../../service/api.js';
const baseUrl = api.defaults.baseURL;

function AddContact() {
    const navigate = useNavigate();
    const [number, setNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = Cookies.get('token');

            await axios.post( `${baseUrl}/contact`,
                {
                    number: number,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            navigate('/admin/contact');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Gagal menambahkan contact');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 rounded-xl bg-secondary/70 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Add Contact</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-secondary/80 border"
                    placeholder="Nomor telepon"
                    required
                />

                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                    >
                    {loading ? 'Menyimpan...' : 'Simpan Contact'}
                </button>
            </form>
        </div>

    );
}

export default AddContact;
