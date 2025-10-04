import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Clock, CheckCircle, XCircle, AlertCircle, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { useWallet } from '../contexts/WalletContext';
import { useContract } from '../hooks/useContract';
import { formatNumber } from '../lib/utils';

interface UnlockRequest {
  index: number;
  spAvaxAmount: string;
  avaxAmount: string;
  unlockTime: number;
  expiryTime: number;
  isReady: boolean;
  isExpired: boolean;
}

interface UnstakingCardProps {
  asset: 'avax' | 'beam';
}

export function UnstakingCard({ asset }: UnstakingCardProps) {
  // Dynamic labels based on asset
  const assetName = asset === 'beam' ? 'BEAM' : 'AVAX';
  const spAssetName = asset === 'beam' ? 'spBEAM' : 'spAVAX';
  const { isConnected, connect, isConnecting } = useWallet();
  const { stats, requestUnlock, claimUnlock, getUnlockRequests, loading } = useContract({ asset });
  const [spAvaxAmount, setSpAvaxAmount] = useState('');
  const [unlockRequests, setUnlockRequests] = useState<UnlockRequest[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const exchangeRate = parseFloat(stats.exchangeRate);
  const avaxAmount = spAvaxAmount ? (parseFloat(spAvaxAmount) * exchangeRate).toFixed(4) : '0';

  useEffect(() => {
    loadUnlockRequests();
    const interval = setInterval(loadUnlockRequests, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [getUnlockRequests]);

  const loadUnlockRequests = async () => {
    setRefreshing(true);
    try {
      const requests = await getUnlockRequests();
      console.log('Loaded unlock requests:', requests); // Debug log
      setUnlockRequests(requests);
    } catch (error) {
      console.error('Error loading unlock requests:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRequestUnlock = async () => {
    if (!spAvaxAmount || parseFloat(spAvaxAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(spAvaxAmount) > parseFloat(stats.userStaked)) {
      toast.error(`Insufficient ${spAssetName} balance`);
      return;
    }

    try {
      await requestUnlock(spAvaxAmount);
      toast.success(`Unlock requested for ${spAvaxAmount} ${spAssetName}. Wait 60 seconds to claim.`);
      setSpAvaxAmount('');
      await loadUnlockRequests();
    } catch (error: any) {
      toast.error(error.message || 'Failed to request unlock');
      console.error('Request unlock error:', error);
    }
  };

  const handleClaimUnlock = async (index: number, avaxAmount: string) => {
    try {
      await claimUnlock(index);
      toast.success(`Successfully claimed ${avaxAmount} ${assetName}!`);
      await loadUnlockRequests();
    } catch (error: any) {
      toast.error(error.message || 'Failed to claim unlock');
      console.error('Claim unlock error:', error);
    }
  };

  const handleMaxClick = () => {
    setSpAvaxAmount(stats.userStaked);
  };

  const getTimeRemaining = (unlockTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = unlockTime - now;
    
    if (remaining <= 0) return 'Ready to claim!';
    
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s remaining`;
    }
    return `${seconds}s remaining`;
  };

  const getExpiryTime = (expiryTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = expiryTime - now;
    
    if (remaining <= 0) return 'Expired';
    
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    
    if (days > 0) {
      return `Expires in ${days}d ${hours}h`;
    }
    return `Expires in ${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Request Unlock Card */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Unstake {spAssetName}</CardTitle>
          <CardDescription>
            Request to unstake your {spAssetName}. Wait 60 seconds, then claim your {assetName}.
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
            <Label htmlFor="spasset-input">Amount to unstake</Label>
            <div className="relative">
              <Input
                id="spasset-input"
                type="number"
                placeholder="0.0"
                value={spAvaxAmount}
                onChange={(e) => setSpAvaxAmount(e.target.value)}
                className="pr-24 h-14 text-lg"
                step="0.0001"
                min="0"
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
                  <span className="text-sm font-medium">{spAssetName}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Balance: {formatNumber(stats.userStaked, 4)} {spAssetName}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 space-y-1">
            <p className="text-sm text-muted-foreground">You will receive</p>
            <p className="text-2xl font-bold">{avaxAmount} {assetName}</p>
            <p className="text-xs text-muted-foreground">
              After 60 second unlock period
            </p>
          </div>

          <Button
            onClick={handleRequestUnlock}
            disabled={loading || !spAvaxAmount || parseFloat(spAvaxAmount) <= 0}
            className="w-full"
            size="lg"
          >
            {loading ? 'Requesting...' : 'Request Unlock'}
          </Button>
          </>
          )}
        </CardContent>
      </Card>

      {/* Pending Unlocks Card */}
      {unlockRequests.length > 0 && (
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pending Unlocks</CardTitle>
                <CardDescription>
                  {unlockRequests.length} unlock request{unlockRequests.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadUnlockRequests}
                disabled={refreshing}
              >
                {refreshing ? '...' : '↻'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {unlockRequests.map((request) => (
              <div
                key={request.index}
                className="p-4 rounded-lg border bg-card space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">
                      {formatNumber(request.avaxAmount, 4)} {assetName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(request.spAvaxAmount, 4)} {spAssetName}
                    </p>
                  </div>
                  
                  {request.isExpired ? (
                    <div className="flex items-center gap-1 text-destructive">
                      <XCircle className="h-4 w-4" />
                      <span className="text-sm">Expired</span>
                    </div>
                  ) : request.isReady ? (
                    <div className="flex items-center gap-1 text-green-500">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Ready</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Pending</span>
                    </div>
                  )}
                </div>

                {!request.isExpired && !request.isReady && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{getTimeRemaining(request.unlockTime)}</span>
                  </div>
                )}

                {!request.isExpired && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <AlertCircle className="h-3 w-3" />
                    <span>{getExpiryTime(request.expiryTime)}</span>
                  </div>
                )}

                <Button
                  onClick={() => handleClaimUnlock(request.index, request.avaxAmount)}
                  disabled={loading || !request.isReady || request.isExpired}
                  className="w-full"
                  size="sm"
                  variant={request.isReady ? 'default' : 'outline'}
                >
                  {request.isExpired
                    ? 'Expired'
                    : request.isReady
                    ? `Claim ${assetName}`
                    : 'Waiting...'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="w-full max-w-md bg-muted/30">
        <CardContent className="pt-6">
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Unlock Period: 60 seconds</p>
                <p className="text-muted-foreground text-xs">
                  Wait 60 seconds after requesting unlock
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Claim Window: 7 days</p>
                <p className="text-muted-foreground text-xs">
                  Claim within 7 days or request expires
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
