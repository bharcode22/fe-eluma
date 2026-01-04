import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import api from '../../../../service/api.js';

const baseUrl = api.defaults.baseURL;

function UpdateContact() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [number, setNumber] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const token = Cookies.get('token');

                const res = await axios.get(`${baseUrl}/contact/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const contact = res.data.data;
                console.log("conatct", contact);
                

                if (contact) {
                    setNumber(contact[0].number ?? '');
                    setStatus(contact[0].status ?? '');
                }
            } catch (err) {
                console.error(err);
                setError('Gagal memuat data contact');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchContact();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = Cookies.get('token');

            await axios.patch(
                `${baseUrl}/contact/${id}`,
                { number, status },
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
                Update Contact
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-secondary/80 border"
                    placeholder="Nomor telepon"
                    required
                />

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
                    {loading ? 'Menyimpan...' : 'Update Contact'}
                </button>
            </form>
        </div>
    );
}

export default UpdateContact;
