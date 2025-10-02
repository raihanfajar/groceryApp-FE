# Report & Analysis Frontend Integration

## Overview

This document outlines the Report & Analysis feature implementation for the admin dashboard, providing comprehensive analytics for sales, stock, and overall business metrics.

## Features Implemented

### 1. Main Reports Page (`/admin/reports`)

- **Location**: `src/app/(admin)/admin/reports/page.tsx`
- **Features**:
  - Tab-based navigation (Dashboard, Sales Reports, Stock Reports)
  - Month/Year filter controls
  - Store selection for super admins
  - Responsive layout

### 2. Dashboard Overview

- **Component**: `DashboardOverview.tsx`
- **Displays**:
  - Key metrics cards (Total Sales, Avg Order Value, Products Sold, Low Stock Alerts)
  - Top selling products list
  - Low stock alerts list
  - Revenue trends and changes

### 3. Sales Reports

- **Component**: `SalesReports.tsx`
- **Features**:
  - **Monthly Overview Tab**:
    - Total revenue, orders, average order value
    - Top selling products
    - Daily sales trend chart (placeholder)
  - **By Category Tab**:
    - Revenue and quantity by category
    - Top products within each category
    - Category performance comparison

### 4. Stock Reports

- **Component**: `StockReports.tsx`
- **Displays**:
  - Total products, low stock, out of stock counts
  - Current stock value
  - Stock movements (IN, OUT, ADJUSTMENT)
  - Top restocked products

## Type Definitions

### Location: `src/types/reports/index.ts`

```typescript
// Main report interfaces
-ReportFilters -
  MonthlySalesReport -
  CategorySalesReport -
  ProductSalesReport -
  MonthlyStockReport -
  ProductStockReport -
  StockTrendsReport -
  DashboardReport -
  ReportApiResponse<T>;
```

## React Query Hooks

### Created Hooks:

1. **useDashboardReport** - Fetches dashboard overview data
2. **useMonthlySalesReport** - Fetches monthly sales summary
3. **useCategorySalesReport** - Fetches sales data by category

### Hook Pattern:

```typescript
- Uses React Query's useQuery
- Authenticated with admin access token
- Automatic refetching disabled
- Enabled only when token and required params present
```

## UI Components

### 1. ReportFilters Component

- **Location**: `components/admin/reports/ReportFilters.tsx`
- **Features**:
  - Month selector (1-12)
  - Year selector (current year - 5 years)
  - Store selector (super admin only)
  - Responsive layout with labels

### 2. Alert Component

- **Location**: `components/ui/alert.tsx`
- **Variants**: default, destructive
- Used for error messages across reports

## API Endpoints Integration

### Backend Routes (from `report.route.ts`):

```
GET /reports/dashboard - Dashboard metrics
GET /reports/sales/monthly - Monthly sales summary
GET /reports/sales/categories - Sales by category
GET /reports/sales/products - Sales by product
GET /reports/stock/monthly - Monthly stock report
GET /reports/stock/product/:id - Product stock details
GET /reports/stock/trends - Stock trends over time
```

Note: Base URL is `http://localhost:8000`, so full URL is `http://localhost:8000/reports/...`

### Query Parameters:

- `storeId` (optional) - Filter by store
- `month` (required for most) - Month number (1-12)
- `year` (required for most) - Year (YYYY)

## Authentication

All report endpoints require:

- Admin authentication
- Access token in Authorization header: `Bearer {token}`
- Admin role verification middleware

## Styling & Design

### UI Framework:

- Tailwind CSS for styling
- shadcn/ui components (Card, Tabs, Select, etc.)
- Lucide React icons

### Color Coding:

- Green: Positive metrics, stock in
- Red: Negative metrics, out of stock, errors
- Yellow: Warnings, low stock
- Blue: Adjustments, information

### Responsive Design:

- Mobile-first approach
- Grid layouts (2-4 columns on desktop)
- Collapsible/stacked on mobile

## State Management

