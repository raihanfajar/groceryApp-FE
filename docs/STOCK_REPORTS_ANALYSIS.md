# Stock Reports Discrepancy Analysis

## Issue Identified

There is a **data structure mismatch** between the **Stock Reports** tab (in Sales & Reports) and the **Inventory Management Reports** page. They are calling different backend endpoints with different data structures.

---

## Current Implementation

### 1. **Stock Reports Tab** (Sales & Reports)
**Location:** `/admin/reports` → Stock Reports Tab  
**Component:** `StockReports.tsx`  
**Hook:** Inline `useQuery` in component  
**API Endpoint:** `/reports/stock/monthly`  
**Backend Service:** `report.service.ts → getMonthlyStockReport()`

**Expected Data Structure from Backend:**
```typescript
{
  period: {
    month: number;
    year: number;
    startDate: string;
    endDate: string;
  };
  summary: {
    totalMovements: number;
    uniqueProducts: number;
    totalQuantityMoved: number;
  };
  movementsByType: Array<{
    type: 'IN' | 'OUT' | 'ADJUSTMENT';
    _sum: { quantity: number };
    _count: { _all: number };
  }>;
  productMovements: Array<{
    productId: string;
    productName: string;
    categoryName: string;
    storeId: string;
    totalQuantityMoved: number;
    movementCount: number;
  }>;
  lowStockAlerts: Array<{
    productId: string;
    productName: string;
    categoryName: string;
    storeId: string;
    storeName: string;
    currentStock: number;
    status: 'OUT_OF_STOCK' | 'LOW_STOCK';
  }>;
  storeFilter: string | null;
}
```

**What Frontend Expects (MonthlyStockReport interface):**
```typescript
{
  month: number;
  year: number;
  storeId?: string;
  storeName?: string;
  totalProducts: number;          // ❌ MISSING
  lowStockProducts: number;        // ❌ MISSING
  outOfStockProducts: number;      // ❌ MISSING
  stockValue: number;              // ❌ MISSING
  stockMovements: Array<{
    type: 'IN' | 'OUT' | 'ADJUSTMENT';
    quantity: number;
    count: number;
  }>;
  topRestockedProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
  }>;
}
```

### 2. **Inventory Management Reports**
**Location:** `/admin/inventory/reports`  
**Component:** `InventoryReportsPage`  
**Hook:** `useInventoryReports`  
**API Endpoint:** `/admin/inventory/summary`  
**Backend Service:** `inventory.service.ts → getInventorySummary()`

**Actual Data Structure from Backend:**
```typescript
{
  totalProducts: number;
  totalStock: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  recentMovements: number;
  stockByCategory: Array<{
    categoryId: string;
    categoryName: string;
    totalStock: number;
    productCount: number;
  }>;
}
```

---

## Problems Identified

### Problem 1: Wrong Backend Endpoint Being Called
- **Stock Reports Tab** calls `/reports/stock/monthly` which returns **stock journal movements**
- Should be calling `/admin/inventory/summary` for current **inventory snapshot**

### Problem 2: Data Structure Mismatch
The `MonthlyStockReport` TypeScript interface expects:
- ✅ `stockMovements` - Available from `/reports/stock/monthly`
- ❌ `totalProducts` - NOT available from `/reports/stock/monthly`
- ❌ `lowStockProducts` (count) - NOT available from `/reports/stock/monthly`
- ❌ `outOfStockProducts` (count) - NOT available from `/reports/stock/monthly`
- ❌ `stockValue` - NOT available from `/reports/stock/monthly`
- ❌ `topRestockedProducts` - NOT available from `/reports/stock/monthly`

### Problem 3: Semantic Confusion
- **Stock Movements** = Historical changes (IN/OUT/ADJUSTMENT) - Time-based report
- **Current Stock Status** = Real-time inventory levels - Snapshot at a point in time

The Stock Reports tab is trying to show **current stock status** but calling an endpoint that returns **historical movements**.

---

## Root Cause

The backend `/reports/stock/monthly` endpoint returns:
1. ✅ Stock movements by type (IN/OUT/ADJUSTMENT) - **This is correct**
2. ✅ Product movements with quantities - **This is correct**
3. ✅ Low stock alerts - **This is correct**
4. ❌ **BUT MISSING:** Total products count, low stock count, out of stock count, stock value

The frontend expects these summary metrics that aren't being returned.

---

## Solution Options

### **Option 1: Fix Backend Endpoint** ⭐ RECOMMENDED
Modify `/reports/stock/monthly` to return the expected data structure.

**Changes needed in `report.service.ts`:**

