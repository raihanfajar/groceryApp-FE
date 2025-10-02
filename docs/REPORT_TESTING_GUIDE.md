# Report & Analysis Feature - Testing Guide

## Prerequisites

1. **Backend Server Running**

   ```bash
   cd /Users/adit/Projects/groceryApp/groceryApp-BE
   npm run dev
   ```

   Backend should be running on `http://localhost:8000`

2. **Frontend Server Running**

   ```bash
   cd /Users/adit/Projects/groceryApp/groceryApp-FE
   npm run dev
   ```

   Frontend should be running on `http://localhost:3000`

3. **Admin Account**
   - You need an admin account to access the reports
   - Login at `/admin/login`

## Testing Steps

### 1. Access Reports Page

Navigate to: `http://localhost:3000/admin/reports`

**Expected:**

- Page loads without errors
- Three tabs are visible: Dashboard, Sales Reports, Stock Reports
- Filter controls are displayed (Month, Year, and Store if super admin)
- Default values: Current month and year

### 2. Test Dashboard Tab

**What to Check:**

- ✅ Four metric cards display:
  - Total Sales (Revenue + Order count)
  - Average Order Value
  - Products Sold count
  - Low Stock Alerts count
- ✅ Top Selling Products list shows with:
  - Product names
  - Quantities sold
  - Revenue per product
- ✅ Low Stock Alert section (if any alerts exist)
- ✅ All values formatted in Indonesian Rupiah
- ✅ Loading skeletons appear while data is fetching
- ✅ Error message displays if API call fails

**Test Interactions:**

1. Change month filter - data should update
2. Change year filter - data should update
3. If super admin, change store filter - data should update

### 3. Test Sales Reports Tab

#### Monthly Overview Sub-tab

**What to Check:**

- ✅ Three summary cards:
  - Total Revenue
  - Total Orders
  - Average Order Value
- ✅ Top Selling Products list
- ✅ Daily Sales Line Chart displays (if daily data exists)
  - X-axis shows day of month
  - Y-axis shows revenue
  - Line connects all data points
- ✅ Revenue Distribution Pie Chart (top 8 products)
  - Shows percentages
  - Legend displays with percentages
  - Hover shows exact values

**Test Interactions:**

1. Hover over line chart points - tooltip should show revenue
2. Hover over pie chart sections - tooltip should show product and revenue
3. Change filters - charts should update

#### By Category Sub-tab

**What to Check:**

- ✅ Revenue by Category Bar Chart displays
  - Each bar represents a category
  - Colors are distinct
  - Y-axis shows revenue
- ✅ Category detail cards show:
  - Category name
  - Total revenue
  - Units sold
  - Top 3 products in that category
- ✅ All monetary values in IDR format

**Test Interactions:**

1. Hover over bars - tooltip shows category revenue
2. Scroll through category cards
3. Verify top products match backend data

### 4. Test Stock Reports Tab

**What to Check:**

- ✅ Four metric cards:
  - Total Products
  - Low Stock count (yellow)
  - Out of Stock count (red)
  - Stock Value in IDR
- ✅ Stock Movements section:
  - Stock In (green) - total and transaction count
  - Stock Out (red) - total and transaction count
  - Adjustments (blue) - total and transaction count
- ✅ Top Restocked Products list
  - Product names
  - Restocked quantities in green

**Test Interactions:**

1. Change filters - stock data updates
2. Verify low/out of stock counts match alerts

### 5. Test Filters

**Month Filter:**

- ✅ Dropdown shows all 12 months
- ✅ Current month selected by default
- ✅ Changing month updates all data
- ✅ Data refetches on change

**Year Filter:**

- ✅ Shows current year and 5 previous years
- ✅ Current year selected by default
- ✅ Changing year updates all data

**Store Filter (Super Admin Only):**

- ✅ Only visible for super admins
- ✅ Shows "All stores" option
- ✅ Lists all available stores
- ✅ Regular admins see data for their store only

### 6. Test Responsive Design

**Desktop (>1024px):**

- ✅ Metric cards in 4-column grid
- ✅ Category cards in 2-column grid
- ✅ Charts display at full width
- ✅ All text readable

**Tablet (768px - 1024px):**

- ✅ Metric cards in 2-column grid
- ✅ Charts adjust width appropriately
- ✅ Tabs stack nicely

**Mobile (<768px):**

- ✅ Metric cards stack vertically
- ✅ Charts are scrollable if needed
- ✅ Filters stack vertically
- ✅ Tab buttons are full width

