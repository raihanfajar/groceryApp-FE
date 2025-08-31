import BotNavDesktop from "./HomePage/desktop/BotNav";
import TopNavDesktop from "./HomePage/desktop/TopNav";

const Navbar = () => {
  return (
    <nav className="sticky top-0 right-0 left-0 z-50 text-sm font-medium text-gray-600">
      {/* Desktop */}
      <section className="hidden flex-col justify-center shadow-md shadow-gray-500 lg:flex">
        <TopNavDesktop />
        <BotNavDesktop />
      </section>

      {/* Mobile */}
      <section></section>
    </nav>
  );
};

export default Navbar;
