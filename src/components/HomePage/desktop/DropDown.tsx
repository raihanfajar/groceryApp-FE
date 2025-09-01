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
          <DropdownMenuItem>How to shop</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>fnsupport@gmail.com</DropdownMenuItem>
          <DropdownMenuItem>666-666-666</DropdownMenuItem>
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
          <DropdownMenuItem>About FreshNear</DropdownMenuItem>
          <DropdownMenuItem>Terms & Condititions</DropdownMenuItem>
          <DropdownMenuItem>Privacy Policy</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
