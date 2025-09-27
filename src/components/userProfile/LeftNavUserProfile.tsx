"use client";
import { useGetUserProfileInfo } from "@/hooks/userProfile/useGetUserProfileInfo";
import { cn } from "@/lib/utils";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";

const transactionMapItems = [
  { name: "Created", href: "/user-profile/created" },
  { name: "Waiting for payment", href: "/user-profile/waiting-for-payment" },
  { name: "Processed", href: "/user-profile/processed" },
  { name: "Sent", href: "/user-profile/sent" },
  { name: "Done", href: "/user-profile/done" },
  { name: "Cancelled", href: "/user-profile/cancelled" },
];

const myAccountMapItems = [
  { title: "Settings", href: "/user-profile/settings" },
];

const LeftNavUserProfile = () => {
  const { accessToken } = useUserAuthStore();
  const pathname = usePathname();
  const { data: userProfileInfo } = useGetUserProfileInfo(accessToken);

  return (
    <>
      <Card className="rounded-2xl border border-gray-200 shadow-md">
        <CardContent className="space-y-4 p-4">
          {/* Profile name */}
          <div className="text-center">
            <div className="mx-auto mb-2 h-16 w-16 rounded-full bg-gray-300">
              <Image
                src="/profile.jpg"
                alt="profile"
                width={100}
                height={100}
                className="rounded-full border-2 border-gray-300 object-contain"
              />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              {userProfileInfo?.name}
            </h2>
          </div>

          {/* Transactions */}
          <div>
            <h3 className="mt-4 mb-2 text-sm font-medium text-gray-500 uppercase">
              Transaction
            </h3>
            <ul className="space-y-2 text-gray-700">
              {transactionMapItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block cursor-pointer rounded-md hover:text-green-600",
                      pathname === item.href
                        ? "bg-gray-200 px-0.5 py-1 font-semibold"
                        : "",
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h3 className="mt-6 mb-2 text-sm font-medium text-gray-500 uppercase">
              My Account
            </h3>
            <ul className="space-y-2 text-gray-700">
              {myAccountMapItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block cursor-pointer rounded-md hover:text-green-600",
                      pathname === item.href
                        ? "bg-gray-200 px-0.5 py-1 font-semibold"
                        : "",
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default LeftNavUserProfile;
