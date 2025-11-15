import { useEffect, useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/MetricCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMonthlySales, getSalesKpis, getYearlySales, getEmployeeSalesByYear } from '@/api/salesService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Index = () => {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [yearlySales, setYearlySales] = useState<any[]>([]);
  const [employeeSales, setEmployeeSales] = useState<any[]>([]);
  const [employees, setEmployees] = useState<string[]>([]);
  const [lineData, setLineData] = useState<any[]>([]);
  const [salesKpis, setSalesKpis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sales, yearly, empSales, sKpis] = await Promise.all([
          getMonthlySales(),
          getYearlySales(),
          getEmployeeSalesByYear(),
          getSalesKpis(),
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
        setEmployees(employees);
        setLineData(lineData);
        setSalesKpis(sKpis);
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
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
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
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
