import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeftRight, Clock, BarChart3 } from "lucide-react";
import Link from "next/link";

interface InventoryQuickActionsProps {
  selectedStoreId: string;
  isSuper: boolean;
}

export default function InventoryQuickActions({
  selectedStoreId,
  isSuper,
}: InventoryQuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common inventory management tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href={`/admin/inventory/stock${selectedStoreId ? `?storeId=${selectedStoreId}` : ""}`}
          >
            <Button className="w-full" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Update Stock
            </Button>
          </Link>

          <Link href="/admin/inventory/journal">
            <Button className="w-full" variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              View History
            </Button>
          </Link>

          {isSuper && (
            <Link href="/admin/inventory/transfer">
              <Button className="w-full" variant="outline">
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Transfer Stock
              </Button>
            </Link>
          )}

          <Link href="/admin/inventory/reports">
            <Button className="w-full" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
