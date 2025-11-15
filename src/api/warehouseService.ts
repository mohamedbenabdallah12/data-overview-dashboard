import axiosClient from './axiosClient';
import { WarehouseDto, KpiDto, SaleDto } from '@/types';
import { ENDPOINTS } from './endpoints';

export const getWarehouseData = async (): Promise<WarehouseDto[]> => {
  try {
    const response = await axiosClient.get<SaleDto[]>(ENDPOINTS.SALE.BASE);
    const sales = response.data;
    // Group by locationId
    const warehouseMap = new Map<string, WarehouseDto>();
    for (const sale of sales) {
      if (!warehouseMap.has(sale.locationId)) {
        warehouseMap.set(sale.locationId, {
          id: sale.locationId,
          location: sale.locationId, // Assuming locationId is readable name
          capacity: 0, // No capacity info available
          currentStock: 0,
          lastUpdated: new Date().toISOString().split('T')[0],
        });
      }
      const warehouse = warehouseMap.get(sale.locationId)!;
      warehouse.currentStock += sale.quantity;
    }
    return Array.from(warehouseMap.values());
  } catch (error) {
    console.error('Error fetching warehouse data:', error);
    throw error;
  }
};

export const getWarehouseKpis = async (): Promise<KpiDto[]> => {
  try {
    const warehouses = await getWarehouseData();
    const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
    const totalStock = warehouses.reduce((sum, w) => sum + w.currentStock, 0);
    const utilization = totalCapacity > 0 ? (totalStock / totalCapacity) * 100 : 0;
    const count = warehouses.length;
    const kpis: KpiDto[] = [
      { label: 'Total Capacity', value: totalCapacity.toLocaleString(), change: 0, trend: 'up' },
      { label: 'Current Stock', value: totalStock.toLocaleString(), change: 0, trend: 'up' },
      { label: 'Utilization', value: `${utilization.toFixed(1)}%`, change: 0, trend: 'up' },
      { label: 'Active Locations', value: count.toString(), change: 0, trend: 'up' },
    ];
    return kpis;
  } catch (error) {
    console.error('Error fetching warehouse KPIs:', error);
    throw error;
  }
};
