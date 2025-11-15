import { useEffect, useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/MetricCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw } from 'lucide-react';
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

  // Filter states
  const [productCategory, setProductCategory] = useState('all');
  const [warehouseLocation, setWarehouseLocation] = useState('all');

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

  // Filter logic
  const filteredProducts = products.filter((product) =>
    productCategory === 'all' ? true : product.category === productCategory
  );

  const filteredWarehouses = warehouses.filter((warehouse) =>
    warehouseLocation === 'all' ? true : warehouse.location === warehouseLocation
  );

  const productCategories = [...new Set(products.map((p) => p.category))];
  const warehouseLocations = [...new Set(warehouses.map((w) => w.location))];

  const resetFilters = () => {
    setProductCategory('all');
    setWarehouseLocation('all');
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Monitor your business metrics and performance</p>
          </div>
          <Button variant="outline" onClick={resetFilters}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
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
                    <TableHead>Revenue</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.map((sale: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{sale.month}</TableCell>
                      <TableCell>${sale.revenue.toLocaleString()}</TableCell>
                      <TableCell>{sale.orders}</TableCell>
                      <TableCell>
                        <span className={sale.growth >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {sale.growth >= 0 ? '+' : ''}
                          {sale.growth}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </section>

        {/* Products Section */}
        <section id="products" className="space-y-6 scroll-mt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-foreground">Products Analytics</h2>
            <Select value={productCategory} onValueChange={setProductCategory}>
              <SelectTrigger className="w-[200px] bg-background">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Categories</SelectItem>
                {productCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Top Products</h3>
              <div className="space-y-4">
                {filteredProducts.slice(0, 5).map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">${product.revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Category Summary</h3>
              <div className="space-y-3">
                {Object.entries(
                  filteredProducts.reduce((acc: Record<string, number>, product: any) => {
                    acc[product.category] = (acc[product.category] || 0) + product.sales;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([category, sales]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category}</span>
                    <span className="text-sm text-muted-foreground">{String(sales)} sales</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Product Details</h3>
            <div className="overflow-x-auto">
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
                  {filteredProducts.map((product: any) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {product.category}
                        </span>
                      </TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{product.sales}</TableCell>
                      <TableCell className="font-semibold">${product.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </section>

        {/* Warehouse Section */}
        <section id="warehouse" className="space-y-6 scroll-mt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-foreground">Warehouse Operations</h2>
            <Select value={warehouseLocation} onValueChange={setWarehouseLocation}>
              <SelectTrigger className="w-[200px] bg-background">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Locations</SelectItem>
                {warehouseLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {warehouseKpis.map((kpi: any, index: number) => (
              <MetricCard key={index} label={kpi.label} value={kpi.value} change={kpi.change} trend={kpi.trend} />
            ))}
          </div>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Warehouse Details</h3>
            <div className="overflow-x-auto">
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
                  {filteredWarehouses.map((warehouse: any) => (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-medium">{warehouse.location}</TableCell>
                      <TableCell>{warehouse.capacity.toLocaleString()}</TableCell>
                      <TableCell>{warehouse.currentStock.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                (warehouse.currentStock / warehouse.capacity) * 100 > 80
                                  ? 'bg-orange-500'
                                  : 'bg-primary'
                              }`}
                              style={{
                                width: `${((warehouse.currentStock / warehouse.capacity) * 100).toFixed(1)}%`,
                              }}
                            />
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              (warehouse.currentStock / warehouse.capacity) * 100 > 80
                                ? 'text-orange-600'
                                : 'text-foreground'
                            }`}
                          >
                            {((warehouse.currentStock / warehouse.capacity) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{warehouse.lastUpdated}</TableCell>
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
