import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                Page Not Found
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                to="/"
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                Go to Homepage
                </Link>
            </div>
        </div>
    );
}