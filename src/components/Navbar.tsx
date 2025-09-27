"use client";
import { CART_QUERY_KEY } from "@/hooks/cart/getUserCart";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import BotNavDesktop from "./homePage/desktop/BotNavDesktop";
import TopNavDesktop from "./homePage/desktop/TopNavDesktop";
import BotNavMobile from "./homePage/mobile/BotNavMobile";
import TopNavMobile from "./homePage/mobile/TopNavMobile";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type CartCountResponse = {
  message: string;
  data: {
    count: number;
  };
};

const Navbar = () => {
  const { accessToken } = useUserAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToLogin = () => {
    const returnUrl =
      pathname + (searchParams.toString() ? `?${searchParams}` : "");
    router.push(`/user-login?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  const { data: cartData } = useQuery<CartCountResponse | null>({
    queryKey: [...CART_QUERY_KEY, "count"],
    queryFn: async () => {
      if (!accessToken) return null;
      const response = await axiosInstance.get<CartCountResponse>(
        "/cart/count",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return response.data;
    },
    enabled: !!accessToken,
  });

  const cartItemCount = cartData?.data?.count || 0;

  return (
    <>
      {/* Desktop */}
      <nav className="sticky top-0 right-0 left-0 z-50 hidden text-sm font-medium text-gray-600 lg:block">
        <section className="flex flex-col justify-center shadow-2xs shadow-gray-500">
          <TopNavDesktop />
          <BotNavDesktop cartCount={cartItemCount} onClick={goToLogin} />
        </section>

        {/* Mobile */}
      </nav>
      <nav className="sticky top-0 right-0 left-0 z-50 text-sm font-medium text-gray-600 lg:hidden">
        <section className="flex flex-col justify-center shadow-2xs shadow-gray-500">
          <TopNavMobile cartCount={cartItemCount} onClick={goToLogin} />
          <BotNavMobile />
        </section>
      </nav>
    </>
  );
};

export default Navbar;
