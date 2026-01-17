import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    X,
    Mail,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    Loader2,
    AlertCircle,
    CheckCircle,
    User,
    Shield,
    Smartphone,
    Sparkles,
    Key,
    ArrowRight,
    Globe
} from 'lucide-react';
import api from '../../service/api.js';
import Cookies from 'js-cookie';
import { AuthContext } from '../../context/AuthContext.jsx';
import AithGoogle from "./GoogleAuth.jsx";

const LoginModal = ({ isOpen, onClose, onRegisterClick, onSuccess }) => {
    const navigate = useNavigate();
    const { setIsAuthenticated, setUserRole } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [email, setUEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validation, setValidation] = useState([]);
    const [loginFailed, setLoginFailed] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loginMethod, setLoginMethod] = useState('email'); // 'email', 'phone'

    const login = async (e) => {
        e.preventDefault();
        setLoading(true);
        setValidation([]);
        setLoginFailed([]);

        try {
            const loginData = loginMethod === 'email'
                ? { email, password }
                : { phone: email, password };

            const response = await api.post('/auth/login', loginData);

            const { token, user } = response.data.data;

            // Set cookies with expiration
            const cookieOptions = {
                expires: rememberMe ? 7 : 1, // 7 days if remember me, 1 day otherwise
                secure: true,
                sameSite: 'strict'
            };

            Cookies.set('token', token, cookieOptions);
            Cookies.set('user', JSON.stringify(user), cookieOptions);

            setIsAuthenticated(true);
            setUserRole(user.role);

            // Call success callback if provided
            if (onSuccess) {
                onSuccess();
            }

            onClose();

            // Navigate based on role
            if (user.role === 'admin') {
                navigate("/admin/dashboard", { replace: true });
            } else if (user.role === 'user') {
                navigate("/user/home", { replace: true });
            }

        } catch (error) {
            if (error.response) {
                setValidation(error.response.data.errors || []);
                setLoginFailed(error.response.data);
            } else {
                setLoginFailed({ message: "Network error. Please check your connection." });
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const getFieldError = (fieldName) => {
        return validation.find(error => error.path === fieldName);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md transform transition-all">
                <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl shadow-2xl overflow-hidden border border-base-300">
                    {/* Header */}
                    <div className="relative p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-base-300">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 p-2 hover:bg-base-300 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-base-content/70" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <LogIn className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-base-content">Welcome Back</h2>
                                <p className="text-sm text-base-content/70">Sign in to your account</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Login Method Toggle */}
                        <div className="flex mb-6 bg-base-300 rounded-lg p-1">
                            <button
                                type="button"
                                onClick={() => setLoginMethod('email')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${loginMethod === 'email'
                                    ? 'bg-primary text-primary-content shadow-sm'
                                    : 'text-base-content/70 hover:text-base-content'
                                    }`}
                            >
                                <Mail className="w-4 h-4" />
                                Email
                            </button>
                            <button
                                type="button"
                                onClick={() => setLoginMethod('phone')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${loginMethod === 'phone'
                                    ? 'bg-primary text-primary-content shadow-sm'
                                    : 'text-base-content/70 hover:text-base-content'
                                    }`}
                            >
                                <Smartphone className="w-4 h-4" />
                                Phone
                            </button>
                        </div>

                        {/* Error Messages */}
                        {(validation.length > 0 || loginFailed.message) && (
                            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                                    <div className="space-y-2">
                                        {validation.map((error, index) => (
                                            <p key={index} className="text-sm text-error">
                                                {error.msg}
                                            </p>
                                        ))}
                                        {loginFailed.message && (
                                            <p className="text-sm text-error">{loginFailed.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={login} className="space-y-5">
                            {/* Email/Phone Input */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                                    {loginMethod === 'email' ? (
                                        <>
                                            <Mail className="w-4 h-4" />
                                            Email Address
                                        </>
                                    ) : (
                                        <>
                                            <Smartphone className="w-4 h-4" />
                                            Phone Number
                                        </>
                                    )}
                                </label>
                                <div className="relative">
                                    <input
                                        className={`input input-bordered w-full pl-10 ${getFieldError(loginMethod === 'email' ? 'email' : 'phone')
                                            ? 'input-error'
                                            : 'focus:border-primary focus:ring-2 focus:ring-primary/20'
                                            }`}
                                        type={loginMethod === 'email' ? "email" : "tel"}
                                        value={email}
                                        onChange={(e) => setUEmail(e.target.value)}
                                        placeholder={loginMethod === 'email' ? "you@example.com" : "+62 812 3456 7890"}
                                        disabled={loading}
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                        {loginMethod === 'email' ? (
                                            <Mail className="w-4 h-4 text-base-content/50" />
                                        ) : (
                                            <Smartphone className="w-4 h-4 text-base-content/50" />
                                        )}
                                    </div>
                                </div>
                                {getFieldError(loginMethod === 'email' ? 'email' : 'phone') && (
                                    <p className="text-xs text-error">{getFieldError(loginMethod === 'email' ? 'email' : 'phone').msg}</p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                                        <Lock className="w-4 h-4" />
                                        Password
                                    </label>
                                    <Link
                                        // to="/forgot-password"
                                        onClick={onClose}
                                        className="text-xs text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        className={`input input-bordered w-full pl-10 pr-10 ${getFieldError('password')
                                            ? 'input-error'
                                            : 'focus:border-primary focus:ring-2 focus:ring-primary/20'
                                            }`}
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        disabled={loading}
                                    />
                                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-base-300 rounded transition-colors"
                                        disabled={loading}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4 text-base-content/60" />
                                        ) : (
                                            <Eye className="w-4 h-4 text-base-content/60" />
                                        )}
                                    </button>
                                </div>
                                {getFieldError('password') && (
                                    <p className="text-xs text-error">{getFieldError('password').msg}</p>
                                )}
                            </div>

                            {/* Remember Me & Security */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary checkbox-sm"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        disabled={loading}
                                    />
                                    <span className="text-sm text-base-content/70">Remember me</span>
                                </label>
                                <div className="flex items-center gap-1 text-xs text-success">
                                    <Shield className="w-3 h-3" />
                                    <span>Secure Connection</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                className="btn btn-primary w-full gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                type="submit"
                                disabled={loading || !email || !password}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-4 h-4" />
                                        Sign In
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-base-300"></div>
                                </div>
                                {/* <div className="relative flex justify-center text-xs">
                                    <span className="px-2 bg-base-100 text-base-content/50">Or continue with</span>
                                </div> */}
                            </div>

                            {/* Social Login */}
                            <div className="space-y-3">
                                <AithGoogle />

                                {/* <button
                                    type="button"
                                    className="btn btn-outline w-full gap-2"
                                    disabled={loading}
                                >
                                    <Globe className="w-4 h-4" />
                                    Continue as Guest
                                </button> */}
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="mt-6 pt-6 border-t border-base-300">
                            <div className="text-center text-sm">
                                <p className="text-base-content/70">
                                    Don't have an account?{' '}
                                    <button
                                        className="font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                                        onClick={() => {
                                            onClose();
                                            onRegisterClick();
                                        }}
                                        disabled={loading}
                                    >
                                        Create account
                                        <ArrowRight className="w-3 h-3" />
                                    </button>
                                </p>
                            </div>

                            {/* Security Info */}
                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-base-content/50">
                                <Shield className="w-3 h-3" />
                                <span>Your data is protected with 256-bit SSL encryption</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success Toast (Optional) */}
                {!loading && !validation.length && !loginFailed.message && email && password && (
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-xs text-success">All fields are valid</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginModal;