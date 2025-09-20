import UserAuthGuard from "@/providers/UserAuthGuard";
import React from "react";

const page = () => {
  return (
    <UserAuthGuard>
      <div>page</div>
    </UserAuthGuard>
  );
};

export default page;
