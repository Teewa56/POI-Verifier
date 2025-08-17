// src/context/Web3Context.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

export function Web3Provider({ children }) {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [account, setAccount] = useState(null);

    // Connect wallet (with MetaMask prompt)
    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask!');
            return;
        }
        try {
            const prov = new ethers.BrowserProvider(window.ethereum);
            const accounts = await prov.send('eth_requestAccounts', []);
            const sign = await prov.getSigner();

            setProvider(prov);
            setSigner(sign);
            setAccount(accounts[0]);

            // Persist in sessionStorage so we can reconnect silently
            sessionStorage.setItem('connectedAccount', accounts[0]);
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    };

    // Disconnect wallet (clear local state & storage)
    const disconnectWallet = () => {
        setProvider(null);
        setSigner(null);
        setAccount(null);
        sessionStorage.removeItem('connectedAccount');
    };

    // Reconnect silently on page reload (no MetaMask popup)
    useEffect(() => {
        const storedAccount = sessionStorage.getItem('connectedAccount');
        if (storedAccount && window.ethereum) {
            const prov = new ethers.BrowserProvider(window.ethereum);
            prov.listAccounts().then(async (accounts) => {
                if (accounts.length > 0) {
                    const sign = await prov.getSigner();
                    setProvider(prov);
                    setSigner(sign);
                    setAccount(accounts[0]);
                }
            });
        }
    }, []);

    return (
        <Web3Context.Provider
            value={{ provider, signer, account, connectWallet, disconnectWallet }}
        >
            {children}
        </Web3Context.Provider>
    );
}

export const useWeb3 = () => useContext(Web3Context);