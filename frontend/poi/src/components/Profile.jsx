import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { user, signOut } = useAuth();

    return (
        <div className="mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
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
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold mb-2 dark:text-white">Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Insights</p>
                    <p className="font-bold dark:text-white">{user?.insightCount || 0}</p>
                    </div>
                    <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Originality</p>
                    <p className="font-bold dark:text-white">
                        {user?.avgOriginality ? user.avgOriginality.toFixed(1) : 'N/A'}
                    </p>
                    </div>
                </div>
                </div>
                
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