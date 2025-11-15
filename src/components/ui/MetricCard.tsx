import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from './card';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down';
}

export const MetricCard = ({ label, value, change, trend }: MetricCardProps) => {
  const showChange = change !== undefined && change !== 0;
  const isPositive = trend === 'up';

  return (
    <Card className="p-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {showChange && (
            <div className={`flex items-center gap-1 text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
