import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../service/api.js';
import { Link } from "react-router-dom";
import show from '../../assets/svg/show.svg';
import hide from '../../assets/svg/hide.svg';
import LoginModal from './LoginModal.jsx';

const RegisterModal = ({ isOpen, onClose, onLoginClick }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validation, setValidation] = useState([]);
    const [registerFailed, setRegisterFailed] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const register = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            await api.post('/auth/register', {
                username: username,
                name: name,
                email: email,
                password: password,
            });
            
            onClose();
            // navigate("/");
            onLoginClick();
        } catch (error) {
            if (error.response) {
                setValidation(error.response.data);
                setRegisterFailed(error.response.data);
            } else {
                setRegisterFailed({ message: "An unexpected error occurred" });
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-800/15 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Register</h2>
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
                {registerFailed.message && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <p className="text-sm">{registerFailed.message}</p>
                    </div>
                )}

                <form onSubmit={register}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Username
                        </label>
                        <input 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="Username" 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Full Name
                        </label>
                        <input 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Your Name" 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email" 
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
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Register'}
                        </button>
                    </div>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm">
                        Already have an account?{' '}
                        <button 
                            className="text-blue-500 hover:text-blue-800 font-medium"
                            onClick={() => {
                                onClose();
                                onLoginClick();
                            }}
                        >
                            Login
                        </button>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default RegisterModal;