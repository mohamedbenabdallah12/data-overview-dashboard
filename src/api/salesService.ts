import axiosClient from './axiosClient';
import { SalesDto, KpiDto } from '@/types';
import { ENDPOINTS } from './endpoints';

export const getMonthlySales = async (): Promise<SalesDto[]> => {
  try {
    const response = await axiosClient.get<{month: string, totalSales: number}[]>(ENDPOINTS.SALE.BY_MONTH);
    const rawData = response.data;
    // Calculate growth based on sequential months
    const salesData: SalesDto[] = rawData.map((item, index) => {
      const growth = index > 0 ? ((item.totalSales - rawData[index-1].totalSales) / rawData[index-1].totalSales) * 100 : 0;
      return {
        month: item.month,
        revenue: item.totalSales,
        orders: 0, // Backend doesn't provide orders
        growth: growth
      };
    });
    return salesData;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw error;
  }
};

export const getSalesKpis = async (): Promise<KpiDto[]> => {
  try {
    const [monthlySales, methodData] = await Promise.all([getMonthlySales(), getSalesByMethods()]);
    // Calculate total revenue and orders from methods
    const totalRevenue = methodData.reduce((sum, item) => sum + item.totalSales, 0);
    const totalOrders = methodData.reduce((sum, item) => sum + item.totalOrders, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const latest = monthlySales[monthlySales.length - 1];
    const previous = monthlySales[monthlySales.length - 2] || { revenue: 0, orders: 0 };
    const growthRate = previous.revenue > 0 ? ((latest.revenue - previous.revenue) / previous.revenue) * 100 : 0;
    const kpis: KpiDto[] = [
      { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: 0, trend: 'up' },
      { label: 'Total Orders', value: totalOrders.toString(), change: 0, trend: 'up' },
      { label: 'Avg Order Value', value: `$${avgOrderValue.toFixed(2)}`, change: 0, trend: 'up' },
      { label: 'Growth Rate', value: `${growthRate.toFixed(1)}%`, change: 0, trend: 'up' },
    ];
    return kpis;
  } catch (error) {
    console.error('Error fetching sales KPIs:', error);
    throw error;
  }
};

export const getYearlySales = async (): Promise<{years: number, totalSales: number}[]> => {
  try {
    const response = await axiosClient.get<{years: number, totalSales: number}[]>(ENDPOINTS.SALE.BY_YEARS);
    return response.data;
  } catch (error) {
    console.error('Error fetching yearly sales:', error);
    throw error;
  }
};

export const getEmployeeSalesByYear = async (): Promise<{name: string, preferredName: string, years: number, totalSales: number}[]> => {
  try {
    const response = await axiosClient.get<{name: string, preferredName: string, years: number, totalSales: number}[]>(ENDPOINTS.SALE.BY_EMPLOYEE_BY_YEAR);
    return response.data;
  } catch (error) {
    console.error('Error fetching employee sales by year:', error);
    throw error;
  }
};

export const getSalesByMethods = async (): Promise<{deliveryMethodName: string, totalSales: number, totalOrders: number}[]> => {
  try {
    const response = await axiosClient.get<{deliveryMethodName: string, totalSales: number, totalOrders: number}[]>(ENDPOINTS.SALE.BY_METHODS);
    return response.data;
  } catch (error) {
    console.error('Error fetching sales by methods:', error);
    throw error;
  }
};

export const getSalesByPackageTypes = async (): Promise<{packageTypeName: string, totalSales: number, totalOrders: number}[]> => {
  try {
    const response = await axiosClient.get<{packageTypeName: string, totalSales: number, totalOrders: number}[]>(ENDPOINTS.SALE.BY_PACKAGE_TYPES);
    return response.data;
  } catch (error) {
    console.error('Error fetching sales by package types:', error);
    throw error;
  }
};
