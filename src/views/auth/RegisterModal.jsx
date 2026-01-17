import React, { useState } from "react";
import {
    X,
    User,
    UserCircle,
    Mail,
    Lock,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    Loader2,
    ArrowRight,
    Shield,
    Sparkles,
    KeyRound,
    Phone,
    Building,
    BadgeCheck,
    Calendar
} from 'lucide-react';
import api from '../../service/api.js';
import { Link } from "react-router-dom";

const RegisterModal = ({ isOpen, onClose, onLoginClick, onSuccess }) => {
    const [formData, setFormData] = useState({
        username: "",
        name: "",
        email: "",
        password: "",
        phone: "",
        company: ""
    });
    const [validation, setValidation] = useState([]);
    const [registerFailed, setRegisterFailed] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Update password strength
        if (name === 'password') {
            calculatePasswordStrength(value);
        }
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        setPasswordStrength(strength);
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 0: return 'bg-error';
            case 1: return 'bg-warning';
            case 2: return 'bg-info';
            case 3: return 'bg-success';
            case 4: return 'bg-success';
            default: return 'bg-base-300';
        }
    };

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case 0: return 'Very Weak';
            case 1: return 'Weak';
            case 2: return 'Fair';
            case 3: return 'Good';
            case 4: return 'Strong';
            default: return '';
        }
    };

    const register = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setValidation([]);
        setRegisterFailed([]);
        
        try {
            const response = await api.post('/auth/register', {
                username: formData.username,
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                company: formData.company
            });
            
            // Show success message
            setShowSuccess(true);
            
            // Wait a moment then redirect to login
            setTimeout(() => {
                if (onSuccess) onSuccess();
                onClose();
                onLoginClick();
            }, 1500);
            
        } catch (error) {
            if (error.response) {
                setValidation(error.response.data.errors || []);
                setRegisterFailed(error.response.data);
            } else {
                setRegisterFailed({ 
                    message: "Network error. Please check your connection." 
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getFieldError = (fieldName) => {
        return validation.find(error => error.path === fieldName);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative w-full max-w-lg transform transition-all">
                <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl shadow-2xl overflow-hidden border border-base-300">
                    {/* Header */}
                    <div className="relative p-6 bg-gradient-to-r from-secondary/10 via-secondary/5 to-transparent border-b border-base-300">
                        <button 
                            onClick={onClose}
                            className="absolute right-4 top-4 p-2 hover:bg-base-300 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-base-content/70" />
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary/10 rounded-lg">
                                <UserCircle className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-base-content">Create Account</h2>
                                <p className="text-sm text-base-content/70">Join our community today</p>
                            </div>
                        </div>
                    </div>

                    {/* Success Message */}
                    {showSuccess && (
                        <div className="m-4 p-4 bg-success/10 border border-success/20 rounded-xl">
                            <div className="flex items-center gap-3">
                                <BadgeCheck className="w-5 h-5 text-success" />
                                <div>
                                    <p className="font-medium text-success">Registration Successful!</p>
                                    <p className="text-sm text-success/80">Redirecting to login...</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                        {/* Error Messages */}
                        {(validation.length > 0 || registerFailed.message) && (
                            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                                    <div className="space-y-2">
                                        {validation.map((error, index) => (
                                            <p key={index} className="text-sm text-error">
                                                {error.path}: {error.msg}
                                            </p>
                                        ))}
                                        {registerFailed.message && (
                                            <p className="text-sm text-error">{registerFailed.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={register} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Username */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                                        <User className="w-4 h-4" />
                                        Username
                                    </label>
                                    <div className="relative">
                                        <input
                                            className={`input input-bordered w-full pl-10 ${getFieldError('username') 
                                                ? 'input-error' 
                                                : 'focus:border-primary focus:ring-2 focus:ring-primary/20'
                                            }`}
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            placeholder="johndoe"
                                            disabled={isLoading}
                                        />
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                                    </div>
                                    {getFieldError('username') && (
                                        <p className="text-xs text-error">{getFieldError('username').msg}</p>
                                    )}
                                </div>

                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                                        <UserCircle className="w-4 h-4" />
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            className={`input input-bordered w-full pl-10 ${getFieldError('name') 
                                                ? 'input-error' 
                                                : 'focus:border-primary focus:ring-2 focus:ring-primary/20'
                                            }`}
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            disabled={isLoading}
                                        />
                                        <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                                    </div>
                                    {getFieldError('name') && (
                                        <p className="text-xs text-error">{getFieldError('name').msg}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                                        <Mail className="w-4 h-4" />
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            className={`input input-bordered w-full pl-10 ${getFieldError('email') 
                                                ? 'input-error' 
                                                : 'focus:border-primary focus:ring-2 focus:ring-primary/20'
                                            }`}
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="you@example.com"
                                            disabled={isLoading}
                                        />
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                                    </div>
                                    {getFieldError('email') && (
                                        <p className="text-xs text-error">{getFieldError('email').msg}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                                        <Phone className="w-4 h-4" />
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <input
                                            className={`input input-bordered w-full pl-10 ${getFieldError('phone') 
                                                ? 'input-error' 
                                                : 'focus:border-primary focus:ring-2 focus:ring-primary/20'
                                            }`}
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+62 812 3456 7890"
                                            disabled={isLoading}
                                        />
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                                    </div>
                                    {getFieldError('phone') && (
                                        <p className="text-xs text-error">{getFieldError('phone').msg}</p>
                                    )}
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-base-content">
                                    <Lock className="w-4 h-4" />
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        className={`input input-bordered w-full pl-10 pr-10 ${getFieldError('password') 
                                            ? 'input-error' 
                                            : 'focus:border-primary focus:ring-2 focus:ring-primary/20'
                                        }`}
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Create a strong password"
                                        disabled={isLoading}
                                    />
                                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-base-300 rounded transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4 text-base-content/60" />
                                        ) : (
                                            <Eye className="w-4 h-4 text-base-content/60" />
                                        )}
                                    </button>
                                </div>
                                
                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-base-content/70">Password strength:</span>
                                            <span className={`font-medium ${
                                                passwordStrength === 0 ? 'text-error' :
                                                passwordStrength === 1 ? 'text-warning' :
                                                passwordStrength === 2 ? 'text-info' :
                                                'text-success'
                                            }`}>
                                                {getPasswordStrengthText()}
                                            </span>
                                        </div>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div 
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-all ${
                                                        level <= passwordStrength 
                                                            ? getPasswordStrengthColor() 
                                                            : 'bg-base-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <ul className="text-xs text-base-content/60 space-y-1 mt-2">
                                            <li className={`flex items-center gap-1 ${formData.password.length >= 8 ? 'text-success' : ''}`}>
                                                {formData.password.length >= 8 ? 
                                                    <CheckCircle className="w-3 h-3" /> : 
                                                    <span className="w-3 h-3 rounded-full border border-base-300" />
                                                }
                                                At least 8 characters
                                            </li>
                                            <li className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? 'text-success' : ''}`}>
                                                {/[A-Z]/.test(formData.password) ? 
                                                    <CheckCircle className="w-3 h-3" /> : 
                                                    <span className="w-3 h-3 rounded-full border border-base-300" />
                                                }
                                                One uppercase letter
                                            </li>
                                            <li className={`flex items-center gap-1 ${/[0-9]/.test(formData.password) ? 'text-success' : ''}`}>
                                                {/[0-9]/.test(formData.password) ? 
                                                    <CheckCircle className="w-3 h-3" /> : 
                                                    <span className="w-3 h-3 rounded-full border border-base-300" />
                                                }
                                                One number
                                            </li>
                                            <li className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-success' : ''}`}>
                                                {/[^A-Za-z0-9]/.test(formData.password) ? 
                                                    <CheckCircle className="w-3 h-3" /> : 
                                                    <span className="w-3 h-3 rounded-full border border-base-300" />
                                                }
                                                One special character
                                            </li>
                                        </ul>
                                    </div>
                                )}
                                {getFieldError('password') && (
                                    <p className="text-xs text-error">{getFieldError('password').msg}</p>
                                )}
                            </div>

                            {/* Terms and Conditions */}
                            <div className="space-y-3">
                                <label className="flex items-start gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary checkbox-sm mt-1"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        disabled={isLoading}
                                    />
                                    <span className="text-sm text-base-content/70">
                                        I agree to the{' '}
                                        <Link to="/terms" className="text-primary hover:underline" onClick={onClose}>
                                            Terms of Service
                                        </Link>
                                        {' '}and{' '}
                                        <Link to="/privacy" className="text-primary hover:underline" onClick={onClose}>
                                            Privacy Policy
                                        </Link>
                                    </span>
                                </label>
                                
                                <div className="flex items-center gap-2 text-xs text-success">
                                    <Shield className="w-3 h-3" />
                                    <span>Your information is secure and protected</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                className="btn btn-secondary w-full gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={isLoading || !termsAccepted || !formData.username || !formData.name || !formData.email || !formData.password}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <UserCircle className="w-4 h-4" />
                                        Create Account
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-6 pt-6 border-t border-base-300">
                            <div className="text-center text-sm">
                                <p className="text-base-content/70">
                                    Already have an account?{' '}
                                    <button
                                        className="font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                                        onClick={() => {
                                            onClose();
                                            onLoginClick();
                                        }}
                                        disabled={isLoading}
                                    >
                                        Sign in here
                                        <ArrowRight className="w-3 h-3" />
                                    </button>
                                </p>
                            </div>
                            
                            {/* Benefits */}
                            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-base-content/60">
                                <div className="flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    <span>Premium Features</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Shield className="w-3 h-3" />
                                    <span>Secure Account</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <BadgeCheck className="w-3 h-3" />
                                    <span>Verified Users</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>24/7 Support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterModal;