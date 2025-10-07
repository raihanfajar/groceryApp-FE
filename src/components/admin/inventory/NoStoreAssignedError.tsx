import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function NoStoreAssignedError() {
  return (
    <Card>
      <CardContent className="flex h-64 items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Account Configuration Required
          </h3>
          <p className="mt-2 text-gray-600">
            Your store admin account is not assigned to any store. Please
            contact your administrator to complete your account setup.
          </p>
          <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Technical Details:</strong>
              <br />
              Store admin accounts require a store assignment in the backend
              database. Your administrator needs to update your user record with
              a valid storeId.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
