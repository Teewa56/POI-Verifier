import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {useTheme} from '../context/ThemeContext';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Plus, User } from 'lucide-react';

export default function SideNav() {
    const { user } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <div className="w-1/3 h-screen bg-gray-800 text-white fixed left-0 top-0 p-4 flex flex-col">
            <div className="mb-8">
                <h1 className="text-xl font-bold">ChainInsight</h1>
                {user && (
                <p className="text-sm text-gray-400 mt-1">
                    Welcome, {user.name.split(' ')[0]}
                </p>
                )}
            </div>
            
            <nav className="flex-1">
                <ul className="space-y-2">
                    <NavLink
                        to='/'
                        className={({ isActive }) => 
                        `flex items-center p-2 rounded-lg transition-colors ${
                            isActive 
                            ? 'bg-blue-600' 
                            : 'hover:bg-gray-700'
                        }`
                        }
                    >
                        <User size={20} />
                        <p>DashBoard</p>
                    </NavLink>
                    <NavLink
                        to='/'
                        className={({ isActive }) => 
                        `flex items-center p-2 rounded-lg transition-colors ${
                            isActive 
                            ? 'bg-blue-600' 
                            : 'hover:bg-gray-700'
                        }`
                        }
                    >
                        <Plus size={20} />
                        <p>New Insight</p>
                    </NavLink>
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