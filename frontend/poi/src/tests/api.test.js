import axios from 'axios';
import API from './api';
import { toast } from 'react-toastify';

jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('API Service', () => {
    beforeEach(() => {
        sessionStorage.clear();
        jest.clearAllMocks();
    });

    it('should add authorization header when token exists', () => {
        sessionStorage.setItem('token', 'test-token');
        const mockRequest = { headers: {} };
        
        API.interceptors.request.handlers[0].fulfilled(mockRequest);
        
        expect(mockRequest.headers.Authorization).toBe('Bearer test-token');
    });

    it('should not add authorization header when no token exists', () => {
        const mockRequest = { headers: {} };
        
        API.interceptors.request.handlers[0].fulfilled(mockRequest);
        
        expect(mockRequest.headers.Authorization).toBeUndefined();
    });

    it('should handle 401 error by removing token and redirecting', () => {
        const mockError = {
        response: { status: 401 },
        config: { url: '/protected' },
        };
        const originalWindowLocation = window.location;
        
        delete window.location;
        window.location = { href: '' };
        
        sessionStorage.setItem('token', 'test-token');
        
        return API.interceptors.response.handlers[0].rejected(mockError)
        .catch(() => {
            expect(sessionStorage.getItem('token')).toBeNull();
            expect(window.location.href).toBe('/');
            expect(toast.error).toHaveBeenCalledWith('An error occurred');
            
            window.location = originalWindowLocation;
        });
    });

    it('should show error message from response', () => {
        const mockError = {
        response: { data: { message: 'Custom error' } },
        };
        
        return API.interceptors.response.handlers[0].rejected(mockError)
        .catch(() => {
            expect(toast.error).toHaveBeenCalledWith('Custom error');
        });
    });

    it('should show default error message when no response', () => {
        const mockError = new Error('Network error');
        
        return API.interceptors.response.handlers[0].rejected(mockError)
        .catch(() => {
            expect(toast.error).toHaveBeenCalledWith('An error occurred');
        });
    });
});