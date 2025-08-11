import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-gray-900 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">
                Proof of Insight
                </Link>
                <nav>
                    <ul className="flex space-x-6">
                        <li><Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link></li>
                        <li><Link to="/submit" className="hover:text-blue-400">Submit Insight</Link></li>
                        <li><Link to="/profile" className="hover:text-blue-400">Profile</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;