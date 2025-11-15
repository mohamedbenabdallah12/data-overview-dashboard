import axiosClient from './axiosClient';
import { SalesDto, KpiDto } from '@/types';

// Mock data for demonstration
const mockSalesData: SalesDto[] = [
  { month: 'Jan', revenue: 45000, orders: 120, growth: 12 },
  { month: 'Feb', revenue: 52000, orders: 145, growth: 15 },
  { month: 'Mar', revenue: 48000, orders: 132, growth: -8 },
  { month: 'Apr', revenue: 61000, orders: 168, growth: 27 },
  { month: 'May', revenue: 55000, orders: 151, growth: -10 },
  { month: 'Jun', revenue: 67000, orders: 189, growth: 22 },
];

const mockKpis: KpiDto[] = [
  { label: 'Total Revenue', value: '$328,000', change: 12.5, trend: 'up' },
  { label: 'Total Orders', value: '905', change: 8.2, trend: 'up' },
  { label: 'Avg Order Value', value: '$362', change: -2.1, trend: 'down' },
  { label: 'Growth Rate', value: '15.3%', change: 3.2, trend: 'up' },
];

export const getMonthlySales = async (): Promise<SalesDto[]> => {
  try {
    // Replace with actual API call:
    // const response = await axiosClient.get<SalesDto[]>('/sales/monthly');
    // return response.data;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockSalesData;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw error;
  }
};

export const getSalesKpis = async (): Promise<KpiDto[]> => {
  try {
    // Replace with actual API call:
    // const response = await axiosClient.get<KpiDto[]>('/sales/kpis');
    // return response.data;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockKpis;
  } catch (error) {
    console.error('Error fetching sales KPIs:', error);
    throw error;
  }
};
