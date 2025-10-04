import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface StockJournalHeaderProps {
  isSuper: boolean;
  storeName?: string;
  stats?: {
    movementsToday: number;
    stockAdditions: number;
    stockReductions: number;
    transfers: number;
  };
}

const StockJournalHeader: React.FC<StockJournalHeaderProps> = ({
  isSuper,
  storeName,
  stats,
}) => {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/inventory")}
              className="text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inventory
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Journal</h1>
          <p className="text-gray-600">
            {isSuper
              ? "View stock movement history across all stores"
              : `View stock movements for ${storeName || "your store"}`}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Journal
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Journal Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats?.movementsToday ?? 0}
              </div>
              <div className="text-sm text-gray-600">Movements Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats?.stockAdditions ?? 0}
              </div>
              <div className="text-sm text-gray-600">Stock Additions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats?.stockReductions ?? 0}
              </div>
              <div className="text-sm text-gray-600">Stock Reductions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.transfers ?? 0}
              </div>
              <div className="text-sm text-gray-600">Transfers</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockJournalHeader;
