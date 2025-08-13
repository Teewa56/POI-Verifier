import { toast } from 'react-toastify';

const apiErrorHandler = (error) => {
    // Log the full error for debugging
    console.error('API Error:', error);

    // Default error message
    let errorMessage = 'An unexpected error occurred';

    // Handle Axios errors
    if (error.response) {
        // Server responded with a status code outside 2xx
        const { status, data } = error.response;

        switch (status) {
        case 400:
            errorMessage = data.message || 'Bad request';
            break;
        case 401:
            errorMessage = 'Please sign in to continue';
            // Redirect to login if not already there
            if (!window.location.pathname.includes('/signin')) {
            window.location.href = '/signin';
            }
            break;
        case 403:
            errorMessage = data.message || 'You are not authorized to perform this action';
            break;
        case 404:
            errorMessage = data.message || 'Resource not found';
            break;
        case 500:
            errorMessage = data.message || 'Internal server error';
            break;
        default:
            errorMessage = data.message || `HTTP error: ${status}`;
        }
    } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Network error - please check your connection';
    } else {
        // Something happened in setting up the request
        errorMessage = error.message || 'Request setup error';
    }

    // Show error toast
    toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    // Return the error message for further handling if needed
    return errorMessage;
};

export default apiErrorHandler;