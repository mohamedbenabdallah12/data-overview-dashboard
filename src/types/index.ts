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

export interface SaleDto {
  id: string;
  date: string;
  stockItemId: string;
  quantity: number;
  total: number;
  profit: number;
  customerId: string;
  salesPersonId: string;
  packageTypeId: string;
  methodDeliveryId: string;
  locationId: string;
  productName: string;
  category: string;
  billCustomerId: string;
  contactPersonId: string;
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

export interface PurchaseDto {
  purchaseOrderID: number;
  purchaseOrderLineID: number;
  stockItemID: number;
  orderedOuters: number;
  receivedOuters: number;
  differenceOuters: number;
  deliveryStatus: 'Conforme' | 'Sous-livré' | 'Sur-livré';
  expectedUnitPricePerOuter: number;
  expectedAmount: number;
  receivedAmount: number;
}

export interface SupplierPurchaseDto {
  supplierName: string;
  totalPurchaseAmount: number;
  totalOrderedOuters: number;
  numberOfOrders: number;
}

export interface StockItemPurchaseDto {
  stockItemName: string;
  totalOrderedOuters: number;
  totalAmount: number;
}
