import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { getSalesVsPurchase } from '@/api/warehouseService';
import { SalesVsPurchaseDto } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SalesVsPurchaseHistograms = () => {
  const [data, setData] = useState<SalesVsPurchaseDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSalesVsPurchase();
        setData(result);
      } catch (error) {
        console.error('Error fetching sales vs purchase data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Preparare data for different histogram types
  const salesVsPurchasesData = data.slice(0, 10).map(item => ({
    name: item.stockItemName.length > 20 ? item.stockItemName.substring(0, 20) + '...' : item.stockItemName,
    sales: item.totalSalesAmount,
    purchases: item.totalPurchaseAmount,
    difference: item.amountDifference,
    ratio: item.salesToPurchaseRatio * 100,
  }));

  const topOverstockingData = data
    .filter(item => item.quantityDifference < 0)
    .sort((a, b) => a.quantityDifference - b.quantityDifference)
    .slice(0, 10)
    .map(item => ({
      name: item.stockItemName.length > 20 ? item.stockItemName.substring(0, 20) + '...' : item.stockItemName,
      quantityExcess: Math.abs(item.quantityDifference),
      amountExcess: Math.abs(item.amountDifference),
    }));

  const ratioDistributionData = [
    { range: '0-1%', count: data.filter(item => item.salesToPurchaseRatio * 100 < 1).length },
    { range: '1-5%', count: data.filter(item => item.salesToPurchaseRatio * 100 >= 1 && item.salesToPurchaseRatio * 100 < 5).length },
    { range: '5-10%', count: data.filter(item => item.salesToPurchaseRatio * 100 >= 5 && item.salesToPurchaseRatio * 100 < 10).length },
    { range: '10%+', count: data.filter(item => item.salesToPurchaseRatio * 100 >= 10).length },
  ];

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading warehouse histograms...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sales vs Purchases Amounts */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Top 10 Products: Sales vs Purchase Amounts</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={salesVsPurchasesData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tickFormatter={(value) =>
                value >= 1000000000 ? `$${(value / 1000000000).toFixed(1)}B` :
                value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` :
                value >= 1000 ? `$${(value / 1000).toFixed(0)}K` :
                `$${value.toLocaleString()}`
              }
              tick={{ fontSize: 10 }}
            />
            <Tooltip formatter={(value, name) => [formatCurrency(Number(value)), name === 'sales' ? 'Sales' : 'Purchases']} />
            <Legend />
            <Bar dataKey="sales" fill="#3b82f6" name="sales" />
            <Bar dataKey="purchases" fill="#8b5cf6" name="purchases" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2">Blue bars: Sales amounts, Purple bars: Purchase amounts</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inventory Differences */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Top Overstocking Products</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topOverstockingData.slice(0, 5)} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tickFormatter={(value) =>
                  value >= 1000000000 ? `$${(value / 1000000000).toFixed(1)}B` :
                  value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` :
                  value >= 1000 ? `$${(value / 1000).toFixed(0)}K` :
                  value.toLocaleString()
                }
                tick={{ fontSize: 10 }}
              />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Amount Excess']} />
              <Bar dataKey="amountExcess" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2">Products with highest overstocking amounts</p>
        </Card>

        {/* Ratio Distribution */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Sales-to-Purchase Ratio Distribution</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={ratioDistributionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(value) => [value, 'Product Count']} />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2">Number of products by sales/purchase ratio range</p>
        </Card>
      </div>

      {/* Inventory Analysis */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Inventory Analysis: Positive vs Negative Differences</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={salesVsPurchasesData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tickFormatter={(value) =>
                value >= 1000000000 ? `$${(value / 1000000000).toFixed(1)}B` :
                value < -1000000000 ? `$${(value / 1000000000).toFixed(1)}B` :
                value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` :
                value < -1000000 ? `$${(value / 1000000).toFixed(1)}M` :
                value >= 1000 ? `$${(value / 1000).toFixed(0)}K` :
                value < -1000 ? `$${(value / 1000).toFixed(0)}K` :
                value.toLocaleString()
              }
              tick={{ fontSize: 10 }}
            />
            <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Amount Difference']} />
            <Bar dataKey="difference" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2">Green bars: Excess inventory, Red bars: Negative inventory (over-supply)</p>
      </Card>
    </div>
  );
};

export default SalesVsPurchaseHistograms;
