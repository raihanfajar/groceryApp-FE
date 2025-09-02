import Link from "next/link";
import { MdLocationOn } from "react-icons/md";

export default function BotNavMobile() {
  return (
    <div className="flex h-8 items-center border-b-1 border-black bg-[#d8d8d8] px-4 text-[0.7rem]">
      <p className="flex items-center gap-0.5">
        <MdLocationOn />
        <span className="font-bold text-black">NO LOCATION</span>
        <Link href={"#"} className="ml-1.5 cursor-pointer">
          Login to change location
        </Link>
      </p>
    </div>
  );
}
