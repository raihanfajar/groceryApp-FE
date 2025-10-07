import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Building2, ArrowLeftRight, CheckCircle } from "lucide-react";
import { Store } from "@/types/admin/inventory";
import { AdminProduct } from "@/types/admin/product";
import Image from "next/image";

interface TransferSummaryProps {
  fromStore: Store | undefined;
  toStore: Store | undefined;
  selectedProduct: AdminProduct | null;
  quantity: string;
  submitting: boolean;
  isFormValid: boolean;
}

export default function TransferSummary({
  fromStore,
  toStore,
  selectedProduct,
  quantity,
  submitting,
  isFormValid,
}: TransferSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Transfer Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* From Store */}
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium text-red-900">
            <Building2 className="h-4 w-4" />
            From
          </div>
          <p className="text-sm text-red-700">
            {fromStore
              ? `${fromStore.name} - ${fromStore.city}`
              : "Not selected"}
          </p>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowLeftRight className="h-6 w-6 text-gray-400" />
        </div>

        {/* To Store */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium text-green-900">
            <Building2 className="h-4 w-4" />
            To
          </div>
          <p className="text-sm text-green-700">
            {toStore ? `${toStore.name} - ${toStore.city}` : "Not selected"}
          </p>
        </div>

        {/* Product Info */}
        {selectedProduct && (
          <div className="rounded-lg border bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              {selectedProduct.picture1 ? (
                <Image
                  src={selectedProduct.picture1}
                  alt={selectedProduct.name}
                  width={40}
                  height={40}
                  className="rounded object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  {selectedProduct.name}
                </h4>
                <p className="text-xs text-gray-500">
                  {selectedProduct.category.name}
                </p>
              </div>
            </div>
            {quantity && (
              <div className="mt-3 border-t pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium text-gray-900">
                    {quantity} units
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={submitting || !isFormValid}
        >
          {submitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
              Transferring...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm Transfer
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
