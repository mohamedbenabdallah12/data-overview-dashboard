import { useEffect, useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/MetricCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMonthlySales, getSalesKpis } from '@/api/salesService';
import { getProductStats } from '@/api/productsService';
import { getWarehouseData, getWarehouseKpis } from '@/api/warehouseService';

const Index = () => {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [salesKpis, setSalesKpis] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [warehouseKpis, setWarehouseKpis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sales, sKpis, prods, whs, wKpis] = await Promise.all([
          getMonthlySales(),
          getSalesKpis(),
          getProductStats(),
          getWarehouseData(),
          getWarehouseKpis(),
        ]);
        setSalesData(sales);
        setSalesKpis(sKpis);
        setProducts(prods);
        setWarehouses(whs);
        setWarehouseKpis(wKpis);
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
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your business metrics and performance</p>
        </div>

        {/* Sales Section */}
        <section id="sales" className="space-y-6 scroll-mt-6">
          <h2 className="text-2xl font-bold text-foreground">Sales Overview</h2>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {salesKpis.map((kpi: any, index: number) => (
              <MetricCard
                key={index}
                label={kpi.label}
                value={kpi.value}
                change={kpi.change}
                trend={kpi.trend}
              />
            ))}
          </div>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Sales Details</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesData.map((sale: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{sale.month}</TableCell>
                    <TableCell>${sale.revenue.toLocaleString()}</TableCell>
                    <TableCell>{sale.orders}</TableCell>
                    <TableCell>
                      <span className={sale.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {sale.growth >= 0 ? '+' : ''}{sale.growth}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>

        {/* Products Section */}
        <section id="products" className="space-y-6 scroll-mt-6">
          <h2 className="text-2xl font-bold text-foreground">Products Analytics</h2>
          
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Product Details</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: any) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.sales}</TableCell>
                    <TableCell>${product.revenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>

        {/* Warehouse Section */}
        <section id="warehouse" className="space-y-6 scroll-mt-6">
          <h2 className="text-2xl font-bold text-foreground">Warehouse Operations</h2>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {warehouseKpis.map((kpi: any, index: number) => (
              <MetricCard
                key={index}
                label={kpi.label}
                value={kpi.value}
                change={kpi.change}
                trend={kpi.trend}
              />
            ))}
          </div>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Warehouse Details</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouses.map((warehouse: any) => (
                  <TableRow key={warehouse.id}>
                    <TableCell>{warehouse.location}</TableCell>
                    <TableCell>{warehouse.capacity.toLocaleString()}</TableCell>
                    <TableCell>{warehouse.currentStock.toLocaleString()}</TableCell>
                    <TableCell>
                      {((warehouse.currentStock / warehouse.capacity) * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell>{warehouse.lastUpdated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
