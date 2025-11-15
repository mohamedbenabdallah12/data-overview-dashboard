// Centralized endpoint definitions for the API

export const ENDPOINTS = {
  // Sale endpoints
  SALE: {
    BASE: '/api/Sale',
    BY_ID: (id: string) => `/api/Sale/${id}`,
    BY_BILL_CUSTOMER: (billCustomerId: string) => `/api/Sale/by-bill-customer/${billCustomerId}`,
    BY_CUSTOMER: (customerId: string) => `/api/Sale/by-customer/${customerId}`,
    BY_CONTACT_PERSON: (contactPersonId: string) => `/api/Sale/by-contact-person/${contactPersonId}`,
    BY_SALES_PERSON: (salesPersonId: string) => `/api/Sale/by-sales-person/${salesPersonId}`,
    BY_STOCK_ITEM: (stockItemId: string) => `/api/Sale/by-stock-item/${stockItemId}`,
    BY_DATE: (dateKey: string) => `/api/Sale/by-date/${dateKey}`,
    BY_PACKAGE_TYPE: (packageTypeId: string) => `/api/Sale/by-package-type/${packageTypeId}`,
    BY_METHOD_DELIVERY: (methodDeliveryId: string) => `/api/Sale/by-method-delivery/${methodDeliveryId}`,
    STATS_BY_DAY: '/api/Sale/stats/by-day',
    BY_MONTH: '/api/Sale/by-month',
  },
} as const;
