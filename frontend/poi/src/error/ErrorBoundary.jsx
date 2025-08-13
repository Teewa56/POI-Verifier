import { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        console.log(error);
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                    Something went wrong
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                    We're sorry for the inconvenience. Please try refreshing the page.
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

        return this.props.children;
    }
}

export default ErrorBoundary;