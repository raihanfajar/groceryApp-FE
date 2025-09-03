import LeftNav from "@/components/discover/LeftNav";
import TermsScrollArea from "@/components/discover/TermsScrollArea";
import Image from "next/image";
import Link from "next/link";

const TermsPage = () => {
  return (
    <main className="mx-auto min-h-[calc(100vh-100px)] md:px-16">
      <div className="scaledown flex flex-col gap-6 p-6 md:flex-row">
        {/* Left Navigation */}
        <aside className="h-fit w-full md:w-1/5">
          <LeftNav />
          <Link
            href="/discoverDownloadFiles/ghostfacekilla.pdf"
            download
            className="mt-5 block text-sm text-green-600 hover:underline"
          >
            Download Terms & Conditions
          </Link>
        </aside>

        {/* Main Content */}
        <section className="flex-1 overflow-hidden rounded-md border">
          {/* Sticky Header */}
          <header className="sticky top-0 z-10 flex w-full items-center gap-3 border-b bg-green-500 p-4 text-sm text-white">
            <Image
              className="rounded-md bg-white p-1"
              src="/mainLogo/FreshNearLogoFull.png"
              alt="FreshNear Logo"
              width={120}
              height={40}
              priority
            />
            <div className="flex flex-col">
              <h1 className="text-lg text-black font-semibold">Terms & Conditions</h1>
              <time className="text-xs opacity-80">
                Updated: September 3, 2025
              </time>
            </div>
          </header>

          {/* Scrollable Content */}
          <TermsScrollArea />
        </section>
      </div>
    </main>
  );
};

export default TermsPage;
