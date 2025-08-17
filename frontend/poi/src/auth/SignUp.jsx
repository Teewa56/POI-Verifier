import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiErrorHandler from '../utils/apiErrorHandler';
import Loading from '../components/Loading';

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        try {
            setLoading(true);
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            }
            await signUp(payload);
            setLoading(false);
            navigate('/')
        } catch (error) {
            apiErrorHandler(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
        {loading && <Loading />}
        <div className="w-full max-w-md p-8 space-y-8 bg-gray-400 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center dark:text-white">
            Create a new account
            </h2>
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder='Enter Your full name'
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                />
                </div>
                
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder='Enter your email address'
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                />
                </div>
                
                <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder='Enter Your Password'
                    required
                    minLength="8"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                />
                </div>
                
                <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder='Re-Enter Your Password'
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                />
                </div>
            </div>

            <div>
                <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                {loading ? 'Creating account...' : 'Sign up'}
                </button>
            </div>
            </form>
            
            <div className="text-center text-sm">
            <span className="text-black">
                Already have an account?{' '}
            </span>
            <Link
                to="/signin"
                className="font-medium text-black"
            >
                Sign in
            </Link>
            </div>
        </div>
        </div>
    );
}