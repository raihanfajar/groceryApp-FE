import LeftNav from "@/components/discover/LeftNav";
import { ScrollArea } from "@/components/ui/scroll-area";

const AboutPage = () => {
  return (
    <main className="mx-auto min-h-[calc(100vh-100px)] md:px-16">
      <div className="scaledown flex flex-col gap-6 p-6 md:flex-row">
        {/* Left Navigation */}
        <aside className="h-fit w-full md:w-1/5">
          <LeftNav />
        </aside>

        {/* Main Content */}
        <section className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-150px)] rounded-md border-2 p-6 hover:border-green-500">
            <article className="space-y-10 text-justify leading-relaxed">
              {/* Intro */}
              <header>
                <h1 className="mb-4 text-3xl font-bold">About FreshNear</h1>
                <p>
                  FreshNear is a grocery app dedicated to making everyday
                  shopping easier, more affordable, and more reliable. Unlike
                  other platforms, FreshNear is subsidized by the government as
                  part of the{" "}
                  <span className="font-semibold">Good Governance System</span>{" "}
                  plan, focusing on strengthening the relationship between
                  citizens, the state, and corporations. Thanks to this
                  initiative, all grocery base prices are guaranteed to be{" "}
                  <span className="font-semibold">10% cheaper</span> than the
                  average market price.
                </p>
              </header>

              {/* Stores & Coverage */}
              <section>
                <h2 className="mb-3 text-2xl font-semibold">Our Stores</h2>
                <p>
                  FreshNear operates over{" "}
                  <span className="font-semibold">1,000+</span> self-owned
                  stores across Indonesia. We do not partner with third-party
                  supermarkets — every store is fully managed by FreshNear to
                  ensure consistent quality and pricing. Our services are
                  currently available exclusively in Indonesia.
                </p>
              </section>

              {/* Delivery */}
              <section>
                <h2 className="mb-3 text-2xl font-semibold">
                  Delivery Options
                </h2>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong>Same-day Delivery:</strong> Available if the
                    selected store is within 5 km of your delivery address.
                  </li>
                  <li>
                    <strong>Instant Delivery:</strong> Available if the selected
                    store is within 2 km of your delivery address.
                  </li>
                  <li>
                    <strong>Free Delivery:</strong> Unlock free delivery after
                    your first transaction by spending at least Rp100.000
                    (excluding discounts).
                  </li>
                  <li>
                    <strong>Scheduled Delivery:</strong> Plan your groceries at
                    your convenience.
                  </li>
                </ul>
              </section>

              {/* Features */}
              <section>
                <h2 className="mb-3 text-2xl font-semibold">
                  Why Choose FreshNear?
                </h2>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong>Government-subsidized prices:</strong> Always 10%
                    cheaper than the market.
                  </li>
                  <li>
                    <strong>Daily farm-fresh produce:</strong> All products are
                    sourced and delivered within 24 hours of harvest.
                  </li>
                  <li>
                    <strong>24/7 Customer Support:</strong> Help is always
                    available when you need it.
                  </li>
                  <li>
                    <strong>Exclusive Discounts:</strong> Save even more with
                    frequent promotions.
                  </li>
                </ul>
              </section>

              {/* Payment */}
              <section>
                <h2 className="mb-3 text-2xl font-semibold">Payment Methods</h2>
                <p>
                  FreshNear supports secure payments through{" "}
                  <span className="font-semibold">
                    e-wallets (via payment gateway)
                  </span>{" "}
                  and <span className="font-semibold">bank transfers</span>.
                </p>
              </section>

              {/* Closing */}
              <footer>
                <h2 className="mb-3 text-2xl font-semibold">
                  Start Shopping Today
                </h2>
                <p>
                  Handle your grocery shopping with us — fast, fresh, and
                  affordable. FreshNear makes every day easier, one basket at a
                  time!
                </p>
              </footer>
            </article>
          </ScrollArea>
        </section>
      </div>
    </main>
  );
};

export default AboutPage;
