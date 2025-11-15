import axiosClient from './axiosClient';
import { ProductDto } from '@/types';

// Mock data for demonstration
const mockProducts: ProductDto[] = [
  { id: '1', name: 'Laptop Pro', category: 'Electronics', stock: 45, sales: 234, revenue: 234000 },
  { id: '2', name: 'Wireless Mouse', category: 'Accessories', stock: 120, sales: 567, revenue: 28350 },
  { id: '3', name: 'USB-C Hub', category: 'Accessories', stock: 89, sales: 345, revenue: 17250 },
  { id: '4', name: 'Monitor 27"', category: 'Electronics', stock: 34, sales: 189, revenue: 94500 },
  { id: '5', name: 'Keyboard Mechanical', category: 'Accessories', stock: 67, sales: 423, revenue: 42300 },
  { id: '6', name: 'Webcam HD', category: 'Electronics', stock: 56, sales: 276, revenue: 27600 },
];

export const getProductStats = async (): Promise<ProductDto[]> => {
  try {
    // Replace with actual API call:
    // const response = await axiosClient.get<ProductDto[]>('/products/stats');
    // return response.data;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts;
  } catch (error) {
    console.error('Error fetching product stats:', error);
    throw error;
  }
};

export const getTopProducts = async (limit: number = 5): Promise<ProductDto[]> => {
  try {
    const products = await getProductStats();
    return products
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching top products:', error);
    throw error;
  }
};
