import { useEffect, useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/MetricCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { getMonthlySales, getSalesKpis, getYearlySales, getEmployeeSalesByYear, getSalesByMethods, getSalesByPackageTypes } from '@/api/salesService';
import { getPurchaseOrderedVsReceived, getPurchaseKpis, getPurchaseBySupplier, getPurchaseByStockItems } from '@/api/purchaseService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Truck } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SemiCircularGauge = ({ percentage }: { percentage: number }) => {
  const radius = 60;
  const strokeWidth = 12;
  const circumference = Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex justify-center items-center">
      <svg width="140" height="80" className="overflow-visible">
        {/* Background arc */}
        <path
          d={`M ${strokeWidth/2} ${strokeWidth/2} A ${radius} ${radius} 0 0 1 ${140-strokeWidth/2} ${strokeWidth/2}`}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d={`M ${strokeWidth/2} ${strokeWidth/2} A ${radius} ${radius} 0 0 1 ${140-strokeWidth/2} ${strokeWidth/2}`}
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-black text-gray-900">{percentage.toFixed(0)}%</div>
        
      </div>
    </div>
  );
};

const Index = () => {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [yearlySales, setYearlySales] = useState<any[]>([]);
  const [employeeSales, setEmployeeSales] = useState<any[]>([]);
  const [methodData, setMethodData] = useState<any[]>([]);
  const [packageTypeData, setPackageTypeData] = useState<any[]>([]);
  const [employees, setEmployees] = useState<string[]>([]);
  const [lineData, setLineData] = useState<any[]>([]);
  const [salesKpis, setSalesKpis] = useState<any[]>([]);
  const [purchaseData, setPurchaseData] = useState<any[]>([]);
  const [purchaseKpis, setPurchaseKpis] = useState<any[]>([]);
  const [supplierData, setSupplierData] = useState<any[]>([]);
  const [stockItemsData, setStockItemsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sales, yearly, empSales, methodSales, pkgTypes, sKpis, purchaseData, pKpis, suppliers, stockItems] = await Promise.all([
          getMonthlySales(),
          getYearlySales(),
          getEmployeeSalesByYear(),
          getSalesByMethods(),
          getSalesByPackageTypes(),
          getSalesKpis(),
          getPurchaseOrderedVsReceived(),
          getPurchaseKpis(),
          getPurchaseBySupplier(),
          getPurchaseByStockItems(),
        ]);
        // Process employee sales for line chart
        const empMap = new Map<string, any[]>();
        empSales.forEach((e: any) => {
          const name = e.preferredName || e.name;
          if (!empMap.has(name)) empMap.set(name, []);
          empMap.get(name).push({ year: e.years, sales: e.totalSales });
        });
        const employees = Array.from(empMap.keys());
        const years = Array.from(new Set(empSales.map((e: any) => e.years))).sort();
        const lineData = years.map(year => {
          const obj: any = { year: year.toString() };
          employees.forEach(emp => {
            const entry = empMap.get(emp).find((e: any) => e.year === year);
            obj[emp] = entry ? entry.sales : 0;
          });
          return obj;
        });

        setSalesData(sales);
        setYearlySales(yearly);
        setEmployeeSales(empSales);
        setMethodData(methodSales);
        setPackageTypeData(pkgTypes);
        setEmployees(employees);
        setLineData(lineData);
        setSalesKpis(sKpis);
        setPurchaseData(purchaseData);
        setPurchaseKpis(pKpis);
        setSupplierData(suppliers);
        setStockItemsData(stockItems);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Monthly Sales Analysis</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={salesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                <YAxis
                  tickFormatter={(value) => {
                    if (value >= 1000000) {
                      return `$${(value / 1000000).toFixed(0)}M`;
                    } else if (value >= 1000) {
                      return `$${(value / 1000).toFixed(0)}K`;
                    } else {
                      return `$${value.toLocaleString()}`;
                    }
                  }}
                  tick={{ fontSize: 12 }}
                />
                  <Tooltip
                    formatter={(value, name) => [`$${Number(value).toLocaleString()}`, 'Total Sales']}
                    labelFormatter={(label) => `Month: ${label}`}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="url(#salesGradient)"
                    radius={[4, 4, 0, 0]}
                    animationBegin={0}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Yearly Sales Distribution</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={yearlySales.map((item) => ({ name: item.years.toString(), value: item.totalSales }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {yearlySales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Total Sales']} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Employee Sales Trends</h3>
            <ResponsiveContainer width="100%" height={450}>
              <LineChart
                data={lineData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]} />
                <Legend />
                {employees.map((emp, idx) => (
                  <Line
                    key={emp}
                    type="monotone"
                    dataKey={emp}
                    stroke={COLORS[idx % COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    animationBegin={0}
                    animationDuration={2000}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Package Type Performance Curves</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={packageTypeData.map((pkg: any) => ({
                  name: pkg.packageTypeName,
                  sales: pkg.totalSales,
                  orders: pkg.totalOrders * 1000, // Scale orders for visibility
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => (value / 1000).toLocaleString()}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const numValue = Number(value);
                    if (name === 'sales') {
                      return [`$${numValue.toLocaleString()}`, 'Total Sales'];
                    } else {
                      return [`${(numValue / 1000).toLocaleString()}`, 'Orders'];
                    }
                  }}
                  labelFormatter={(label) => `Package Type: ${label}`}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  name="Sales"
                  animationBegin={0}
                  animationDuration={2000}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  strokeDasharray="5 5"
                  name="Orders"
                  animationBegin={200}
                  animationDuration={1800}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-md hover:shadow-xl transition-all duration-300 mx-auto max-w-2xl">
            <h3 className="mb-6 text-2xl font-extrabold text-gray-900 text-center">Delivery Methods Performance Gauges</h3>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={methodData.map((item) => ({
                      name: item.deliveryMethodName,
                      value: item.totalSales,
                      orders: item.totalOrders
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {methodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `$${Number(value).toLocaleString()} (${props.payload.orders} orders)`,
                      name
                    ]}
                    labelFormatter={(label) => `Method: ${label}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 text-center text-gray-600">
              <p className="text-lg">Total Sales Distribution by Delivery Method</p>
              <p className="text-sm mt-1">Hover for detailed order information</p>
            </div>
          </Card>
        </section>

        {/* Purchase Section */}
        <section id="purchases" className="space-y-6 scroll-mt-6">
          <h2 className="text-2xl font-bold text-foreground">Purchases Overview</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {purchaseKpis.map((kpi: any, index: number) => (
              <MetricCard key={index} label={kpi.label} value={kpi.value} change={0} trend={kpi.trend} />
            ))}
          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Delivery Status Distribution</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Conforme', value: purchaseData.filter(p => p.deliveryStatus === 'Conforme').length },
                      { name: 'Sous-livré', value: purchaseData.filter(p => p.deliveryStatus === 'Sous-livré').length },
                      { name: 'Sur-livré', value: purchaseData.filter(p => p.deliveryStatus === 'Sur-livré').length },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {[
                      <Cell key="conforme" fill="#10b981" />,
                      <Cell key="sous-livre" fill="#ef4444" />,
                      <Cell key="sur-livre" fill="#f59e0b" />
                    ]}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Ordered vs Received Quantities</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={purchaseData.slice(0, 10)} // Show first 10 records for readability
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="purchaseOrderID"
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value, name) => [value, name === 'orderedOuters' ? 'Ordered' : 'Received']}
                    labelFormatter={(label) => `PO: ${label}`}
                  />
                  <Bar dataKey="orderedOuters" fill="#3b82f6" name="orderedOuters" />
                  <Bar dataKey="receivedOuters" fill="#10b981" name="receivedOuters" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground mt-2">
                Showing first 10 purchase orders. Ordered (blue) vs Received (green)
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Suppliers Ranking */}
            <Card className="p-6 lg:col-span-2">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Suppliers Purchase Amount</h3>
              <ResponsiveContainer width="100%" height={450}>
                <PieChart>
                  <Pie
                    data={(() => {
                      // Group small suppliers (<1% of total) into "Others"
                      const minThreshold = supplierData.reduce((sum, item) => sum + item.totalPurchaseAmount, 0) * 0.01;
                      const mainSuppliers = supplierData.filter(supplier => supplier.totalPurchaseAmount >= minThreshold);

                      const otherTotal = supplierData
                        .filter(supplier => supplier.totalPurchaseAmount < minThreshold)
                        .reduce((sum, supplier) => sum + supplier.totalPurchaseAmount, 0);

                      const chartData = [...mainSuppliers.map(item => ({
                        name: item.supplierName,
                        value: item.totalPurchaseAmount
                      }))];

                      if (otherTotal > 0) {
                        chartData.push({
                          name: 'Other Suppliers',
                          value: otherTotal
                        });
                      }

                      return chartData;
                    })()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={false} // Remove overlapping labels
                    outerRadius={160}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={1200}
                  >
                    {[0, 1, 2].map((index) => (
                      <Cell key={`cell-${index}`} fill={[
                        '#6366f1', // Indigo - Fabrikam
                        '#a855f7', // Purple - Litware
                        '#f59e0b'  // Amber - Others
                      ][index % 3]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `$${Number(value).toLocaleString()}`,
                      'Purchase Amount'
                    ]}
                    labelFormatter={(label) => `Supplier: ${label}`}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* External Legend */}
              <div className="mt-4 flex justify-center">
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#6366f1] rounded-full mr-2"></div>
                    <span>Fabrikam, Inc. (68%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#a855f7] rounded-full mr-2"></div>
                    <span>Litware, Inc. (27%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#f59e0b] rounded-full mr-2"></div>
                    <span>Other Suppliers (5%)</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-2 text-center">
                Critical concentration risk - 95% of purchases from top 2 suppliers
              </p>
            </Card>

            {/* Supplier Performance Cards */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Supplier Insights</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-900 text-sm">🏆 Top Supplier</h4>
                  <p className="text-2xl font-bold text-indigo-600">$680M</p>
                  <p className="text-sm text-gray-600">Fabrikam, Inc. (68% share)</p>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-900 text-sm">📊 Total Spend</h4>
                  <p className="text-2xl font-bold text-gray-700">$948M</p>
                  <p className="text-sm text-gray-600">Across 7 suppliers</p>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-900 text-sm">⚠️ Concentration Risk</h4>
                  <p className="text-2xl font-bold text-red-600">95%</p>
                  <p className="text-sm text-gray-600">Top 2 suppliers</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-900 text-sm">📈 High Volume</h4>
                  <p className="text-2xl font-bold text-green-600">2,057</p>
                  <p className="text-sm text-gray-600">Orders with Fabrikam</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Top Products Table */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Top 10 Products by Purchase Amount</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">#</TableHead>
                    <TableHead className="min-w-[250px]">Product Name</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Units Ordered</TableHead>
                    <TableHead className="text-right">% of Total Purchases</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockItemsData
                    .sort((a, b) => b.totalAmount - a.totalAmount)
                    .slice(0, 10)
                    .map((product: any, index: number) => {
                      const totalPurchases = stockItemsData.reduce((sum, item) => sum + item.totalAmount, 0);
                      const percentage = totalPurchases > 0 ? (product.totalAmount / totalPurchases) * 100 : 0;

                      return (
                        <TableRow key={index} className={index < 3 ? "bg-blue-50/50" : ""}>
                          <TableCell className="font-bold text-center">
                            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                              index === 0 ? 'bg-yellow-500 text-white' :
                              index === 1 ? 'bg-gray-400 text-white' :
                              index === 2 ? 'bg-orange-600 text-white' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {index + 1}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium max-w-[250px]">
                            <div title={product.stockItemName} className="truncate">
                              {product.stockItemName.length > 50
                                ? `${product.stockItemName.substring(0, 50)}...`
                                : product.stockItemName
                              }
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-indigo-600">
                            {product.totalAmount >= 1000000
                              ? `$${(product.totalAmount / 1000000).toFixed(2)}M`
                              : product.totalAmount >= 1000
                                ? `$${(product.totalAmount / 1000).toFixed(1)}K`
                                : `$${product.totalAmount.toFixed(0)}`
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            {product.totalOrderedOuters.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              percentage >= 50 ? 'bg-red-100 text-red-800' :
                              percentage >= 10 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {percentage.toFixed(1)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Top 10 products ranked by purchase amount - highlighting single product dependency risks
            </p>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
