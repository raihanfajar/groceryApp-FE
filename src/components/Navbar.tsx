import BotNavDesktop from "./homePage/desktop/BotNavDesktop";
import TopNavDesktop from "./homePage/desktop/TopNavDesktop";
import BotNavMobile from "./homePage/mobile/BotNavMobile";
import TopNavMobile from "./homePage/mobile/TopNavMobile";

const Navbar = () => {
  return (
    <>
      {/* Desktop */}
      <nav className="sticky top-0 right-0 left-0 z-50 hidden text-sm font-medium text-gray-600 lg:block">
        <section className="flex flex-col justify-center shadow-md shadow-gray-500">
          <TopNavDesktop />
          <BotNavDesktop />
        </section>

        {/* Mobile */}
      </nav>
      <nav className="sticky top-0 right-0 left-0 z-50 text-sm font-medium text-gray-600 lg:hidden">
        <section className="flex flex-col justify-center shadow-md shadow-gray-500">
          <TopNavMobile />
          <BotNavMobile />
        </section>
      </nav>
    </>
  );
};

export default Navbar;
