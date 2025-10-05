import { Card, CardContent } from "@/components/ui/card";
import {
  TransactionFinal,
  TransactionProductFinal,
} from "@/types/transaction/FinalTypes";
import { useState } from "react";
import {
  ApproveModal,
  CancelModal,
  ShipModal,
} from "./TransactionActionModals";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import formatCurrency from "@/utils/FormatCurrency";
import TransactionStatusBadge from "./BadgeTransactionList";

const TransactionItemsList = ({
  items,
}: {
  items: TransactionProductFinal[];
}) => {
  const [showAll, setShowAll] = useState(false);
  if (!items || items.length === 0) return <span>-</span>;

  const displayedItems = showAll ? items : items.slice(0, 1);

  return (
    <div>
      {displayedItems.map((item) => (
        <div key={item.id} className="mb-2">
          <p className="font-medium">- {item.product.name}</p>
          <p className="pl-4 text-sm text-gray-600">
            Qty: {item.quantity} x {formatCurrency(item.price)}
          </p>
        </div>
      ))}
      {items.length > 1 && !showAll && (
        <Button
          variant="link"
          size="sm"
          onClick={() => setShowAll(true)}
          className="h-auto p-0"
        >
          See {items.length - 1} more item(s)
        </Button>
      )}
    </div>
  );
};

const AdminActions = ({ transaction }: { transaction: TransactionFinal }) => {
  if (transaction.status === "waiting_confirmation") {
    return (
      <div className="flex gap-2">
        <ApproveModal transaction={transaction} />
        <CancelModal transactionId={transaction.id} />
      </div>
    );
  }
  if (transaction.status === "on_process") {
    return (
      <div className="flex gap-2">
        <ShipModal transaction={transaction} />
        <CancelModal transactionId={transaction.id} />
      </div>
    );
  }
  return <span>-</span>;
};

const SuperAdminPriceInfo = ({ trx }: { trx: TransactionFinal }) => (
  <div className="text-sm">
    <p>Products: {formatCurrency(trx.totalProductPrice)}</p>
    <p>Shipping: {formatCurrency(trx.finalShippingPrice)}</p>
    <p className="font-bold">Total: {formatCurrency(trx.totalPrice)}</p>
  </div>
);

interface TransactionTableProps {
  transactions: TransactionFinal[];
  isSuper: boolean;
}

export function TransactionTable({
  transactions,
  isSuper,
}: TransactionTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        {/* Desktop Table */}
        <table className="hidden w-full text-sm lg:table">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Status
              </th>
              <th className="p-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Transaction ID
              </th>
              <th className="p-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Items
              </th>
              <th className="p-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                {isSuper ? "Price Details" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trx) => (
              <tr key={trx.id} className="border-b">
                <td className="p-4 align-top">
                  <TransactionStatusBadge status={trx.status} />
                </td>
                <td className="p-4 align-top">
                  <p className="line-clamp-1 font-mono break-words">{trx.id}</p>
                </td>
                <td className="p-4 align-top">
                  <TransactionItemsList items={trx.products ?? []} />
                </td>
                <td className="p-4 align-top">
                  {isSuper ? (
                    <SuperAdminPriceInfo trx={trx} />
                  ) : (
                    <AdminActions transaction={trx} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile/Tablet List */}
        <div className="lg:hidden">
          {transactions.map((trx) => (
            <div
              key={trx.id}
              className="flex items-center justify-between border-b p-4"
            >
              <div>
                <p className="line-clamp-1 font-mono text-xs break-words">
                  {trx.id}
                </p>
                <TransactionStatusBadge status={trx.status} />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    Details
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Transaction Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>
                      <strong>ID:</strong>{" "}
                      <span className="font-mono text-xs">{trx.id}</span>
                    </p>
                    <div>
                      <strong>Items:</strong>{" "}
                      <TransactionItemsList items={trx.products ?? []} />
                    </div>
                    <hr />
                    {isSuper ? (
                      <SuperAdminPriceInfo trx={trx} />
                    ) : (
                      <AdminActions transaction={trx} />
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
