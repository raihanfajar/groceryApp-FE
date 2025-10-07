import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function TransferHelpCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          Important Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex gap-2">
            <span className="text-blue-600">•</span>
            <span>Stock will be immediately updated in both stores</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600">•</span>
            <span>Transfer will be recorded in the stock journal</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600">•</span>
            <span>Ensure sufficient stock at source store</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600">•</span>
            <span>This action cannot be undone automatically</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
