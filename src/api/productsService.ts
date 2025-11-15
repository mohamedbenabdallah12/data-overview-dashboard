import axiosClient from './axiosClient';
import { ProductDto, SaleDto } from '@/types';
import { ENDPOINTS } from './endpoints';

export const getProductStats = async (): Promise<ProductDto[]> => {
  try {
    const response = await axiosClient.get<SaleDto[]>(ENDPOINTS.SALE.BASE);
    const sales = response.data;
    // Group by productName
    const productMap = new Map<string, ProductDto>();
    for (const sale of sales) {
      if (!productMap.has(sale.productName)) {
        productMap.set(sale.productName, {
          id: sale.stockItemId,
          name: sale.productName,
          category: sale.category,
          stock: 0, // No stock info available
          sales: 0,
          revenue: 0,
        });
      }
      const product = productMap.get(sale.productName)!;
      product.sales += sale.quantity;
      product.revenue += sale.total;
    }
    return Array.from(productMap.values());
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
