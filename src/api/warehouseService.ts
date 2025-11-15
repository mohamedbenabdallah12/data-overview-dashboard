import axiosClient from './axiosClient';
import { WarehouseDto, KpiDto } from '@/types';

// Mock data for demonstration
const mockWarehouses: WarehouseDto[] = [
  { id: '1', location: 'New York', capacity: 10000, currentStock: 8500, lastUpdated: '2024-01-15' },
  { id: '2', location: 'Los Angeles', capacity: 8000, currentStock: 6200, lastUpdated: '2024-01-15' },
  { id: '3', location: 'Chicago', capacity: 12000, currentStock: 9800, lastUpdated: '2024-01-15' },
  { id: '4', location: 'Houston', capacity: 9000, currentStock: 7100, lastUpdated: '2024-01-15' },
];

const mockWarehouseKpis: KpiDto[] = [
  { label: 'Total Capacity', value: '39,000', change: 0, trend: 'up' },
  { label: 'Current Stock', value: '31,600', change: 5.2, trend: 'up' },
  { label: 'Utilization', value: '81%', change: 3.1, trend: 'up' },
  { label: 'Active Locations', value: '4', change: 0, trend: 'up' },
];

export const getWarehouseData = async (): Promise<WarehouseDto[]> => {
  try {
    // Replace with actual API call:
    // const response = await axiosClient.get<WarehouseDto[]>('/warehouse/locations');
    // return response.data;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockWarehouses;
  } catch (error) {
    console.error('Error fetching warehouse data:', error);
    throw error;
  }
};

export const getWarehouseKpis = async (): Promise<KpiDto[]> => {
  try {
    // Replace with actual API call:
    // const response = await axiosClient.get<KpiDto[]>('/warehouse/kpis');
    // return response.data;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockWarehouseKpis;
  } catch (error) {
    console.error('Error fetching warehouse KPIs:', error);
    throw error;
  }
};
