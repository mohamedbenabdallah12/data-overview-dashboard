// Core data types for the dashboard

export interface SalesDto {
  month: string;
  revenue: number;
  orders: number;
  growth: number;
}

export interface ProductDto {
  id: string;
  name: string;
  category: string;
  stock: number;
  sales: number;
  revenue: number;
}

export interface WarehouseDto {
  id: string;
  location: string;
  capacity: number;
  currentStock: number;
  lastUpdated: string;
}

export interface KpiDto {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down';
}

export interface ChartDataPoint {
  label: string;
  value: number;
}
