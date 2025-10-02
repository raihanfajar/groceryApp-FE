# Report & Analysis - Quick Reference

## 🚀 Quick Start

```bash
# Navigate to reports page
http://localhost:3000/admin/reports

# Ensure backend is running
http://localhost:8000/api/reports/*
```

## 📊 Available Reports

| Tab           | Description       | Key Metrics                             |
| ------------- | ----------------- | --------------------------------------- |
| **Dashboard** | Business overview | Revenue, Orders, Products, Stock Alerts |
| **Sales**     | Sales analytics   | Monthly trends, Categories, Products    |
| **Stock**     | Inventory status  | Stock levels, Movements, Restocks       |

## 🎯 Key Features

### Dashboard Tab

- 📈 4 metric cards (Revenue, Avg Order, Products, Alerts)
- 🏆 Top selling products ranking
- ⚠️ Low stock alerts

### Sales Reports

**Monthly Overview:**

- 💰 Revenue & order metrics
- 📉 Daily sales line chart
- 🥧 Revenue distribution pie chart

**By Category:**

- 📊 Category revenue bar chart
- 🏷️ Category detail cards
- 📦 Top products per category

### Stock Reports

- 📦 Stock level overview
- ➕➖ Movement tracking (IN/OUT/ADJUSTMENT)
- 🔄 Top restocked products

## 🔧 Components

```typescript
// Hooks
import {
  useDashboardReport,
  useMonthlySalesReport,
  useCategorySalesReport,
  useProductSalesReport,
  useMonthlyStockReport,
  useProductStockReport,
  useStockTrendsReport,
} from "@/hooks/admin/reports";

// Charts
import {
  SalesLineChart,
  CategoryBarChart,
  ProductPieChart,
} from "@/components/admin/reports/charts";

// Components
import DashboardOverview from "@/components/admin/reports/DashboardOverview";
import SalesReports from "@/components/admin/reports/SalesReports";
import StockReports from "@/components/admin/reports/StockReports";
import ReportFilters from "@/components/admin/reports/ReportFilters";
```

## 🎨 Chart Usage

### Line Chart

```tsx
<SalesLineChart
  data={[
    { name: "1", value: 1000 },
    { name: "2", value: 1500 },
  ]}
  title="Daily Sales"
  dataKey="value"
  xAxisKey="name"
  color="#2563eb"
/>
```

### Bar Chart

```tsx
<CategoryBarChart
  data={[{ name: "Category A", value: 5000 }]}
  title="Revenue by Category"
  dataKey="value"
  xAxisKey="name"
/>
```

### Pie Chart

```tsx
<ProductPieChart
  data={[{ name: "Product A", value: 3000 }]}
  title="Revenue Distribution"
  dataKey="value"
  nameKey="name"
  showPercentage={true}
/>
```

## 🔐 Authentication

All hooks require admin authentication:

```typescript
const { admin } = useAdminAuthStore();
const token = admin?.accessToken;

// Automatically handled in hooks
headers: {
  Authorization: `Bearer ${token}`,
}
```

## 🎛️ Filter Props

```typescript
interface ReportFilters {
  storeId?: string; // Optional, for super admin
  month: number; // 1-12
  year: number; // YYYY
}
```

## 📱 Responsive Breakpoints

```css
/* Mobile */
< 768px: Single column, stacked layout

/* Tablet */
768px - 1024px: 2-column grid

/* Desktop */
> 1024px: 4-column grid, full features
```

## 🐛 Troubleshooting

| Issue                 | Solution                                     |
| --------------------- | -------------------------------------------- |
| Charts not displaying | Restart dev server, check recharts installed |
| No data showing       | Verify backend running, check auth token     |
| TypeScript errors     | Restart TS server (Cmd+Shift+P)              |
| Filters not working   | Check queryKey includes filters              |

## 📝 Type Definitions

```typescript
interface DashboardReport {
  sales: {
    period: { month: number; year: number; startDate: string; endDate: string };
    summary: {
      totalSales: number;
      totalTransactions: number;
      averageOrderValue: number;
    };
    topProducts: Array<{
      productId: string;
      productName: string;
      categoryName: string;
      totalQuantitySold: number;
      totalRevenue: number;
    }>;
  };
  stock: {
    period: { month: number; year: number; startDate: string; endDate: string };
    summary: {
      totalProducts: number;
      lowStockCount: number;
      outOfStockCount: number;
      totalStockValue: number;
    };
    lowStockAlerts: Array<{
      productId: string;
      productName: string;
      currentStock: number;
      minStock: number;
      status: "LOW" | "OUT";
    }>;
    movementsByType: Array<{
      type: "IN" | "OUT" | "ADJUSTMENT";
      totalQuantity: number;
      transactionCount: number;
    }>;
  };
}
```

## 🚦 Status Indicators

| Color     | Meaning                      |
| --------- | ---------------------------- |
| 🟢 Green  | Positive metrics, stock in   |
| 🔴 Red    | Alerts, out of stock, errors |
| 🟡 Yellow | Warnings, low stock          |
| 🔵 Blue   | Information, adjustments     |

## 📊 Data Format

```typescript
// Currency
Rp ${value.toLocaleString('id-ID')}

// Large numbers
1,000,000 → 1M
1,000 → 1K

// Percentages
(value / total * 100).toFixed(1) + '%'
```

## 🔗 API Endpoints

**Base URL:** `http://localhost:8000`

```
GET /reports/dashboard
GET /reports/sales/monthly
GET /reports/sales/categories
GET /reports/sales/products
GET /reports/stock/monthly
GET /reports/stock/product/:id
GET /reports/stock/trends
```

## 📦 Files Location

```
Frontend:
- Pages: src/app/(admin)/admin/reports/
- Components: src/components/admin/reports/
- Hooks: src/hooks/admin/reports/
- Types: src/types/reports/
- Charts: src/components/admin/reports/charts/

Backend:
- Routes: src/routers/report.route.ts
- Controller: src/controllers/report.controller.ts
- Service: src/services/report.service.ts
```

## ⚡ Performance Tips

1. Use React Query caching
2. Limit chart data points (<100)
3. Lazy load heavy components
4. Paginate large lists
5. Debounce filter changes

## 🎓 Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [Recharts Docs](https://recharts.org/)
- [Testing Guide](./REPORT_TESTING_GUIDE.md)
- [Full Documentation](./REPORT_FRONTEND.md)

---

**Quick Help:** Check `IMPLEMENTATION_SUMMARY.md` for complete feature overview
