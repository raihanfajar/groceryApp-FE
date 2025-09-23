"use client";

import { useRouter } from "next/navigation";

function page() {
  const router = useRouter();
  return router.push("/");
}

export default page;
