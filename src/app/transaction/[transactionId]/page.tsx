"use client";
import { useTransactionDetailsQuery } from "@/hooks/transaction/useTransaction";
import UserAuthGuard from "@/providers/UserAuthGuard";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import TransactionHeading from "../components/TransactionHeading";
import TransactionAddress from "../components/TransactionAddress";
import TransactionProductItem from "../components/TransactionProductItem";
import TransactionSummary from "../components/TransactionSummary";
import { dummyTransaction } from "@/types/checkout/dummyDataTransaction";

function page() {
  const router = useRouter(); 
  // const transactionId = useParams<{ transactionId: string }>();
  // const { data: transaction, isLoading } = useTransactionDetailsQuery(
  //   transactionId?.transactionId,
  // );

  // if (isLoading) {
  //   return (
  //     <div className="container mx-auto flex min-h-screen items-center justify-center p-4 text-center">
  //       <span className="loading loading-ring loading-sm"></span>
  //       <span className="loading loading-ring loading-md"></span>
  //       <span className="loading loading-ring loading-lg"></span>
  //     </div>
  //   );
  // }

  // if (!transactionId || !transaction) {
  //   router.push("/");
  //   return null;
  // }

  const transaction = dummyTransaction;

  return (
    // <UserAuthGuard>
      <div className="container mx-auto mb-10 p-4">
        <TransactionHeading />
        <TransactionAddress
          receiverName={transaction.receiverName}
          receiverPhoneNumber={transaction.phoneNumber}
          addressDetails={transaction.address}
          district={transaction.district}
          city={transaction.city}
          province={transaction.province}
          addressLabel={transaction.addressLabel}
        />
        {transaction.productsTransaction?.map((item) => (
          <TransactionProductItem key={item.id} item={item} />
        ))}
        <TransactionSummary transaction={transaction} />
      </div>
    // </UserAuthGuard>
  );
}

export default page;