### Admin Auth Store:

```typescript
useAdminAuthStore()
  .admin - Admin user data
  .admin.accessToken - Authentication token
  .admin.isSuper - Super admin flag
  .admin.store - Admin's store (if not super)
```

### Local State:

- Selected month (default: current month)
- Selected year (default: current year)
- Selected store ID (super admin only)

## Data Flow

```
User Action (select filters)
  ↓
State Update (month/year/store)
  ↓
React Query Hook
  ↓
API Call (with auth token)
  ↓
Backend Controller
  ↓
Database Query
  ↓
Response Processing
  ↓
UI Update
```

## Future Enhancements

### Pending Features:

1. **Chart Visualizations**:
   - Line charts for daily sales trends
   - Bar charts for category comparison
   - Pie charts for product distribution
   - Consider using: recharts, visx, or chart.js

2. **Export Functionality**:
   - PDF export for reports
   - Excel/CSV download
   - Email report scheduling

3. **Additional Hooks**:
   - useProductSalesReport
   - useMonthlyStockReport
   - useProductStockReport
   - useStockTrendsReport

4. **Advanced Filters**:
   - Date range picker (instead of just month/year)
   - Product category filter
   - Custom date ranges
   - Compare periods

5. **Real-time Updates**:
   - WebSocket integration for live data
   - Auto-refresh intervals
   - Push notifications for alerts

## Testing Checklist

- [ ] Dashboard loads with correct metrics
- [ ] Sales reports display properly
- [ ] Stock reports show accurate data
- [ ] Filters update data correctly
- [ ] Store filter works for super admin
- [ ] Store filter hidden for regular admin
- [ ] Error states display appropriately
- [ ] Loading states show skeletons
- [ ] Responsive design works on mobile
- [ ] Authentication required
- [ ] Unauthorized access blocked

## Known Issues / Technical Debt

1. TypeScript may show temporary errors until TS server restarts
2. Chart visualizations are placeholders (need charting library)
3. Store list in filters needs to be populated from API
4. Some report hooks not yet implemented
5. Export/download functionality not implemented

## File Structure

```
groceryApp-FE/
├── src/
│   ├── app/
│   │   └── (admin)/
│   │       └── admin/
│   │           └── reports/
│   │               └── page.tsx
│   ├── components/
│   │   ├── admin/
│   │   │   └── reports/
│   │   │       ├── DashboardOverview.tsx
│   │   │       ├── SalesReports.tsx
│   │   │       ├── StockReports.tsx
│   │   │       └── ReportFilters.tsx
│   │   └── ui/
│   │       └── alert.tsx
│   ├── hooks/
│   │   └── admin/
│   │       └── reports/
│   │           ├── useDashboardReport.ts
│   │           ├── useMonthlySalesReport.ts
│   │           └── useCategorySalesReport.ts
│   └── types/
│       └── reports/
│           └── index.ts
```

## Commands

### Development:

```bash
# Start frontend dev server
cd groceryApp-FE
npm run dev

# Start backend server
cd groceryApp-BE
npm run dev
```

### Testing API:

```bash
# Test dashboard endpoint
curl -H "Authorization: Bearer {token}" \
  "http://localhost:8000/reports/dashboard?month=1&year=2025"
```

## Dependencies

### Required Packages:

- `@tanstack/react-query` - Server state management
- `lucide-react` - Icons
- `zustand` - Client state management
- `axios` - HTTP client

### Optional (for future features):

- `recharts` or `visx` - Charts
- `jspdf` - PDF export
- `react-to-print` - Print functionality
- `date-fns` - Date utilities

## Notes

- All monetary values displayed in Indonesian Rupiah (IDR) format
- Dates stored in ISO format, displayed in local format
- All reports support multi-store for super admins
- Regular admins see data only for their assigned store
- Reports use server-side pagination for large datasets
- Caching strategy: stale-while-revalidate

---

Last Updated: January 2025
Feature Branch: `feature/report-analysis-frontend`
