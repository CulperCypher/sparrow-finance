import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { ArrowDownUp, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { useWallet } from '../contexts/WalletContext';
import { useContract } from '../hooks/useContract';
import { formatNumber } from '../lib/utils';

export function StakingCard() {
  const { isConnected, connect, isConnecting } = useWallet();
  const { stats, stake, loading } = useContract();
  const [avaxAmount, setAvaxAmount] = useState('');
  
  const exchangeRate = parseFloat(stats.exchangeRate);
  const spAvaxAmount = avaxAmount ? (parseFloat(avaxAmount) / exchangeRate).toFixed(4) : '0';

  const handleStake = async () => {
    if (!avaxAmount || parseFloat(avaxAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(avaxAmount) > parseFloat(stats.userBalance)) {
      toast.error('Insufficient AVAX balance');
      return;
    }

    if (parseFloat(avaxAmount) < 0.1) {
      toast.error('Minimum stake is 0.1 AVAX');
      return;
    }

    try {
      await stake(avaxAmount);
      toast.success(`Successfully staked ${avaxAmount} AVAX for ${spAvaxAmount} spAVAX`);
      setAvaxAmount('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to stake');
      console.error('Stake error:', error);
    }
  };

  const handleMaxClick = () => {
    // Leave a small amount for gas
    const maxAmount = Math.max(0, parseFloat(stats.userBalance) - 0.01);
    setAvaxAmount(maxAmount.toFixed(4));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Stake AVAX</CardTitle>
        <CardDescription>
          Stake your AVAX tokens to receive spAVAX and earn rewards
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
              <Label htmlFor="avax-input">You stake</Label>
              <div className="relative">
                <Input
                  id="avax-input"
                  type="number"
                  placeholder="0.0"
                  value={avaxAmount}
                  onChange={(e) => setAvaxAmount(e.target.value)}
                  className="pr-24 h-14 text-lg"
                  step="0.1"
                  min="0.1"
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
                    <span className="text-sm font-medium">AVAX</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Balance: {formatNumber(stats.userBalance, 4)} AVAX
              </p>
            </div>

            <div className="flex justify-center">
              <div className="rounded-full bg-muted p-2">
                <ArrowDownUp className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spavax-output">You receive</Label>
              <div className="relative">
                <Input
                  id="spavax-output"
                  type="text"
                  value={spAvaxAmount}
                  readOnly
                  className="pr-28 h-14 bg-muted text-lg"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-background rounded">
                    <span className="text-sm font-medium">spAVAX</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Exchange Rate: 1 spAVAX = {stats.exchangeRate} AVAX
              </p>
            </div>

            <Button
              onClick={handleStake}
              disabled={loading || !avaxAmount || parseFloat(avaxAmount) <= 0}
              className="w-full"
              size="lg"
            >
              {loading ? 'Staking...' : 'Stake AVAX'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
