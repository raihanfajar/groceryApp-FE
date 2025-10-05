import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

function EmptyTransactionList() {
  return (
    <Card className="flex flex-col items-center justify-center">
      <Image
        src="/empty-orders.png"
        width={200}
        height={200}
        alt="empty"
      />
      <div className="mt-6 mb-14 text-center font-semibold">
        No Transaction Found
      </div>
    </Card>
  );
}

export default EmptyTransactionList;
