import LeftNavUserProfile from "@/components/userProfile/LeftNavUserProfile";

const DonePage = () => {
  return (
    <main className="mx-auto min-h-[calc(100vh-100px)] bg-[#f9fafb] md:px-8 lg:px-16">
      <div className="flex flex-col gap-6 p-4 md:flex-row">
        {/* Left Navigation */}
        <aside className="hidden h-fit w-full lg:block lg:w-1/5">
          <LeftNavUserProfile />
        </aside>

        {/* Main Content */}
        <section className="flex-1 overflow-hidden"></section>
      </div>
    </main>
  );
};

export default DonePage;
