import CustomBorder from "./HomePage/CustomBorder";

export default function Footer() {
  return (
    <>
      <CustomBorder />
      <footer className="w-full bg-green-800 px-6 py-10 text-white md:px-20">
        <div
          id="mainWrapper"
          className="grid gap-10 text-sm md:grid-cols-5 md:text-base"
        >
          {/* Customer Support */}
          <div id="customerSupport">
            <h2 className="mb-3 text-lg font-semibold">Customer Support</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  How to Shop
                </a>
              </li>
            </ul>
          </div>

          {/* Discover FreshNear */}
          <div id="discoverFreshNear">
            <h2 className="mb-3 text-lg font-semibold">Discover FreshNear</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  About FreshNear
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Payment & Delivery */}
          <div className="space-y-6">
            <div id="paymentMethod">
              <h2 className="mb-3 text-lg font-semibold">Payment Method</h2>
              <div className="flex flex-wrap gap-3">
                <div className="h-8 w-8 rounded bg-gray-300"></div>
                <div className="h-8 w-8 rounded bg-gray-300"></div>
                <div className="h-8 w-8 rounded bg-gray-300"></div>
                <div className="h-8 w-8 rounded bg-gray-300"></div>
              </div>
            </div>

            <div id="deliveryService">
              <h2 className="mb-3 text-lg font-semibold">Delivery Service</h2>
              <div className="flex flex-wrap gap-3">
                <div className="h-8 w-8 rounded bg-gray-300"></div>
                <div className="h-8 w-8 rounded bg-gray-300"></div>
              </div>
            </div>
          </div>

          {/* Social & Contact */}
          <div className="space-y-6">
            <div id="followUs">
              <h2 className="mb-3 text-lg font-semibold">Follow Us</h2>
              <div className="flex flex-wrap gap-3">
                <div className="h-8 w-8 rounded bg-gray-300"></div>
                <div className="h-8 w-8 rounded bg-gray-300"></div>
                <div className="h-8 w-8 rounded bg-gray-300"></div>
              </div>
            </div>

            <div id="contactUs" className="space-y-1 text-sm">
              <h2 className="mb-3 text-lg font-semibold">Contact Us</h2>
              <p>fnsupport@gmail.com</p>
              <p>666-666-666</p>
            </div>
          </div>

          {/* Complaints */}
          <div id="complaints" className="space-y-3 text-xs">
            <h2 className="mb-3 text-lg font-semibold">
              Customer Complaints Service
            </h2>
            <div>
              <p className="font-semibold">PT Segar Dekat Indonesia</p>
              <p>Email: fnsupport@gmail.com</p>
              <p>Call Center: 666-666-666</p>
            </div>
            <div>
              <p>
                Direktorat Jenderal Perlindungan Konsumen dan Tata Tertib Niaga
                Kementerian Perdagangan Republik Indonesia
              </p>
              <p>Whatsapp Ditjen PTKN: 0853-1111-1010</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-green-700 pt-4 text-center text-xs text-gray-300">
          © {new Date().getFullYear()} FreshNear. All rights reserved.
        </div>
      </footer>
    </>
  );
}
