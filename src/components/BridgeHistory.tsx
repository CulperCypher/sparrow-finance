import { ParseOrderStatus } from '@gardenfi/core';
import { useGarden } from '@gardenfi/react-hooks';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';

interface Order {
  orderId: string;
  fromAsset: string;
  toAsset: string;
  sendAmount: string;
  receiveAmount: string;
  timestamp: number;
  status?: string;
}

export function BridgeHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [blockNumbers, setBlockNumbers] = useState<any>(null);
  const { getOrders } = useGarden();

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    if (!getOrders) return;

    try {
      const ordersResult = await getOrders();
      if (ordersResult.ok) {
        // Parse order statuses
        const ordersWithStatus = ordersResult.val.map((order: any) => {
          const status = ParseOrderStatus(
            order,
            blockNumbers?.val?.[order.source_swap.chain],
            blockNumbers?.val?.[order.destination_swap.chain]
          );
          
          return {
            orderId: order.orderId,
            fromAsset: order.source_swap.asset,
            toAsset: order.destination_swap.asset,
            sendAmount: order.source_swap.amount,
            receiveAmount: order.destination_swap.amount,
            timestamp: order.timestamp,
            status,
          };
        });

        setOrders(ordersWithStatus);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'Redeemed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'Expired':
      case 'Refunded':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Initiated':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'Redeemed': 'default',
      'Initiated': 'secondary',
      'Expired': 'destructive',
      'Refunded': 'destructive',
    };

    return (
      <Badge variant={variants[status || ''] || 'outline'}>
        {status || 'Processing'}
      </Badge>
    );
  };

  if (orders.length === 0) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Bridge History</CardTitle>
          <CardDescription>Your recent bridge transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No bridge transactions yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Bridge History</CardTitle>
            <CardDescription>Track your bridge transactions</CardDescription>
          </div>
          <RefreshCw 
            className="h-4 w-4 cursor-pointer hover:text-primary" 
            onClick={loadOrders}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order.orderId}
              className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className="text-sm font-medium">
                    {order.fromAsset} → {order.toAsset}
                  </span>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Send:</span>
                  <span className="font-mono">{order.sendAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Receive:</span>
                  <span className="font-mono">{order.receiveAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{new Date(order.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {order.status === 'Initiated' && (
                <div className="mt-3 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    ⏳ Waiting for counterparty to complete the swap
                  </p>
                </div>
              )}

              {order.status === 'Redeemed' && (
                <div className="mt-3 p-2 rounded bg-green-500/10 border border-green-500/20">
                  <p className="text-xs text-green-600 dark:text-green-400">
                    ✅ Bridge completed successfully!
                  </p>
                </div>
              )}

              {(order.status === 'Expired' || order.status === 'Refunded') && (
                <div className="mt-3 p-2 rounded bg-red-500/10 border border-red-500/20">
                  <p className="text-xs text-red-600 dark:text-red-400">
                    ❌ {order.status === 'Expired' ? 'Order expired - refund available' : 'Order refunded'}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
