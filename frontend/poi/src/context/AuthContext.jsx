import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const { data } = await API.get('/auth/me');
                    setUser(data.user);
                }
            } catch (error) {
                console.log(error);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const signIn = async (email, password) => {
        try {
            const { data } = await API.post('/auth/signin', { email, password });
            localStorage.setItem('token', data.token);
            setUser(data.user);
            navigate('/dashboard');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message };
        }
    };

    const signUp = async (userData) => {
        try {
            const { data } = await API.post('/auth/signup', userData);
            localStorage.setItem('token', data.token);
            setUser(data.user);
            navigate('/dashboard');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message };
        }
    };

    const signInWithGoogle = async (token) => {
        try {
            const { data } = await API.post('/auth/google', { token });
            localStorage.setItem('token', data.token);
            setUser(data.user);
            navigate('/dashboard');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message };
        }
    };

    const signOut = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
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