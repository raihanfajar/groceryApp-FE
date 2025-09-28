"use client";
import React from "react";
import TransactionHeading from "../components/TransactionHeading";
import TransactionAddress from "../components/TransactionAddress";
import TransactionProductItem from "../components/TransactionProductItem";
import TransactionSummary from "../components/TransactionSummary";
import TransactionDetails from "../components/TransactionDetails";
import { useParams, useRouter } from "next/navigation";
import { useTransactionDetailsQuery } from "@/hooks/transaction/useTransaction";
import UserAuthGuard from "@/providers/UserAuthGuard";

function Page() {
  const router = useRouter();
  const transactionId = useParams<{ transactionId: string }>();
  const { data: transaction, isLoading } = useTransactionDetailsQuery(
    transactionId?.transactionId,
  );

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-4 text-center">
        <span className="loading loading-ring loading-sm"></span>
        <span className="loading loading-ring loading-md"></span>
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  if (!transactionId || !transaction) {
    router.push("/");
    return null;
  }

  return (
    <UserAuthGuard>
      <div className="container mx-auto mb-10 p-4">
        <TransactionHeading />
        <div className="mt-7 w-full flex-row justify-center space-y-5 md:flex md:justify-between md:gap-5 md:space-y-0">
          <TransactionDetails transaction={transaction} />
          <TransactionAddress
            receiverName={transaction.receiverName}
            receiverPhoneNumber={transaction.phoneNumber}
            addressDetails={transaction.address}
            district={transaction.district}
            city={transaction.city}
            province={transaction.province}
            addressLabel={transaction.addressLabel}
          />
        </div>
        <div className="mt-3 mb-10 w-full flex-row justify-center space-y-5 md:ml-auto lg:flex lg:justify-between lg:gap-5 lg:space-y-0">
          <div className="border-lg w-full rounded-lg border border-black bg-[#f5f5f5] p-4 lg:self-start">
            {transaction.productsTransaction?.map((item) => (
              <TransactionProductItem key={item.id} item={item} />
            ))}
          </div>
          <TransactionSummary transaction={transaction} />
        </div>
      </div>
    </UserAuthGuard>
  );
}

export default Page;
