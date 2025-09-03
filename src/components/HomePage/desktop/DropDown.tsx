import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
