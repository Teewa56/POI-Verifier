import { createContext, useContext, useState, useEffect } from 'react';
import {Login, Logout, Register, GetProfile, LoginWithGoogle} from '../api/api';
import { GoogleLogin } from '@react-oauth/google';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (token) {
                    const { data } = await GetProfile();
                    setUser(data.user);
                }
            } catch (error) {
                console.log(error);
                sessionStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const signIn = async (email, password) => {
        try {
            const { data } = await Login(email, password);
            sessionStorage.setItem('token', data.token);
            setUser(data.user);
            window.location.href = '/';
            return { success: true };
        } catch (error) {
            console.log(error)
            return { success: false, error: error.response?.data?.message };
        }
    };

    const signUp = async (userData) => {
        try {
            const { data } = await Register(userData);
            sessionStorage.setItem('token', data.token);
            setUser(data.user);
            window.location.href = '/';
            return { success: true };
        } catch (error) {
            console.log(error)
            return { success: false, error: error.response?.data?.message };
        }
    };

    const signInWithGoogle = async (token) => {
        try {
            const { data } = await GoogleLogin(token);
            const response = await LoginWithGoogle(data.token);
            sessionStorage.setItem('token', response.token);
            setUser(response.user);
            window.location.href = '/';
            return { success: true };
        } catch (error) {
            console.log(error)
            return { success: false, error: error.response?.data?.message };
        }
    };

    const signOut = async() => {
        try{
            await Logout();
            sessionStorage.clear();
            setUser(null);
            window.location.href = '/';
        }catch(error){
            console.log(error)
            return { success: false, error: error.response?.data?.message };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signIn,
                signUp,
                signInWithGoogle,
                signOut,
            }}
            >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);