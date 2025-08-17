import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { user, signOut } = useAuth();

    return (
        <div className="mx-auto p-6 bg-gray-300 rounded-lg shadow-md">
            <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
                {user?.avatar ? (
                    <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                    />
                ) : (
                    <span className="text-3xl text-gray-500 dark:text-gray-400">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                )}
                </div>
                <h2 className="text-xl font-bold dark:text-white">{user?.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>
            
            <div className="space-y-4">                
                <button
                    onClick={signOut}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                    Sign Out
                </button>
            </div>
        </div>
    );
}