### 7. Test Error States

**To Trigger Errors:**

1. Stop backend server
2. Try changing filters
3. Refresh page

**Expected Behavior:**

- ✅ Red error alert appears
- ✅ Message: "Failed to load [type] data. Please try again later."
- ✅ No app crash
- ✅ Other working sections still function

**Network Issues:**

- ✅ Loading state shows during fetch
- ✅ Timeout shows error after delay
- ✅ Can retry by changing filters

### 8. Test Loading States

**What to Check:**

- ✅ Skeleton loaders appear immediately
- ✅ Skeletons match final content layout
- ✅ Smooth transition from loading to content
- ✅ No flash of wrong content

### 9. Test Authentication

**Logged Out:**

- ✅ Redirects to login page
- ✅ Cannot access /admin/reports
- ✅ API calls include auth token

**Logged In (Regular Admin):**

- ✅ Can access reports
- ✅ Sees only their store data
- ✅ No store filter visible

**Logged In (Super Admin):**

- ✅ Can access reports
- ✅ Can see all stores data
- ✅ Store filter is visible and functional

### 10. Test Data Accuracy

**Verify Against Database:**

1. Check backend logs for API calls
2. Compare displayed totals with database queries
3. Verify calculations:
   - Average Order Value = Total Revenue / Total Orders
   - Percentages add up to 100%
   - Stock movements balance correctly

## API Endpoints Being Tested

**Base URL:** `http://localhost:8000`

```
GET /reports/dashboard
  - Params: storeId?, month, year
  - Returns: DashboardReport

GET /reports/sales/monthly
  - Params: storeId?, month, year
  - Returns: MonthlySalesReport

GET /reports/sales/categories
  - Params: storeId?, month, year
  - Returns: CategorySalesReport[]

GET /reports/stock/monthly
  - Params: storeId?, month, year
  - Returns: MonthlyStockReport
```

## Common Issues & Solutions

### Issue: Charts not displaying

**Solution:**

- Check recharts is installed: `npm list recharts`
- If missing: `npm install recharts`
- Restart dev server

### Issue: "Cannot find module" TypeScript errors

**Solution:**

- Restart TypeScript server in VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
- If persists, restart VS Code

### Issue: No data showing

**Solution:**

- Check backend is running
- Verify admin is logged in
- Check browser console for API errors
- Verify month/year has data in database

### Issue: Filters not updating data

**Solution:**

- Check React Query devtools (if installed)
- Verify queryKey includes all filter params
- Check enabled condition in hooks

### Issue: Authorization errors

**Solution:**

- Check admin token in localStorage
- Verify token not expired
- Re-login if needed

## Performance Benchmarks

**Target Metrics:**

- Initial page load: < 2s
- Filter change response: < 500ms
- Chart rendering: < 300ms
- Network request: < 1s

**Monitor:**

- Browser DevTools → Network tab
- React DevTools → Profiler
- Console for any warnings

## Browser Compatibility

Test in:

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## Accessibility Testing

- ✅ Keyboard navigation works
- ✅ Screen reader compatible
- ✅ Color contrast meets WCAG AA
- ✅ Focus indicators visible

## Security Testing

- ✅ Requires authentication
- ✅ Admin-only access
- ✅ No sensitive data in URLs
- ✅ API calls include auth headers
- ✅ XSS protection in place

## Final Checklist

Before considering feature complete:

- [ ] All tabs load without errors
- [ ] All charts display correctly
- [ ] Filters update data properly
- [ ] Error states handled gracefully
- [ ] Loading states smooth
- [ ] Mobile responsive
- [ ] Data accuracy verified
- [ ] No console errors
- [ ] TypeScript compiles successfully
- [ ] Backend integration working
- [ ] Authentication enforced
- [ ] Super admin features work
- [ ] Regular admin restrictions work
- [ ] Documentation complete

## Next Steps After Testing

1. **If all tests pass:**
   - Commit changes
   - Create pull request
   - Add screenshots to PR
   - Request code review

2. **If issues found:**
   - Document issues
   - Prioritize fixes
   - Fix and re-test
   - Update documentation

## Test Data Requirements

For complete testing, ensure database has:

- At least 2 stores (for super admin testing)
- Multiple product categories
- Transactions across multiple days
- Various product sales
- Some low stock products
- Stock movement history (IN, OUT, ADJUSTMENT)

---

**Last Updated:** January 2025
**Tester:** [Your Name]
**Test Environment:** Development
**Feature Branch:** feature/report-analysis-frontend
