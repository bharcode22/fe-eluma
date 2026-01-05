import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import api from '../../../../service/api.js';
const baseUrl = api.defaults.baseURL;

function updateUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = Cookies.get('token');

                const res = await axios.get(`${baseUrl}/users-management/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const contact = res.data.data;

                if (contact) {
                    setRole(contact.role ?? '');
                    setStatus(contact.status ?? '');
                }
            } catch (err) {
                console.error(err);
                setError('Gagal memuat data contact');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchUser();
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = Cookies.get('token');

            await axios.patch( 
                `${baseUrl}/users-management/${id}`,{ 
                    role, 
                    status 
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            navigate('/admin/users-management');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Gagal update contact');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
        <div className="text-center py-10">
            <p>Loading data contact...</p>
        </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6 rounded-xl bg-secondary/70 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Update User
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <select
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-secondary/80 border"
                    placeholder="Nomor telepon"
                    required
                >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                </select>

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-secondary/80 border"
                    >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-2 rounded-lg"
                    >
                    {loading ? 'Menyimpan...' : 'Update User'}
                </button>
            </form>
        </div>
    )
}

export default updateUser
