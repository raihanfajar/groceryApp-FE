"use client";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const LoginSuccessClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setAuth = useUserAuthStore((state) => state.setAuth);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const token = searchParams.get("token");
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const email = searchParams.get("email");

    if (token && id && name && email) {
      // simulate small delay to show spinner UX
      setTimeout(() => {
        setAuth({ id, name, email, accessToken: token });
        setStatus("success");
      }, 1000);
    } else {
      setStatus("error");
    }
  }, [searchParams, setAuth]);

  useEffect(() => {
    if (status === "success") {
      const interval = setInterval(
        () => setCountdown((c) => (c > 0 ? c - 1 : 0)),
        1000,
      );

      const timeout = setTimeout(() => {
        router.replace("/");
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [status, router]);

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
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
            <p className="text-base font-medium text-gray-700">
              Logging you in with Google…
            </p>
          </div>
        )}

        {/* Success */}
        {status === "success" && (
          <div className="flex flex-col items-center">
            <p className="mb-2 text-xl font-semibold text-green-600">
              ✅ Login with google successful!
            </p>
            <p className="text-gray-600">
              Redirecting to home in{" "}
              <span className="font-semibold text-gray-800">{countdown}</span>{" "}
              seconds…
            </p>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="flex flex-col items-center">
            <p className="mb-2 text-xl font-semibold text-red-600">
              ❌ Google login failed
            </p>
            <p className="mb-6 text-center text-gray-600">
              Something went wrong. Please try again.
            </p>
            <button
              onClick={() => router.replace("/user-login")}
              className="rounded-lg bg-red-500 px-5 py-2 font-medium text-white shadow transition-colors hover:bg-red-600"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSuccessClient;
