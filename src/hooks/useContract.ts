import { useState, useEffect, useCallback } from 'react';
import { Contract, formatEther, parseEther } from 'ethers';
import { SP_AVAX_ABI } from '../contracts/spAVAX-abi';
import { CONTRACTS } from '../contracts/addresses';
import { useWallet } from '../contexts/WalletContext';

export function useContract() {
  const { signer, provider, address } = useWallet();
  const [contract, setContract] = useState<Contract | null>(null);
  const [stats, setStats] = useState({
    totalStaked: '0',
    totalSupply: '0',
    exchangeRate: '1.0',
    apy: '5.1', // Mock APY for now
    userBalance: '0',
    userStaked: '0',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (signer) {
      const contractInstance = new Contract(
        CONTRACTS.fuji.spAVAX,
        SP_AVAX_ABI,
        signer
      );
      setContract(contractInstance);
    } else if (provider) {
      const contractInstance = new Contract(
        CONTRACTS.fuji.spAVAX,
        SP_AVAX_ABI,
        provider
      );
      setContract(contractInstance);
    }
  }, [signer, provider]);

  useEffect(() => {
    if (contract && address) {
      loadStats();
    }
  }, [contract, address]);

  const loadStats = async () => {
    if (!contract) return;

    try {
      const [contractStats, userBalance, avaxBalance] = await Promise.all([
        contract.getStats(),
        address ? contract.balanceOf(address) : Promise.resolve(0n),
        address && provider ? provider.getBalance(address) : Promise.resolve(0n),
      ]);

      setStats({
        totalStaked: formatEther(contractStats[0]),
        totalSupply: formatEther(contractStats[1]),
        exchangeRate: (Number(formatEther(contractStats[2]))).toFixed(4),
        apy: '5.1', // Calculate from rewards later
        userBalance: formatEther(avaxBalance),
        userStaked: formatEther(userBalance),
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const stake = async (amount: string) => {
    if (!contract || !signer) throw new Error('Contract not initialized');
    
    setLoading(true);
    try {
      const tx = await contract.stake({ value: parseEther(amount) });
      await tx.wait();
      await loadStats();
      return tx;
    } finally {
      setLoading(false);
    }
  };

  const requestUnlock = async (amount: string) => {
    if (!contract || !signer) throw new Error('Contract not initialized');
    
    setLoading(true);
    try {
      const tx = await contract.requestUnlock(parseEther(amount));
      await tx.wait();
      await loadStats();
      return tx;
    } finally {
      setLoading(false);
    }
  };

  const claimUnlock = async (index: number) => {
    if (!contract || !signer) throw new Error('Contract not initialized');
    
    setLoading(true);
    try {
      const tx = await contract.claimUnlock(index);
      await tx.wait();
      await loadStats();
      return tx;
    } finally {
      setLoading(false);
    }
  };

  const getUnlockRequests = useCallback(async () => {
    if (!contract || !address) {
      console.log('No contract or address for unlock requests');
      return [];
    }
    
    try {
      const count = await contract.getUnlockRequestCount(address);
      console.log('Unlock request count:', Number(count));
      const requests = [];
      
      const now = Math.floor(Date.now() / 1000);
      
      for (let i = 0; i < Number(count); i++) {
        const request = await contract.getUnlockRequest(address, i);
        const unlockTime = Number(request[2]);
        const expiryTime = Number(request[3]);
        
        // Use frontend time calculation to avoid caching issues
        requests.push({
          index: i,
          spAvaxAmount: formatEther(request[0]),
          avaxAmount: formatEther(request[1]),
          unlockTime: unlockTime,
          expiryTime: expiryTime,
          isReady: now >= unlockTime,
          isExpired: now > expiryTime,
        });
      }
      
      console.log('Returning unlock requests:', requests);
      return requests;
    } catch (error) {
      console.error('Error getting unlock requests:', error);
      return [];
    }
  }, [contract, address]);

  return {
    contract,
    stats,
    loading,
    stake,
    requestUnlock,
    claimUnlock,
    getUnlockRequests,
    refreshStats: loadStats,
  };
}
