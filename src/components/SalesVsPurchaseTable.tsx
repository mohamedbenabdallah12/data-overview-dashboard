import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getSalesVsPurchase } from '@/api/warehouseService';
import { SalesVsPurchaseDto } from '@/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const SalesVsPurchaseTable = () => {
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

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading sales vs purchase data...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Sales vs Purchase Analysis</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead className="min-w-[300px]">Product Name</TableHead>
              <TableHead className="text-center">Sales Qty</TableHead>
              <TableHead className="text-right">Sales Amount</TableHead>
              <TableHead className="text-center">Purchase Qty</TableHead>
              <TableHead className="text-right">Purchase Amount</TableHead>
              <TableHead className="text-center">Qty Difference</TableHead>
              <TableHead className="text-right">Amount Difference</TableHead>
              <TableHead className="text-center">Ratio S/P</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.stockItemKey} className="hover:bg-muted/50">
                <TableCell>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold bg-gray-100 text-gray-700">
                    {index + 1}
                  </div>
                </TableCell>
                <TableCell className="font-medium max-w-[300px]">
                  <div className="truncate" title={item.stockItemName}>
                    {item.stockItemName}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {formatNumber(item.totalSalesQuantity)}
                  </span>
                </TableCell>
                <TableCell className="text-right font-semibold text-green-600">
                  {formatCurrency(item.totalSalesAmount)}
                </TableCell>
                <TableCell className="text-center">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                    {formatNumber(item.totalPurchaseQuantity)}
                  </span>
                </TableCell>
                <TableCell className="text-right font-semibold text-purple-600">
                  {formatCurrency(item.totalPurchaseAmount)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {item.quantityDifference > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : item.quantityDifference < 0 ? (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    ) : (
                      <Minus className="w-4 h-4 text-gray-600" />
                    )}
                    <Badge variant={item.quantityDifference > 0 ? "default" : item.quantityDifference < 0 ? "destructive" : "secondary"}>
                      {item.quantityDifference > 0 ? '+' : ''}{formatNumber(item.quantityDifference)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={item.amountDifference > 0 ? "default" : item.amountDifference < 0 ? "destructive" : "secondary"}>
                    {item.amountDifference > 0 ? '+' : ''}{formatCurrency(item.amountDifference)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.salesToPurchaseRatio > 0.1 ? 'bg-green-100 text-green-800' :
                    item.salesToPurchaseRatio > 0.05 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {(item.salesToPurchaseRatio * 100).toFixed(2)}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span>Positive: Stock accumulation</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-red-600" />
          <span>Negative: Stock depletion</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 border border-yellow-400 bg-yellow-100 rounded"></span>
          <span>Low ratio: High overstocking</span>
        </div>
      </div>
    </Card>
  );
};

export default SalesVsPurchaseTable;
