import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
        duration: 0.5
        }
    }
};

export default function LandingPage() {
    const { user } = useAuth();
    const { darkMode } = useTheme();

    const features = [
        {
        icon: '🔒',
        title: 'Immutable Proof',
        description: 'Store your insights permanently on the blockchain'
        },
        {
        icon: '🧠',
        title: 'AI Verification',
        description: 'Get automatic originality and sentiment analysis'
        },
        {
        icon: '📈',
        title: 'Reputation Building',
        description: 'Establish yourself as a thought leader'
        }
    ];

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ChainInsight
            </span>
            </div>
            <div className="flex items-center space-x-6">
            {user ? (
                <Link
                to="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                Go to Dashboard
                </Link>
            ) : (
                <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                Get Started
                </Link>
            )}
            </div>
        </nav>

        {/* Hero Section */}
        <motion.section 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="container mx-auto px-6 py-20 text-center rounded-2xl"
        >
            <motion.h1 
            variants={itemVariants}
            className={`text-5xl md:text-6xl font-bold mb-6 leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}
            >
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Verify
            </span>{' '}
            and{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Protect
            </span>{' '}
            Your Intellectual Contributions
            </motion.h1>
            
            <motion.p 
            variants={itemVariants}
            className={`text-xl max-w-3xl mx-auto mb-10 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
            The decentralized platform for researchers, analysts, and thought leaders to timestamp and verify their original insights on the blockchain.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex justify-center space-x-4">
            {user ? (
                <Link
                to="/submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:opacity-90 transition-opacity"
                >
                Submit New Insight
                </Link>
            ) : (
                <>
                <Link
                    to="/signup"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:opacity-90 transition-opacity"
                >
                    Get Started
                </Link>
                </>
            )}
            </motion.div>
        </motion.section>

        {/* Features Section */}
        <section className={`py-20 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="container mx-auto px-6">
            <h2 className={`text-3xl font-bold text-center mb-16 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Why Choose Proof of Insight?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`p-8 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
                >
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                    </h3>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {feature.description}
                    </p>
                </motion.div>
                ))}
            </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-6">
            <h2 className={`text-3xl font-bold text-center mb-16 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                How It Works
            </h2>
            
            <div className="max-w-4xl mx-auto">
                {[
                {
                    step: '1',
                    title: 'Submit Your Insight',
                    description: 'Share your original analysis, research, or market insight through our platform.'
                },
                {
                    step: '2',
                    title: 'AI Verification',
                    description: 'Our system analyzes your content for originality and sentiment.'
                },
                {
                    step: '3',
                    title: 'Blockchain Timestamp',
                    description: 'Get an immutable proof of your intellectual contribution on the blockchain.'
                }
                ].map((item, index) => (
                <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center mb-16`}
                >
                    <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'}`}>
                    {item.step}
                    </div>
                    <div className={`${index % 2 === 0 ? 'ml-8' : 'mr-8'}`}>
                    <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.title}
                    </h3>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {item.description}
                    </p>
                    </div>
                </motion.div>
                ))}
            </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className={`py-20 rounded-2xl ${darkMode ? 'bg-gradient-to-b from-gray-800 to-gray-900' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
            <div className="container mx-auto px-6 text-center">
            <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Ready to Protect Your Insights?
            </h2>
            <p className={`text-xl max-w-2xl mx-auto mb-10 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Join thousands of researchers and analysts who are securing their intellectual property with blockchain technology.
            </p>
            <div className="flex justify-center">
                <Link
                to={user ? "/submit" : "/signup"}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:opacity-90 transition-opacity shadow-lg"
                >
                {user ? 'Submit New Insight' : 'Get Started'}
                </Link>
            </div>
            </div>
        </section>

        {/* Footer */}
        <footer className={`py-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ChainInsight
                </span>
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                © {new Date().getFullYear()} ChainInsight. All rights reserved.
                </div>
            </div>
            </div>
        </footer>
        </div>
    );
}