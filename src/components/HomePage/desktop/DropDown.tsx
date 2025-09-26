import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";

export const CustomerServiceDropDown = () => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <h1 className="cursor-pointer">Customer Service</h1>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[99] w-fit border-black shadow-md shadow-gray-400">
        <DropdownMenuLabel>Customer Service</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={"/faq"}>
            <DropdownMenuItem>FAQ</DropdownMenuItem>
          </Link>
          <Link href={"/faq/how-to-shop"}>
            <DropdownMenuItem>How to shop</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={"mailto:fnsupport@gmail.com"}>
            <DropdownMenuItem>fnsupport@gmail.com</DropdownMenuItem>
          </Link>
          <Link href={"tel:666-666-666"}>
            <DropdownMenuItem>666-666-666</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const DiscoverDropDown = () => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <h1 className="cursor-pointer">Discover FreshNear</h1>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[99] w-fit border-black shadow-md shadow-gray-400">
        <DropdownMenuLabel>Discover FreshNear</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={"/about"}>
            <DropdownMenuItem>About FreshNear</DropdownMenuItem>
          </Link>
          <Link href={"/terms"}>
            <DropdownMenuItem>Terms & Condititions</DropdownMenuItem>
          </Link>
          <Link href={"/privacy"}>
            <DropdownMenuItem>Privacy Policy</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const ProfileDropDown = () => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {/* a circle icon for profile picture */}
        <Image
          src="/profile.png"
          alt="profile"
          width={40}
          height={40}
          className="cursor-pointer rounded-full border border-black"
        ></Image>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[99] w-fit border-black p-0 shadow-md shadow-gray-400">
        <DropdownMenuLabel className="bg-green-400">
          Transactions
        </DropdownMenuLabel>
        <DropdownMenuGroup className="p-1">
          <Link href={"/user-profile/waiting-for-payment"}>
            <DropdownMenuItem>Waiting for Payment</DropdownMenuItem>
          </Link>
          <Link href={"/user-profile/processed"}>
            <DropdownMenuItem>Processed</DropdownMenuItem>
          </Link>
          <Link href={"/user-profile/sent"}>
            <DropdownMenuItem>Sent</DropdownMenuItem>
          </Link>
          <Link href={"/user-profile/done"}>
            <DropdownMenuItem>Done</DropdownMenuItem>
          </Link>
          <Link href={"/user-profile/cancelled"}>
            <DropdownMenuItem>Cancelled</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuLabel className="bg-green-400">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuGroup className="p-1">
          <Link href={"/user-profile/settings"}>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
