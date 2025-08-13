import { renderHook, act } from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from './AuthContext';
import API from '../api/api';
import jest from 'jest';

jest.mock('../api/api');

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should initialize with no user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    expect(result.current.user).toBeNull();
  });

  it('should sign in successfully', async () => {
    API.post.mockResolvedValueOnce({
      data: {
        token: 'test-token',
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
      },
    });

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      const response = await result.current.signIn('test@example.com', 'password');
      expect(response.success).toBe(true);
      await waitForNextUpdate();
    });

    expect(result.current.user).toEqual({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    });
    expect(localStorage.getItem('token')).toBe('test-token');
  });

  it('should handle sign in failure', async () => {
    API.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      const response = await result.current.signIn('test@example.com', 'wrong');
      expect(response.success).toBe(false);
      expect(response.error).toBe('Invalid credentials');
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should sign out', async () => {
    localStorage.setItem('token', 'test-token');
    API.get.mockResolvedValueOnce({
      data: { user: { id: '1', name: 'Test User', email: 'test@example.com' } },
    });

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitForNextUpdate();

    act(() => {
      result.current.signOut();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});