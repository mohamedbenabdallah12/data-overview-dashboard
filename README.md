# Analytics Dashboard

A professional React + TypeScript dashboard for visualizing business data from a .NET backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm installed
- .NET backend API running (optional, uses mock data by default)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run at `http://localhost:8080`

## 🏗️ Architecture

```
src/
 ├─ api/                      # API layer
 │   ├─ axiosClient.ts        # Axios instance with interceptors
 │   ├─ salesService.ts       # Sales API calls
 │   ├─ productsService.ts    # Products API calls
 │   └─ warehouseService.ts   # Warehouse API calls
 ├─ components/
 │   ├─ charts/               # Reusable chart components
 │   │   ├─ LineChart.tsx
 │   │   ├─ BarChart.tsx
 │   │   └─ PieChart.tsx
 │   └─ ui/                   # UI components
 │       ├─ Card.tsx
 │       ├─ MetricCard.tsx
 │       └─ DataTable.tsx
 ├─ layouts/                  # Layout components
 │   ├─ MainLayout.tsx
 │   ├─ Sidebar.tsx
 │   └─ TopBar.tsx
 ├─ modules/
 │   └─ dashboard/            # Dashboard module
 │       ├─ DashboardPage.tsx
 │       └─ components/
 │           ├─ SalesSection.tsx
 │           ├─ ProductsSection.tsx
 │           └─ WarehouseSection.tsx
 ├─ types/                    # TypeScript types
 └─ utils/                    # Utility functions
```

## 🔧 Configuration

### Connecting to Your .NET Backend

1. Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

2. Update the service files in `src/api/` to uncomment the actual API calls:

```typescript
// Before (mock):
await new Promise(resolve => setTimeout(resolve, 500));
return mockData;

// After (real API):
const response = await axiosClient.get<SalesDto[]>('/sales/monthly');
return response.data;
```

### Expected API Endpoints

Your .NET backend should expose these endpoints:

#### Sales
- `GET /api/sales/monthly` → `SalesDto[]`
- `GET /api/sales/kpis` → `KpiDto[]`

#### Products
- `GET /api/products/stats` → `ProductDto[]`

#### Warehouse
- `GET /api/warehouse/locations` → `WarehouseDto[]`
- `GET /api/warehouse/kpis` → `KpiDto[]`

### TypeScript Types

All data types are defined in `src/types/index.ts`. Ensure your .NET API returns data matching these interfaces.

## 📊 Features

### Dashboard Sections

1. **Sales Overview**
   - Monthly revenue line chart
   - KPI cards (Total Revenue, Orders, Avg Order Value, Growth Rate)
   - Sales details table

2. **Products Analytics**
   - Revenue by product bar chart
   - Sales by category pie chart
   - Product details table

3. **Warehouse Operations**
   - Capacity vs stock bar chart
   - KPI cards (Total Capacity, Current Stock, Utilization)
   - Warehouse details table

## 🎨 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **Vite** - Build tool
- **React Router** - Routing
- **Shadcn/ui** - UI components

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` folder.

## 🔍 Development Tips

- **Mock Data**: By default, the app uses mock data. Switch to real API calls when ready.
- **Error Handling**: Check browser console for API errors.
- **Hot Reload**: Changes are reflected instantly during development.
- **Type Safety**: TypeScript ensures data consistency between frontend and backend.

## 🤝 Contributing

1. Keep components small and reusable
2. Follow the existing folder structure
3. Use TypeScript for all new files
4. Maintain clean, readable code
5. Test with both mock and real API data

## 📝 License

MIT
