import { Component } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        console.error(error);
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-950 p-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 text-center max-w-md w-full transform transition-all duration-300 hover:scale-[1.02]">
                        <AlertTriangle className="mx-auto text-red-500 dark:text-red-400 mb-4" size={64} />
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                            Something Went Wrong
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            We’re sorry for the inconvenience. Please try refreshing the page.
                        </p>
                        <div className="flex justify-center gap-4">
                        <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow transition-all"
                            >
                                <RefreshCcw size={18} />
                                Refresh
                            </button>
                            <button
                                onClick={() => (window.location.href = '/')}
                                className="inline-flex items-center gap-2 px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg shadow transition-all"
                            >
                                <Home size={18} />
                                Homepage
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
