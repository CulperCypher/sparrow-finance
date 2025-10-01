import { Card, CardContent } from './ui/card';
import { useContract } from '../hooks/useContract';
import { formatNumber } from '../lib/utils';

interface StatProps {
  label: string;
  value: string;
  subvalue?: string;
}

function Stat({ label, value, subvalue }: StatProps) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {subvalue && (
        <p className="text-sm text-muted-foreground">{subvalue}</p>
      )}
    </div>
  );
}

export function StatsCard() {
  const { stats } = useContract();

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-6">
          <Stat 
            label="APY" 
            value={`${stats.apy}%`}
            subvalue="Annual Percentage Yield"
          />
          <Stat 
            label="Total Staked" 
            value={formatNumber(stats.totalStaked, 2)}
            subvalue="AVAX"
          />
          <Stat 
            label="Your Staked" 
            value={formatNumber(stats.userStaked, 4)}
            subvalue="spAVAX"
          />
          <Stat 
            label="Your Value" 
            value={formatNumber(parseFloat(stats.userStaked) * parseFloat(stats.exchangeRate), 4)}
            subvalue="AVAX"
          />
        </div>
      </CardContent>
    </Card>
  );
}
