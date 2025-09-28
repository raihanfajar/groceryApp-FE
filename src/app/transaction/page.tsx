"use client";

import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  return router.push("/");
}

export default Page;
