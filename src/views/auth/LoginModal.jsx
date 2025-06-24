import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from '../../service/api.js';
import Cookies from 'js-cookie';
import { AuthContext } from '../../context/AuthContext.jsx';
import show from '../../assets/svg/show.svg';
import hide from '../../assets/svg/hide.svg';

const LoginModal = ({ isOpen, onClose, onRegisterClick }) => {
    const navigate = useNavigate();
    const { setIsAuthenticated, setUserRole } = useContext(AuthContext);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setUEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validation, setValidation] = useState([]);
    const [loginFailed, setLoginFailed] = useState([]);
    const [showPassword, setShowPassword] = useState(false);

    const login = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/login', {
                email: email,
                password: password,
            });

            const { token, user } = response.data.data;

            Cookies.set('token', token);
            Cookies.set('user', JSON.stringify(user));

            setIsAuthenticated(true);
            setUserRole(user.role);
            onClose(); // Tutup modal setelah login berhasil

            if (user.role === 'admin') {
                navigate("/admin/home", { replace: true });
            } else if (user.role === 'user') {
                navigate("/user/home", { replace: true });
            }
        } catch (error) {
            if (error.response) {
                setValidation(error.response.data);
                setLoginFailed(error.response.data);
            } else {
                setLoginFailed({ message: "An unexpected error occurred" });
            } 
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-800/15 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Login</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {validation.errors && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        {validation.errors.map((error, index) => (
                            <p className="text-sm" key={index}>{error.path} : {error.msg}</p>
                        ))}
                    </div>
                )}
                {loginFailed.message && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <p className="text-sm">{loginFailed.message}</p>
                    </div>
                )}

                <form onSubmit={login}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setUEmail(e.target.value)} 
                            placeholder="E-mail" 
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? 
                                    <img src={hide} alt="Hide" className="w-5" /> :
                                    <img src={show} alt="Show" className="w-5" />
                                }
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <button 
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" 
                            type="submit" 
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Sign In'}
                        </button>
                    </div>
                </form>


                <div className="mt-4 text-center">
                    <p className="text-sm">
                        Don't have an account yet?{' '}
                        <button 
                            className="text-blue-500 hover:text-blue-800 font-medium"
                            onClick={() => {
                                onClose();
                                onRegisterClick();
                            }}
                        >
                            Register
                        </button>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default LoginModal;