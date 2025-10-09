import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { ArrowDownUp, Wallet, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useWallet } from '../contexts/WalletContext';
import { useContract } from '../hooks/useContract';
import { formatNumber } from '../lib/utils';

interface StakingCardProps {
  asset: 'avax' | 'beam';
}

export function StakingCard({ asset }: StakingCardProps) {
  const { isConnected, connect, isConnecting } = useWallet();
  const { stats, stake, loading } = useContract({ asset });
  const [amount, setAmount] = useState('');
  
  // Dynamic labels based on asset
  const assetName = asset === 'beam' ? 'BEAM' : 'AVAX';
  const spAssetName = asset === 'beam' ? 'spBEAM' : 'spAVAX';
  const assetLogo = asset === 'beam' ? '/onbeam-beam-logo.png' : '/avalanche-avax-logo (1).png';
  const spAssetLogo = asset === 'beam' ? '/spBEAM.png' : '/spAVAX.png';
  
  const exchangeRate = parseFloat(stats.exchangeRate);
  const spAmount = amount ? (parseFloat(amount) / exchangeRate).toFixed(4) : '0';

  const handleStake = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > parseFloat(stats.userBalance)) {
      toast.error(`Insufficient ${assetName} balance`);
      return;
    }

    if (parseFloat(amount) < 0.01) {
      toast.error(`Minimum stake is 0.01 ${assetName}`);
      return;
    }

    try {
      await stake(amount);
      toast.success(`Successfully staked ${amount} ${assetName} for ${spAmount} ${spAssetName}`);
      setAmount('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to stake');
      console.error('Stake error:', error);
    }
  };

  const handleMaxClick = () => {
    // Leave a small amount for gas
    const maxAmount = Math.max(0, parseFloat(stats.userBalance) - 0.01);
    setAmount(maxAmount.toFixed(4));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Stake {assetName}</CardTitle>
        <CardDescription>
          Stake your {assetName} tokens to receive {spAssetName} and earn rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConnected ? (
          <Button onClick={connect} className="w-full" size="lg" disabled={isConnecting}>
            <Wallet className="mr-2 h-5 w-5" />
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="asset-input">You stake</Label>
              <div className="relative">
                <Input
                  id="asset-input"
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-24 h-14 text-lg"
                  step="0.01"
                  min="0.01"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMaxClick}
                    className="h-8 px-2"
                    type="button"
                  >
                    MAX
                  </Button>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded">
                    <img src={assetLogo} alt={assetName} className="h-5 w-5 rounded-full" />
                    <span className="text-sm font-medium">{assetName}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Balance: {formatNumber(stats.userBalance, 4)} {assetName}
              </p>
            </div>

            <div className="flex justify-center">
              <div className="rounded-full bg-muted p-2">
                <ArrowDownUp className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spasset-output">You receive</Label>
              <div className="relative">
                <Input
                  id="spasset-output"
                  type="text"
                  value={spAmount}
                  readOnly
                  className="pr-28 h-14 bg-muted text-lg"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-background rounded">
                    <img src={spAssetLogo} alt={spAssetName} className="h-5 w-5 rounded-full" />
                    <span className="text-sm font-medium">{spAssetName}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Exchange Rate: 1 {spAssetName} = {stats.exchangeRate} {assetName}
              </p>
            </div>
            
            {asset === 'beam' && (
              <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-400">
                  Treasury rewards (ATH or other assets) are automatically converted to BEAM and added to the pool, increasing spBEAM value.
                </p>
              </div>
            )}

            <Button
              onClick={handleStake}
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className="w-full"
              size="lg"
            >
              {loading ? 'Staking...' : `Stake ${assetName}`}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
