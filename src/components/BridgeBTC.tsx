import { SupportedAssets } from '@gardenfi/orderbook';
import { useGarden } from '@gardenfi/react-hooks';
import BigNumber from 'bignumber.js';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function BridgeBTC() {
  const [btcAmount, setBtcAmount] = useState('');
  const [btcAddress, setBtcAddress] = useState('');
  const [starknetAddress, setStarknetAddress] = useState('');
  const [quote, setQuote] = useState<{
    strategyId: string;
    quoteAmount: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const { swapAndInitiate, getQuote } = useGarden();

  // Bitcoin Testnet → Ethereum Sepolia WBTC (TESTNET)
  // Note: Change to mainnet assets when ready for production
  const inputAsset = SupportedAssets.testnet.bitcoin_testnet_BTC;
  const outputAsset = SupportedAssets.testnet.ethereum_sepolia_WBTC;

  const handleGetQuote = async () => {
    if (!btcAmount || parseFloat(btcAmount) <= 0) {
      toast.error('Please enter a valid BTC amount');
      return;
    }

    if (!getQuote) {
      toast.error('Garden SDK not initialized');
      return;
    }

    setLoading(true);
    try {
      // Convert BTC to satoshis
      const amount = new BigNumber(btcAmount)
        .multipliedBy(10 ** inputAsset.decimals);

      const quoteResult = await getQuote({
        fromAsset: inputAsset,
        toAsset: outputAsset,
        amount: amount.toNumber(),
        isExactOut: false,
      });

      if (!quoteResult.ok) {
        toast.error(`Failed to get quote: ${quoteResult.error}`);
        return;
      }

      // Get the first (best) quote
      const [strategyId, quoteAmount] = Object.entries(quoteResult.val.quotes)[0];
      
      setQuote({
        strategyId,
        quoteAmount,
      });

      // Format for display
      const wbtcAmount = new BigNumber(quoteAmount)
        .dividedBy(10 ** outputAsset.decimals)
        .toFixed(8);

      toast.success(`Quote received: ${wbtcAmount} WBTC`);
    } catch (error: any) {
      toast.error(`Error getting quote: ${error.message}`);
      console.error('Quote error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBridge = async () => {
    if (!swapAndInitiate || !quote) {
      toast.error('Please get a quote first');
      return;
    }

    if (!btcAddress) {
      toast.error('Please enter your Bitcoin address');
      return;
    }

    if (!starknetAddress) {
      toast.error('Please enter your Starknet address');
      return;
    }

    setLoading(true);
    try {
      const amount = new BigNumber(btcAmount)
        .multipliedBy(10 ** inputAsset.decimals);

      const order = await swapAndInitiate({
        fromAsset: inputAsset,
        toAsset: outputAsset,
        sendAmount: amount.toString(),
        receiveAmount: quote.quoteAmount,
        additionalData: {
          btcAddress,
          starknetAddress,
          strategyId: quote.strategyId,
        },
      });

      if (!order.ok) {
        toast.error(`Bridge failed: ${order.error}`);
        return;
      }

      toast.success('Bridge initiated! Your WBTC will arrive on Starknet shortly.');
      console.log('✅ Order created:', order.val);

      // Reset form
      setBtcAmount('');
      setQuote(null);
    } catch (error: any) {
      toast.error(`Error bridging: ${error.message}`);
      console.error('Bridge error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Bridge BTC to Starknet</CardTitle>
        <CardDescription>
          Bridge your Bitcoin to Starknet as WBTC, then stake to earn STRK rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="btc-amount">BTC Amount</Label>
          <Input
            id="btc-amount"
            type="number"
            placeholder="0.01"
            value={btcAmount}
            onChange={(e) => setBtcAmount(e.target.value)}
            step="0.00000001"
            min="0.0001"
          />
          <p className="text-xs text-muted-foreground">
            Minimum: 0.0001 BTC
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="btc-address">Your Bitcoin Address</Label>
          <Input
            id="btc-address"
            type="text"
            placeholder="bc1q..."
            value={btcAddress}
            onChange={(e) => setBtcAddress(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="starknet-address">Your Starknet Address</Label>
          <Input
            id="starknet-address"
            type="text"
            placeholder="0x..."
            value={starknetAddress}
            onChange={(e) => setStarknetAddress(e.target.value)}
          />
        </div>

        {quote && (
          <div className="p-4 rounded-lg bg-muted/50 border space-y-2">
            <p className="text-sm font-medium">Quote Details:</p>
            <p className="text-sm text-muted-foreground">
              You will receive: {new BigNumber(quote.quoteAmount)
                .dividedBy(10 ** outputAsset.decimals)
                .toFixed(8)} WBTC
            </p>
            <p className="text-xs text-muted-foreground">
              Bridge time: ~10-30 minutes
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={handleGetQuote} 
            disabled={loading || !btcAmount}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Get Quote'
            )}
          </Button>

          <Button 
            onClick={handleBridge} 
            disabled={loading || !quote}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Bridging...
              </>
            ) : (
              'Bridge to Starknet'
            )}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          <p>Powered by Garden Finance</p>
          <p className="mt-1">
            After bridging, you can stake your WBTC to earn STRK rewards
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
