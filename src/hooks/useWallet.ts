import { useState, useEffect } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { CHAIN_IDS } from '../contracts/addresses';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWallet() {
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
      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(parseInt(chainId, 16));
        window.location.reload();
      });

      // Get current chain
      window.ethereum.request({ method: 'eth_chainId' })
        .then((chainId: string) => setChainId(parseInt(chainId, 16)));
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
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
    } catch (switchError: any) {
      // Chain doesn't exist, add it
      if (switchError.code === 4902) {
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
          console.error('Error adding Fuji network:', addError);
        }
      }
    }
  };

  return {
    address,
    signer,
    provider,
    chainId,
    isConnected,
    isConnecting,
    isCorrectNetwork,
    error,
    connect,
    disconnect,
    switchToFuji,
  };
}
