import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { CHAIN_IDS } from '../contracts/addresses';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletContextType {
  address: string;
  signer: JsonRpcSigner | null;
  provider: BrowserProvider | null;
  chainId: number | null;
  isConnecting: boolean;
  error: string;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToFuji: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string>('');
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');

  const isConnected = !!address;
  const isCorrectNetwork = chainId === CHAIN_IDS.fuji;

  useEffect(() => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      setProvider(provider);

      // Check if already connected and get chain ID
      const initWallet = async () => {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            const signer = await provider.getSigner();
            setSigner(signer);
            
            // Get chain ID
            const network = await provider.getNetwork();
            setChainId(Number(network.chainId));
          }
        } catch (error) {
          console.error('Error initializing wallet:', error);
        }
      };
      
      initWallet();

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          provider.getSigner().then(setSigner);
        } else {
          setAddress('');
          setSigner(null);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  const connect = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask or Core Wallet');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        const signer = await provider.getSigner();
        setSigner(signer);
        setProvider(provider);

        // Get chain ID
        const network = await provider.getNetwork();
        setChainId(Number(network.chainId));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress('');
    setSigner(null);
  };

  const switchToFuji = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CHAIN_IDS.fuji.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${CHAIN_IDS.fuji.toString(16)}`,
              chainName: 'Avalanche Fuji Testnet',
              nativeCurrency: {
                name: 'AVAX',
                symbol: 'AVAX',
                decimals: 18,
              },
              rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
              blockExplorerUrls: ['https://testnet.snowtrace.io/'],
            }],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
        }
      }
    }
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        signer,
        provider,
        chainId,
        isConnecting,
        error,
        isConnected,
        isCorrectNetwork,
        connect,
        disconnect,
        switchToFuji,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
