import { NavLink } from 'react-router-dom';
import { useAuth, useTheme } from '../context';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

export default function SideNav() {
    const { user } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();

    const navItems = [
        { path: '/dashboard', name: 'Dashboard', icon: 'dashboard' },
        { path: '/submit', name: 'Submit Insight', icon: 'add' },
        { path: '/profile', name: 'Profile', icon: 'person' },
    ];

    return (
        <div className="w-64 h-screen bg-gray-800 text-white fixed left-0 top-0 p-4 flex flex-col">
            <div className="mb-8">
                <h1 className="text-xl font-bold">Proof of Insight</h1>
                {user && (
                <p className="text-sm text-gray-400 mt-1">
                    Welcome, {user.name.split(' ')[0]}
                </p>
                )}
            </div>
            
            <nav className="flex-1">
                <ul className="space-y-2">
                {navItems.map((item) => (
                    <li key={item.path}>
                    <NavLink
                        to={item.path}
                        className={({ isActive }) => 
                        `flex items-center p-2 rounded-lg transition-colors ${
                            isActive 
                            ? 'bg-blue-600' 
                            : 'hover:bg-gray-700'
                        }`
                        }
                    >
                        <span className="material-icons mr-3">{item.icon}</span>
                        {item.name}
                    </NavLink>
                    </li>
                ))}
                </ul>
            </nav>
            
            <div className="mt-auto">
                <button
                onClick={toggleDarkMode}
                className="flex items-center p-2 w-full rounded-lg hover:bg-gray-700 transition-colors"
                >
                {darkMode ? (
                    <>
                    <SunIcon className="h-5 w-5 mr-3" />
                    Light Mode
                    </>
                ) : (
                    <>
                    <MoonIcon className="h-5 w-5 mr-3" />
                    Dark Mode
                    </>
                )}
                </button>
            </div>
        </div>
    );
}