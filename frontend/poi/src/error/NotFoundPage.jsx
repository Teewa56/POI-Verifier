import { Link } from 'react-router-dom';
import { SearchX, Home } from 'lucide-react';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="bg-gray-800 rounded-2xl shadow-lg p-10 text-center max-w-md w-full transform transition-all duration-300 hover:scale-[1.02]">
                <SearchX className="mx-auto text-blue-500 dark:text-blue-400 mb-4" size={64} />
                <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">404</h1>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Page Not Found
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                The page you’re looking for doesn’t exist or has been moved.
                </p>
                <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-all"
                >
                <Home size={18} />
                Go to Homepage
                </Link>
            </div>
        </div>
  );
}
