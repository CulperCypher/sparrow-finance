import { useState } from 'react';
import { StakingCard } from './components/StakingCard';
import { UnstakingCard } from './components/UnstakingCard';
import { StatsCard } from './components/StatsCard';
import { Button } from './components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { Toaster } from './components/ui/sonner';
import { LogOut, AlertCircle } from 'lucide-react';
import { useWallet } from './contexts/WalletContext';
import { formatAddress } from './lib/utils';

export default function App() {
  const { isConnected, address, disconnect, isCorrectNetwork, switchToFuji } = useWallet();
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake');

  return (
    <div className="dark min-h-screen bg-background">
      <Toaster />
      
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <img src="/Untitled design (2) (1).png" alt="Sparrow Finance" className="h-10 w-10" />
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

      {/* Wrong Network Warning */}
      {isConnected && !isCorrectNetwork && (
        <div className="bg-destructive/10 border-b border-destructive/20">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span>Please switch to Avalanche Fuji Testnet</span>
            </div>
            <Button size="sm" onClick={switchToFuji}>
              Switch Network
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-[#999999]">Stake AVAX, Earn Rewards</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stake your AVAX tokens to receive spAVAX while earning staking rewards. 
              Your spAVAX can be used across DeFi protocols while continuing to accrue value.
            </p>
          </div>

          {/* Staking Interface */}
          <div className="flex flex-col items-center gap-6">
            <Tabs className="w-full max-w-md">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  active={activeTab === 'stake'}
                  onClick={() => setActiveTab('stake')}
                >
                  Stake
                </TabsTrigger>
                <TabsTrigger
                  active={activeTab === 'unstake'}
                  onClick={() => setActiveTab('unstake')}
                >
                  Unstake
                </TabsTrigger>
              </TabsList>
              
              <TabsContent>
                {activeTab === 'stake' ? <StakingCard /> : <UnstakingCard />}
              </TabsContent>
            </Tabs>
            
            {isConnected && isCorrectNetwork && <StatsCard />}
          </div>

          {/* Info Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 rounded-lg bg-card border space-y-2">
              <h3 className="text-lg font-semibold">Liquid Staking</h3>
              <p className="text-sm text-muted-foreground">
                Receive spAVAX tokens that represent your staked AVAX, allowing you to use them in DeFi while earning rewards.
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-card border space-y-2">
              <h3 className="text-lg font-semibold">Instant Liquidity</h3>
              <p className="text-sm text-muted-foreground">
                Trade or use your spAVAX across various protocols without waiting for unstaking periods.
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-card border space-y-2">
              <h3 className="text-lg font-semibold">Auto-Compounding</h3>
              <p className="text-sm text-muted-foreground">
                Staking rewards are automatically reinvested, increasing the value of your spAVAX over time.
              </p>
            </div>
          </div>

          {/* Contract Info */}
          <div className="mt-12 p-4 rounded-lg bg-muted/50 border">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Contract: <code className="text-xs bg-background px-2 py-1 rounded">0x8F89...69D2</code>
              </p>
              <p className="text-xs text-muted-foreground">
                Deployed on Avalanche Fuji Testnet • 
                <a 
                  href="https://testnet.snowtrace.io/address/0x8F8926A38D03125c448b5EF5f2Edbfc3BE8C69D2" 
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
