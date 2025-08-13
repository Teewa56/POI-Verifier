import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';

export default function Header() {
    const { account, connectWallet } = useWeb3();

    return (
        <header className="bg-gray-900 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">
                Proof of Insight
                </Link>
                <nav className="flex items-center space-x-6">
                <Link to="/dashboard" className="hover:text-blue-400">
                    Dashboard
                </Link>
                <Link to="/submit" className="hover:text-blue-400">
                    Submit Insight
                </Link>
                {account ? (
                    <Link to="/profile" className="hover:text-blue-400">
                    {`${account.slice(0, 6)}...${account.slice(-4)}`}
                    </Link>
                ) : (
                    <button
                    onClick={connectWallet}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                    >
                    Connect Wallet
                    </button>
                )}
                </nav>
            </div>
        </header>
    );
}