import { useUserAuthStore } from "@/store/useUserAuthStore";
import BotNavDesktop from "./HomePage/desktop/BotNavDesktop";
import TopNavDesktop from "./HomePage/desktop/TopNavDesktop";
import BotNavMobile from "./HomePage/mobile/BotNavMobile";
import TopNavMobile from "./HomePage/mobile/TopNavMobile";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { CART_QUERY_KEY } from "@/hooks/cart/getUserCart";

type CartCountResponse = {
  message: string;
  data: {
    count: number;
  };
};

const Navbar = () => {
  const { accessToken } = useUserAuthStore();

  const { data: cartData } = useQuery<CartCountResponse | null>({
    queryKey: [...CART_QUERY_KEY, "count"],
    queryFn: async () => {
      if (!accessToken) return null;
      const response = await axiosInstance.get<CartCountResponse>("/cart/count", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    },
    enabled: !!accessToken,
  });

  const cartItemCount = cartData?.data?.count || 0;

  return (
    <>
      {/* Desktop */}
      <nav className="sticky top-0 right-0 left-0 z-50 hidden text-sm font-medium text-gray-600 lg:block">
        <section className="flex flex-col justify-center shadow-md shadow-gray-500">
          <TopNavDesktop />
          <BotNavDesktop cartCount={cartItemCount} />
        </section>

        {/* Mobile */}
      </nav>
      <nav className="sticky top-0 right-0 left-0 z-50 text-sm font-medium text-gray-600 lg:hidden">
        <section className="flex flex-col justify-center shadow-md shadow-gray-500">
          <TopNavMobile cartCount={cartItemCount} />
          <BotNavMobile />
        </section>
      </nav>
    </>
  );
};

export default Navbar;
