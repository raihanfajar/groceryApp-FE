import {
  useAdminCancelStoreTransactionMutation,
  useAdminConfirmOrderMutation,
  useAdminShipTransactionMutation,
} from "@/hooks/admin/transaction/adminTransaction";
import { TransactionFinal } from "@/types/transaction/FinalTypes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import Image from "next/image";
import formatCurrency from "@/utils/FormatCurrency";

export function CancelModal({ transactionId }: { transactionId: string }) {
  const mutation = useAdminCancelStoreTransactionMutation();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will cancel the transaction. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Back</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutation.mutate(transactionId)}>
            Yes, Cancel
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ApproveModal({
  transaction,
}: {
  transaction: TransactionFinal;
}) {
  const mutation = useAdminConfirmOrderMutation();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          Approve
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            Total Price:{" "}
            <strong>{formatCurrency(transaction.totalPrice)}</strong>
          </p>
          {transaction.paymentProof ? (
            <div className="relative h-64 w-full">
              <Image
                src={transaction.paymentProof}
                alt="Payment Proof"
                layout="fill"
                objectFit="contain"
              />
            </div>
          ) : (
            <p className="text-red-500">No payment proof uploaded.</p>
          )}
          <Button
            onClick={() => mutation.mutate(transaction.id)}
            className="w-full"
          >
            Confirm Approval
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ShipModal({ transaction }: { transaction: TransactionFinal }) {
  const mutation = useAdminShipTransactionMutation();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const allItems = transaction.products ?? [];
  const allItemsChecked =
    allItems.length > 0 && allItems.every((item) => checkedItems[item.id]);

  const handleCheckChange = (itemId: string, checked: boolean) => {
    setCheckedItems((prev) => ({ ...prev, [itemId]: checked }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          Ship
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Prepare Shipment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Check all items before shipping:</p>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {allItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-2 rounded-md border p-2"
              >
                <Checkbox
                  id={item.id}
                  onCheckedChange={(checked) =>
                    handleCheckChange(item.id, !!checked)
                  }
                />
                <label htmlFor={item.id} className="flex-1">
                  {item.product.name} (x{item.quantity})
                </label>
              </div>
            ))}
          </div>
          {/* Nested Confirmation Dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={!allItemsChecked} className="w-full">
                Ship Items
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Shipment</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure all items have been checked and are ready for
                  shipment?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Back</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => mutation.mutate(transaction.id)}
                >
                  Yes, Ship Now
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}
