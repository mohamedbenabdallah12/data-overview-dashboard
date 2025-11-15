import { useEffect, useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/MetricCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMonthlySales, getSalesKpis } from '@/api/salesService';

const Index = () => {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [salesKpis, setSalesKpis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sales, sKpis] = await Promise.all([
          getMonthlySales(),
          getSalesKpis(),
        ]);
        setSalesData(sales);
        setSalesKpis(sKpis);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="text-muted-foreground">Loading dashboard...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Dashboard</h1>
          <p className="text-muted-foreground">Monitor sales metrics and performance</p>
        </div>

        {/* Sales Section */}
        <section id="sales" className="space-y-6 scroll-mt-6">
          <h2 className="text-2xl font-bold text-foreground">Sales Overview</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {salesKpis.map((kpi: any, index: number) => (
              <MetricCard key={index} label={kpi.label} value={kpi.value} change={kpi.change} trend={kpi.trend} />
            ))}
          </div>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Sales Details</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Total Sales</TableHead>
                    <TableHead>Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.map((sale: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{sale.month}</TableCell>
                      <TableCell>${sale.revenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={sale.growth >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {sale.growth >= 0 ? '+' : ''}
                          {sale.growth.toFixed(1)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
