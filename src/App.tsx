import { useState } from 'react';
import { StakingCard } from './components/StakingCard';
import { UnstakingCard } from './components/UnstakingCard';
import { StatsCard } from './components/StatsCard';
// import { BridgeBTC } from './components/BridgeBTC'; // Temporarily disabled until GardenProvider is set up
import { Button } from './components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { Toaster } from './components/ui/sonner';
import { LogOut, AlertCircle } from 'lucide-react';
import { useWallet } from './contexts/WalletContext';
import { formatAddress } from './lib/utils';

export default function App() {
  const { isConnected, address, disconnect, chainId, switchToFuji, switchToBeam } = useWallet();
  
  // Persist selected asset across page reloads
  const [selectedAsset, setSelectedAsset] = useState<'avax' | 'beam' | 'strk' | 'btc'>(() => {
    const saved = localStorage.getItem('selectedAsset');
    return (saved as 'avax' | 'beam' | 'strk' | 'btc') || 'avax';
  });
  
  // Save to localStorage whenever selection changes
  const handleAssetChange = (asset: 'avax' | 'beam' | 'strk' | 'btc') => {
    setSelectedAsset(asset);
    localStorage.setItem('selectedAsset', asset);
  };
  
  // Determine correct network based on selected asset
  const requiredChainId = selectedAsset === 'beam' ? 13337 : 43113;
  const isCorrectNetwork = chainId === requiredChainId;
  const switchNetwork = selectedAsset === 'beam' ? switchToBeam : switchToFuji;
  const networkName = selectedAsset === 'beam' ? 'Beam L1 Testnet' : 'Avalanche Fuji Testnet';
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake');

  return (
    <div className="dark min-h-screen bg-background">
      <Toaster />
      
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <img src="/Golden Sparrow Logo Design.png" alt="Sparrow Finance" className="h-10 w-10 rounded-full bg-background p-1" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#D4AF37]">Sparrow Finance</h1>
              <p className="text-sm text-[#D4AF37]">Sparrow Finance Liquid Staking</p>
            </div>
          </div>
          
          {isConnected && (
            <Button variant="outline" onClick={disconnect} className="text-[#D4AF37] border-[#D4AF37] hover:bg-[#D4AF37]/10">
              <LogOut className="mr-2 h-4 w-4" />
              {formatAddress(address)}
            </Button>
          )}
        </div>
      </header>

      {/* Wrong Network Warning - Removed from header, moved below */}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-[#999999]">Multi-Chain Liquid Staking</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stake your assets across multiple chains and earn rewards while maintaining liquidity.
            </p>
          </div>

          {/* Asset Selection */}
          <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-4 mx-auto snap-x snap-mandatory scrollbar-hide pb-4 px-4 md:px-8 md:py-4">
            {/* AVAX Card */}
            <button
              onClick={() => handleAssetChange('avax')}
              className={`flex-shrink-0 w-[280px] md:w-auto p-6 rounded-lg border-2 transition-all md:hover:scale-105 snap-center ${
                selectedAsset === 'avax' 
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10' 
                  : 'border-border bg-card hover:border-[#D4AF37]/50'
              }`}
            >
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <img src="/avalanche-avax-logo (1).png" alt="Avalanche" className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">AVAX</h3>
                <p className="text-sm text-muted-foreground">Avalanche</p>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">APY</p>
                  <p className="text-lg font-semibold text-[#D4AF37]">~5.1%</p>
                </div>
                {selectedAsset === 'avax' && (
                  <div className="pt-2">
                    <span className="text-xs bg-[#D4AF37] text-black px-2 py-1 rounded">Selected</span>
                  </div>
                )}
                <div className="pt-2">
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Testnet Live</span>
                </div>
              </div>
            </button>

            {/* STRK Card */}
            <button
              onClick={() => handleAssetChange('strk')}
              className={`flex-shrink-0 w-[280px] md:w-auto p-6 rounded-lg border-2 transition-all md:hover:scale-105 snap-center ${
                selectedAsset === 'strk' 
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10' 
                  : 'border-border bg-card hover:border-[#D4AF37]/50'
              }`}
            >
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <img src="/starknet-token-strk-logo.png" alt="Starknet" className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">STRK</h3>
                <p className="text-sm text-muted-foreground">Starknet</p>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">APY</p>
                  <p className="text-lg font-semibold text-[#D4AF37]">~8.2%</p>
                </div>
                {selectedAsset === 'strk' && (
                  <div className="pt-2">
                    <span className="text-xs bg-[#D4AF37] text-black px-2 py-1 rounded">Selected</span>
                  </div>
                )}
                <div className="pt-2">
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Coming Soon</span>
                </div>
              </div>
            </button>

            {/* BEAM Card */}
            <button
              onClick={() => handleAssetChange('beam')}
              className={`flex-shrink-0 w-[280px] md:w-auto p-6 rounded-lg border-2 transition-all md:hover:scale-105 snap-center ${
                selectedAsset === 'beam' 
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10' 
                  : 'border-border bg-card hover:border-[#D4AF37]/50'
              }`}
            >
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <img src="/onbeam-beam-logo.png" alt="Beam" className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">BEAM</h3>
                <p className="text-sm text-muted-foreground">Beam Testnet</p>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">APY</p>
                  <p className="text-lg font-semibold text-[#D4AF37]">~5.0%</p>
                </div>
                {selectedAsset === 'beam' && (
                  <div className="pt-2">
                    <span className="text-xs bg-[#D4AF37] text-black px-2 py-1 rounded">Selected</span>
                  </div>
                )}
                <div className="pt-2">
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Testnet Live</span>
                </div>
              </div>
            </button>

            {/* BTC Card */}
            <button
              onClick={() => handleAssetChange('btc')}
              className={`flex-shrink-0 w-[280px] md:w-auto p-6 rounded-lg border-2 transition-all md:hover:scale-105 snap-center ${
                selectedAsset === 'btc' 
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10' 
                  : 'border-border bg-card hover:border-[#D4AF37]/50'
              }`}
            >
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <img src="/bitcoin-btc-logo.png" alt="Bitcoin" className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Bitcoin</h3>
                <p className="text-sm text-muted-foreground">→ Starknet</p>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">Rewards</p>
                  <p className="text-lg font-semibold text-[#D4AF37]">STRK</p>
                </div>
                {selectedAsset === 'btc' && (
                  <div className="pt-2">
                    <span className="text-xs bg-[#D4AF37] text-black px-2 py-1 rounded">Selected</span>
                  </div>
                )}
                <div className="pt-2">
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Coming Soon</span>
                </div>
              </div>
            </button>
          </div>

          {/* Staking Interface - Dynamic based on selected asset */}
          <div className="flex flex-col items-center gap-6">
            {(selectedAsset === 'avax' || selectedAsset === 'beam') && (
              <>
                {/* Network Warning - Right above staking card */}
                {isConnected && !isCorrectNetwork && (
                  <div className="w-full max-w-md bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span className="text-[#D4AF37]">Please switch to {networkName}</span>
                      </div>
                      <Button size="sm" onClick={switchNetwork}>
                        Switch Network
                      </Button>
                    </div>
                  </div>
                )}
                
                <Tabs className="w-full max-w-md">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      active={activeTab === 'stake'}
                      onClick={() => setActiveTab('stake')}
                    >
                      Stake {selectedAsset === 'beam' ? 'BEAM' : 'AVAX'}
                    </TabsTrigger>
                    <TabsTrigger
                      active={activeTab === 'unstake'}
                      onClick={() => setActiveTab('unstake')}
                    >
                      Unstake
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent>
                    {activeTab === 'stake' && <StakingCard asset={selectedAsset} />}
                    {activeTab === 'unstake' && <UnstakingCard asset={selectedAsset} />}
                  </TabsContent>
                </Tabs>
                {isConnected && <StatsCard asset={selectedAsset} />}
              </>
            )}

            {selectedAsset === 'strk' && (
              <div className="w-full max-w-md p-8 rounded-lg border bg-card text-center">
                <h3 className="text-xl font-semibold text-foreground mb-3">STRK Staking Coming Soon!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Stake STRK tokens on Starknet to receive spSTRK and earn staking rewards.
                </p>
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <span className="text-green-500">✓</span>
                    <span>Liquid staking on Starknet</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <span className="text-green-500">✓</span>
                    <span>Earn ~8.2% APY in STRK</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <span className="text-green-500">✓</span>
                    <span>Use spSTRK in DeFi</span>
                  </div>
                </div>
              </div>
            )}

            {selectedAsset === 'btc' && (
              <div className="w-full max-w-md p-8 rounded-lg border bg-card text-center">
                <h3 className="text-xl font-semibold text-foreground mb-3">Bitcoin Staking Coming Soon!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Bridge your Bitcoin to Starknet and stake to earn STRK rewards.
                </p>
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <span className="text-green-500">✓</span>
                    <span>Bridge BTC → WBTC (Starknet)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <span className="text-green-500">✓</span>
                    <span>Stake WBTC → spBTC</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <span className="text-green-500">✓</span>
                    <span>Earn STRK rewards</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <span className="text-green-500">✓</span>
                    <span>100M STRK incentive program</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 rounded-lg bg-muted/50 border space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Liquid Staking</h3>
              <p className="text-sm text-muted-foreground">
                Receive spAVAX tokens that represent your staked AVAX, allowing you to use them in DeFi while earning rewards.
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-muted/50 border space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Instant Liquidity</h3>
              <p className="text-sm text-muted-foreground">
                Trade or use your spAVAX across various protocols without waiting for unstaking periods.
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-muted/50 border space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Auto-Compounding</h3>
              <p className="text-sm text-muted-foreground">
                Staking rewards are automatically reinvested, increasing the value of your spAVAX over time.
              </p>
            </div>
          </div>
          {/* Contract Info */}
          <div className="mt-12 p-4 rounded-lg bg-muted/50 border">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                spAVAX Contract: <code className="text-xs bg-background px-2 py-1 rounded">0xd5be2F451C0B1B8cA17Cc64a1f904405B8120c9B</code>
              </p>
              <p className="text-sm text-muted-foreground">
                spBEAM Contract: <code className="text-xs bg-background px-2 py-1 rounded">0x21e9726d777400c5dcBF65cF595125B21359A1DD</code>
              </p>
              <p className="text-xs text-muted-foreground">
                spAVAX Deployed on Avalanche Fuji Testnet • 
                <a 
                  href="https://testnet.snowtrace.io/address/0xd5be2F451C0B1B8cA17Cc64a1f904405B8120c9B" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 underline hover:text-foreground"
                >
                  View on Snowtrace
                </a>
              </p>
              <p className="text-xs text-muted-foreground">
                spBEAM Deployed on BEAM Testnet • 
                <a 
                  href="https://testnet.snowtrace.io/address/0xd5be2F451C0B1B8cA17Cc64a1f904405B8120c9B" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 underline hover:text-foreground"
                >
                  View on Snowtrace
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">© 2025 Sparrow Finance. All rights reserved.</p>
          <p className="text-xs mt-2">
            Fuji Testnet • Get test AVAX from{' '}
            <a 
              href="https://faucet.avax.network/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Avalanche Faucet
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
