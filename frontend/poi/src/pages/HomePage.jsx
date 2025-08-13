import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InsightCard from '../components/InsightCard';
import { useTheme } from '../context/ThemeContext';

export default function HomePage() {
    const { user } = useAuth();
    const { darkMode } = useTheme();
    const [featuredInsights, setFeaturedInsights] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchFeaturedInsights = async () => {
            try {
                // In a real app, you would call your API here
                const mockInsights = [
                {
                    id: '1',
                    title: 'The Future of Blockchain',
                    content: 'Exploring how blockchain technology will evolve in the next decade...',
                    tags: ['blockchain', 'future'],
                    originalityScore: 92,
                    sentimentScore: 45,
                    createdAt: new Date().toISOString()
                },
                {
                    id: '2',
                    title: 'AI in Financial Markets',
                    content: 'How artificial intelligence is transforming algorithmic trading...',
                    tags: ['AI', 'finance'],
                    originalityScore: 88,
                    sentimentScore: 30,
                    createdAt: new Date().toISOString()
                }
                ];
                setFeaturedInsights(mockInsights);
            } catch (error) {
                console.error('Failed to fetch insights:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedInsights();
    }, []);

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <section className="text-center py-12">
                <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Proof of Insight Verifier
                </h1>
                <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Verify and showcase your intellectual contributions on the blockchain
                </p>
                {user ? (
                    <Link
                    to="/submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg inline-block"
                    >
                    Submit Your Insight
                    </Link>
                ) : (
                    <div className="space-x-4">
                    <Link
                        to="/signup"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg inline-block"
                    >
                        Get Started
                    </Link>
                    <Link
                        to="/signin"
                        className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg inline-block"
                    >
                        Sign In
                    </Link>
                    </div>
                )}
                </section>

                {/* Featured Insights */}
                <section className="py-8">
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Featured Insights
                </h2>
                
                {loading ? (
                    <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredInsights.map((insight) => (
                        <InsightCard key={insight.id} insight={insight} />
                    ))}
                    </div>
                )}
                </section>

                {/* How It Works */}
                <section className="py-8">
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                    {
                        title: 'Submit',
                        description: 'Share your original insights and analysis',
                        icon: '📝'
                    },
                    {
                        title: 'Verify',
                        description: 'Our AI verifies the originality and quality',
                        icon: '🔍'
                    },
                    {
                        title: 'Publish',
                        description: 'Get immutable proof on the blockchain',
                        icon: '⛓️'
                    }
                    ].map((step, index) => (
                    <div 
                        key={index} 
                        className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
                    >
                        <div className="text-4xl mb-4">{step.icon}</div>
                        <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {step.title}
                        </h3>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {step.description}
                        </p>
                    </div>
                    ))}
                </div>
                </section>
            </div>
        </div>
    );
}