```typescript
async getMonthlyStockReport(adminId: string, filters: StockReportFilters) {
  // ... existing code ...

  // ADD: Get current stock counts
  const storeProducts = await prisma.storeProduct.findMany({
    where: {
      deletedAt: null,
      ...(validatedStoreId && { storeId: validatedStoreId }),
      product: {
        deletedAt: null,
        isActive: true,
      },
    },
    include: {
      product: {
        select: {
          name: true,
          price: true,
        },
      },
    },
  });

  const totalProducts = storeProducts.length;
  const lowStockCount = storeProducts.filter(sp => sp.stock > 0 && sp.stock <= (sp.minStock || 5)).length;
  const outOfStockCount = storeProducts.filter(sp => sp.stock === 0).length;
  const stockValue = storeProducts.reduce((sum, sp) => sum + (sp.stock * sp.product.price), 0);

  // ADD: Get top restocked products (products with most IN movements)
  const topRestockedProducts = stockMovements
    .filter(sm => sm.type === 'IN')
    .sort((a, b) => (b._sum?.quantity || 0) - (a._sum?.quantity || 0))
    .slice(0, 5)
    .map(sm => {
      const product = productDetails.find(p => p.id === sm.productId);
      return {
        productId: sm.productId,
        productName: product?.name || 'Unknown',
        quantity: sm._sum?.quantity || 0,
      };
    });

  return {
    month: filters.month,
    year: filters.year,
    storeId: validatedStoreId,
    storeName: 'Store Name', // Get from store lookup
    totalProducts,
    lowStockProducts: lowStockCount,
    outOfStockProducts: outOfStockCount,
    stockValue,
    stockMovements: stockByType.map(st => ({
      type: st.type,
      quantity: st._sum?.quantity || 0,
      count: st._count?._all || 0,
    })),
    topRestockedProducts,
  };
}
```

### **Option 2: Use Correct Hook in Frontend**
Change `StockReports.tsx` to use the existing `useInventoryReports` hook.

**Changes needed:**
```typescript
// Instead of inline useQuery, use:
import { useInventoryReports } from "@/hooks/admin/useInventoryReports";

const { data: inventoryData } = useInventoryReports();

// Map the data:
const data = {
  totalProducts: inventoryData.summary?.totalProducts || 0,
  lowStockProducts: inventoryData.summary?.lowStockProducts || 0,
  outOfStockProducts: inventoryData.summary?.outOfStockProducts || 0,
  stockValue: calculateStockValue(inventoryData), // Need to implement
  stockMovements: [], // Would need separate call
  topRestockedProducts: [], // Would need separate call
};
```

### **Option 3: Hybrid Approach** ⭐ BEST SOLUTION
Use **both** endpoints and merge the data:
1. Call `/admin/inventory/summary` for current stock status
2. Call `/reports/stock/monthly` for historical movements

```typescript
const { data: currentStock } = useQuery({
  queryKey: ["inventory-summary", storeId],
  queryFn: () => axiosInstance.get(`/admin/inventory/summary`, {
    params: { storeId },
    headers: { Authorization: `Bearer ${token}` }
  }),
});

const { data: movements } = useQuery({
  queryKey: ["stock-movements", storeId, month, year],
  queryFn: () => axiosInstance.get(`/reports/stock/monthly`, {
    params: { storeId, month, year },
    headers: { Authorization: `Bearer ${token}` }
  }),
});

// Merge the data
const data = {
  ...currentStock.data,
  stockMovements: movements.data.movementsByType,
  topRestockedProducts: movements.data.productMovements.slice(0, 5),
};
```

---

## Recommended Action Plan

### Phase 1: Quick Fix (5 minutes)
1. Update `StockReports.tsx` to handle missing data gracefully
2. Show available data from `/reports/stock/monthly` endpoint
3. Add note: "Showing stock movements for the period"

### Phase 2: Backend Fix (30 minutes) ⭐ RECOMMENDED
1. Modify `getMonthlyStockReport()` in `report.service.ts`
2. Add current stock metrics to the response
3. Calculate stock value from storeProducts
4. Identify top restocked products from IN movements
5. Test with real data

### Phase 3: Frontend Update (15 minutes)
1. Update TypeScript interface to match backend response
2. Test all calculations display correctly
3. Verify both Super Admin and Store Admin views

---

## Impact Assessment

**Current State:**
- ❌ Stock Reports tab shows incomplete/incorrect data
- ❌ Users see "0" for all stock metrics
- ❌ Confusing user experience
- ✅ Inventory Management Reports page works correctly

**After Fix:**
- ✅ Stock Reports tab shows accurate current stock levels
- ✅ Historical movements displayed correctly
- ✅ Top restocked products identified
- ✅ Consistent data across both pages
- ✅ Better user experience

---

## Testing Checklist

After implementing the fix:
- [ ] Total Products shows correct count
- [ ] Low Stock Products shows correct count (stock > 0 AND stock <= minStock)
- [ ] Out of Stock Products shows correct count (stock = 0)
- [ ] Stock Value calculates correctly (sum of stock * price)
- [ ] Stock Movements by type display correctly
- [ ] Top Restocked Products list appears
- [ ] Super Admin can filter by store
- [ ] Store Admin sees only their store data
- [ ] Data matches Inventory Management Reports page
- [ ] Month/Year filter updates data correctly

---

## Conclusion

The discrepancy exists because:
1. **Wrong endpoint** - Stock Reports calls `/reports/stock/monthly` (movements) instead of combining with `/admin/inventory/summary` (current status)
2. **Missing data** - Backend doesn't return all expected fields
3. **TypeScript interface** - Defines fields that backend doesn't provide

**Best Solution:** Fix the backend `getMonthlyStockReport()` method to include current stock metrics alongside historical movements.
