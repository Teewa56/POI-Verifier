import { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers';
import PoIVerifier from '../contracts/PoIVerifier.json';

const Web3Context = createContext();

export function Web3Provider({ children }) {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask!');
            return;
        }

        try {
            const prov = new ethers.BrowserProvider(window.ethereum);
            const accounts = await prov.send('eth_requestAccounts', []);
            const sign = await prov.getSigner();
            const cont = new ethers.Contract(
                import.meta.env.VITE_CONTRACT_ADDRESS,
                PoIVerifier.abi,
                sign
            );

            setProvider(prov);
            setSigner(sign);
            setContract(cont);
            setAccount(accounts[0]);
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    };

    return (
        <Web3Context.Provider
            value={{ provider, signer, contract, account, connectWallet }}
        >
            {children}
        </Web3Context.Provider>
    );
}

export const useWeb3 = () => useContext(Web3Context);
