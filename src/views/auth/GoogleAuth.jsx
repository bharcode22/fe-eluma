import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import { AuthContext } from '../../context/AuthContext.jsx';
import api from '../../service/api';

export default function AithGoogle() {
    const { setIsAuthenticated, setUserRole } = useContext(AuthContext);
    const navigate = useNavigate();
    const baseUrl = api.defaults.baseURL;

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <GoogleLogin onSuccess={async credentialResponse => {
                try {
                    const decoded = jwtDecode(credentialResponse.credential);
                    console.log(decoded);

                    const res = await fetch(`${baseUrl}/auth/google-login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                            token: credentialResponse.credential 
                        })
                    });

                    const data = await res.json();
                    console.log(data);

                    // Ambil dari response backend
                    const { access_token, user } = data;

                    // Simpan ke cookies
                    Cookies.set('token', access_token);
                    Cookies.set('user', JSON.stringify(user));

                    // Update context auth
                    setIsAuthenticated(true);
                    setUserRole(user.role);

                    // Redirect sesuai role
                    if (user.role === 'admin') {
                        navigate("/admin/dashboard", { replace: true });
                    } else if (user.role === 'user') {
                        navigate("/user/home", { replace: true });
                    }
                } catch (err) {
                    console.error("Google login error:", err);
                }
            }}
            onError={() => {
                console.log("Login Failed");
            }}
        />
        </GoogleOAuthProvider>
    );
}
