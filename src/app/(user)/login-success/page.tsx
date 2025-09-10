"use client";
import LoginSuccessClient from "@/components/userAuth/LoginSuccessClient";
import { Suspense } from "react";

export default function LoginSuccessPage() {
  return (
    <Suspense>
      <LoginSuccessClient />
    </Suspense>
  );
}
