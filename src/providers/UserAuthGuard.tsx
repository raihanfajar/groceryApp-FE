"use client";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { axiosInstance } from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

// FIX 4: Make the response interface more specific
interface ISessionData {
  id: string;
  name: string;
  email: string;
}

interface IApiResponse {
  data: {
    data: ISessionData;
    message: string;
    status: string;
  };
}

export default function UserAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id, name, email, accessToken, setAuth } = useUserAuthStore();
  const router = useRouter();

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!accessToken) {
      router.push("/user-login");
    } else if (!name) {
      const fetchSession = async () => {
        try {
          const res: IApiResponse = await axiosInstance.get(
            "/user/session-login",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          const userData = res.data.data;

          setAuth({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            accessToken: accessToken,
          });
        } catch (error) {
          console.error("Session is invalid or expired:", error);
          useUserAuthStore.getState().clearAuth();
          router.push("/user-login");
        }
      };

      fetchSession();
    }
  }, [isHydrated, accessToken, name, email, router, id, setAuth]);

  if (!isHydrated) {
    return <FaSpinner className="m-auto animate-spin text-2xl" />; // Return null or a loading spinner here
  }

  return <>{children}</>;
}
