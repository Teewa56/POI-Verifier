import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import apiErrorHandler from '../utils/apiErrorHandler';
import Loading from '../components/Loading';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [showGSign, setShowGSign] = useState(false);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);
            await signIn(email, password);
            setLoading(false);
        } catch (error) {
            apiErrorHandler(error);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const result = await signInWithGoogle(credentialResponse.credential);
        if (!result.success) {
            toast.error(result.error || 'Google sign in failed');
        }
    };

    const handleGoogleError = () => {
        toast.error('Google sign in failed');
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            {loading && <Loading />}
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-400 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center dark:text-white">
                Sign in to your account
                </h2>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder='Enter Your mail here'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                    />
                    </div>
                    
                    <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder='Enter your password here'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                    />
                    </div>
                </div>

                <div>
                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                    {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </div>
                </form>
                
                {showGSign && 
                <>
                <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-400" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or continue with
                    </span>
                </div>
                </div>
                
                <div className="flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                />
                </div>
                </>}
                
                <div className="text-center text-sm">
                <span className="text-black">
                    Don't have an account?{' '}
                </span>
                <button
                    disabled={loading}
                    onClick={() => navigate('/signup')}
                    className="font-medium text-black"
                >
                    Sign up
                </button>
                </div>
            </div>
        </div>
    );
}