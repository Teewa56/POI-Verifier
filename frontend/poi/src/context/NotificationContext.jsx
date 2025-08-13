import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;

        const socket = io(import.meta.env.REACT_APP_SOCKET_URL, {
        auth: { token: localStorage.getItem('token') }
        });

        socket.on('new_notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        });

        return () => socket.disconnect();
    }, [user]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
        ));
        setUnreadCount(prev => prev - 1);
    };

    return (
        <NotificationContext.Provider
        value={{ notifications, unreadCount, markAsRead }}
        >
        {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => useContext(NotificationContext);