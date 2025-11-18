import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { getPurchaseByPackageType } from '@/api/purchaseService';
import { PackageTypePurchaseDto } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PurchaseByPackageTypeChart = () => {
  const [data, setData] = useState<PackageTypePurchaseDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPurchaseByPackageType();
        setData(result);
      } catch (error) {
        console.error('Error fetching purchase by package type:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = data.map(item => ({
    name: item.packageTypeName,
    value: item.totalAmount,
    percentage: ((item.totalAmount / data.reduce((sum, i) => sum + i.totalAmount, 0)) * 100).toFixed(1)
  }));

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading package type pie chart...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Purchases by Package Type</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name} ${percentage}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={1500}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Total Amount']}
            labelFormatter={(label) => `${label}`}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center mt-4">
        <div className="grid grid-cols-1 gap-2 text-xs">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span>{item.name}: {item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Purchase amounts by package type (pie chart)
      </p>
    </Card>
  );
};

export default PurchaseByPackageTypeChart;
