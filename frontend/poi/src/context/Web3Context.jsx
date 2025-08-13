import { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import PoIVerifier from '../contracts/PoIVerifier.json';

const Web3Context = createContext();

export function Web3Provider({ children }) {
    const [state, setState] = useState({
        connectWallet: async () => {},
    });

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask!');
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send('eth_requestAccounts', []);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
                import.meta.env.VITE_CONTRACT_ADDRESS,
                PoIVerifier.abi,
                signer
            );

            setState({
                provider,
                signer,
                contract,
                account: accounts[0],
                connectWallet,
            });
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                setState(prev => ({ ...prev, account: accounts[0] }));
            });
        }
    }, [setState]);

    return (
        <Web3Context.Provider value={{ ...state, connectWallet }}>
            {children}
        </Web3Context.Provider>
    );
}

export const useWeb3 = () => useContext(Web3Context);