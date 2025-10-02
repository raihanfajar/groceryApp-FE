# Admin Dashboard Redesign - Implementation Plan

## 📋 Complete To-Do List

### ✅ Phase 1: Backend API Analysis (COMPLETED)

- [x] 1.1 Check existing transaction/sales APIs
  - Found: `/reports/dashboard` - comprehensive endpoint
  - Found: `/reports/sales/monthly` - monthly sales
  - Found: `/reports/sales/products` - top products
- [x] 1.2 Confirmed backend has all needed endpoints
- [x] 1.3 API Structure documented

### Backend Endpoints Available:

- `GET /reports/dashboard?storeId=xxx&month=x&year=xxxx`
  - Returns: sales summary, top products, stock summary
- `GET /reports/sales/monthly?storeId=xxx&month=x&year=xxxx`
  - Returns: daily sales, total sales, transaction count, top products

### 🔄 Phase 2: Frontend Type Definitions (IN PROGRESS)

- [ ] 2.1 Create dashboard types file
- [ ] 2.2 Define DashboardStats type
- [ ] 2.3 Define SalesSummary type
- [ ] 2.4 Define Transaction type
- [ ] 2.5 Define TopProduct type
- [ ] 2.6 Define DailySales type

### Phase 3: API Service Layer

- [ ] 3.1 Create adminReportAPI.ts service
- [ ] 3.2 Add getDashboardReport function
- [ ] 3.3 Add getMonthlySalesReport function
- [ ] 3.4 Add getRecentTransactions function (if exists)

### Phase 4: Custom Hooks

- [ ] 4.1 Create useDashboardStats hook
- [ ] 4.2 Integrate store filtering logic
- [ ] 4.3 Add React Query caching

### Phase 5: UI Components

**Row 1 - Stats Cards (4 columns):**

- [ ] 5.1 Create DailySalesCard component
- [ ] 5.2 Create MonthlySalesCard component
- [ ] 5.3 Create MonthlyTransactionsCard component
- [ ] 5.4 Create TotalProductsCard component

**Row 2 - Analytics (3 + 1 columns):**

- [ ] 5.5 Create SalesGraphCard component (7-day line chart)
- [ ] 5.6 Create TopSellingProductsCard component

**Row 3 - Details (3 + 1 columns):**

- [ ] 5.7 Create RecentTransactionsCard component
- [ ] 5.8 Create LowStockAlertsCard component (reuse from inventory)

### Phase 6: Dashboard Page Integration

- [ ] 6.1 Update dashboard page layout
- [ ] 6.2 Add store selector for Super Admin
- [ ] 6.3 Integrate all components
- [ ] 6.4 Add loading states
- [ ] 6.5 Add error handling
- [ ] 6.6 Add refresh functionality

### Phase 7: Testing & Polish

- [ ] 7.1 Test with Super Admin (all stores)
- [ ] 7.2 Test with Store Admin (single store)
- [ ] 7.3 Verify data accuracy
- [ ] 7.4 Performance optimization
- [ ] 7.5 Responsive design check

## 📊 Dashboard Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  Admin Dashboard Header + Store Selector (Super Admin only)     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Daily Sales  │Monthly Sales │Monthly Trans │Total Products│  Row 1
│   $X,XXX     │   $XX,XXX    │     XXX      │     XXX      │
└──────────────┴──────────────┴──────────────┴──────────────┘

┌─────────────────────────────────────────────┬──────────────┐
│      Sales Summary Graph (7 days)           │Top Selling   │  Row 2
│      Line chart showing daily sales         │Products      │
│                                              │  1. Product  │
│                                              │  2. Product  │
└─────────────────────────────────────────────┴──────────────┘

┌─────────────────────────────────────────────┬──────────────┐
│      Recent Transactions                     │Low Stock     │  Row 3
│  - Transaction ID, User, Product, Status    │Alerts        │
│  - Transaction ID, User, Product, Status    │  - Product   │
│  - Transaction ID, User, Product, Status    │  - Product   │
└─────────────────────────────────────────────┴──────────────┘
```

## 🎯 Current Status

**Phase:** 2 - Frontend Type Definitions
**Next Step:** Create dashboard types file
