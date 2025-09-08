"use client";
import { useVerifyUserEmail } from "@/hooks/userAuth/useVerifyUserEmail";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const router = useRouter();
  const { mutate, isPending, isSuccess, isError } = useVerifyUserEmail();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (token && typeof token === "string") {
      mutate(token);
    }
  }, [token, mutate]);

  useEffect(() => {
    if (isSuccess) {
      const interval = setInterval(
        () => setCountdown((c) => (c > 0 ? c - 1 : 0)),
        1000,
      );

      const timeout = setTimeout(() => {
        router.replace("/user-login");
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isSuccess, router]);

  return (
    <div
      className="flex h-screen items-center justify-center"
      style={{
        backgroundImage: "url('/groceryBackgroundImage.jpeg')",
        backgroundSize: "25%",
      }}
    >
      <div className="w-full max-w-md rounded-xl border border-gray-300 bg-white/90 p-10 shadow-2xl">
        {/* Loading */}
        {isPending && (
          <div className="flex flex-col items-center">
            <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
            <p className="text-base font-medium text-gray-700">
              Verifying your email…
            </p>
          </div>
        )}

        {/* Success */}
        {isSuccess && (
          <div className="flex flex-col items-center">
            <p className="mb-2 text-xl font-semibold text-green-600">
              ✅ Email verified!
            </p>
            <p className="text-gray-600">
              Redirecting to login in{" "}
              <span className="font-semibold text-gray-800">{countdown}</span>{" "}
              seconds…
            </p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center">
            <p className="mb-2 text-xl font-semibold text-red-600">
              ❌ Verification failed
            </p>
            <p className="mb-6 text-center text-gray-600">
              This link may have expired. Please request a new one.
            </p>
            <button
              onClick={() => {
                if (token && typeof token === "string") {
                  setCountdown(3);
                  mutate(token);
                }
              }}
              className="rounded-lg bg-red-500 px-5 py-2 font-medium text-white shadow transition-colors hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
