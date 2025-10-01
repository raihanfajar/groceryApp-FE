import { ScrollArea } from "../ui/scroll-area";

/* ---------- English copy ---------- */
const en = {
  title: "Terms & Conditions",
  intro:
    "These Terms & Conditions (“Terms”) govern your access to and use of the FreshNear application and related services provided by PT Segar Dekat Indonesia (“FreshNear”, “we”, “us”, or “our”). By accessing, registering, or using the App, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must discontinue use immediately.",
  sections: [
    {
      heading: "1. General Provisions",
      type: "ol",
      list: [
        "FreshNear operates an online grocery service supported by self-owned stores across Indonesia.",
        "FreshNear may modify or update these Terms at any time. Changes take effect upon publication in the App or official channels.",
        "Supplemental terms may apply for specific features (e.g., promotions, seasonal programs). In case of conflict, the supplemental terms prevail for those features.",
        "Headings are for convenience only and do not affect interpretation.",
      ],
    },
    {
      heading: "2. Eligibility & Account Registration",
      type: "ol",
      list: [
        "Services are available to residents of the Republic of Indonesia. You must be 18+ or have consent from a parent/legal guardian.",
        "You agree to provide accurate, current, and complete information during registration and to keep it updated.",
        "You are responsible for maintaining the confidentiality of your login credentials and all activities occurring under your account.",
        "FreshNear may suspend or terminate accounts for suspected fraud, misuse, unlawful activity, or violation of these Terms.",
      ],
    },
    {
      heading: "3. Scope of Services",
      type: "ol",
      list: [
        "FreshNear enables ordering of groceries and related products from FreshNear-owned stores (no third-party marketplaces).",
        "We provide instant, same-day, and scheduled delivery subject to store coverage and operational capacity.",
        "Service availability varies by location, inventory, hours of operation, and applicable regulations.",
        "FreshNear may add, remove, or modify features without prior notice, provided no material deception is intended.",
      ],
    },
    {
      heading: "4. Pricing, Taxes & Government Subsidy",
      type: "ol",
      list: [
        "FreshNear participates in a Good Governance initiative whereby grocery base prices are targeted to be <strong>10% below</strong> average market prices.",
        "Displayed prices may already reflect subsidy and applicable taxes. Final checkout price is authoritative.",
        "Prices can differ across regions/stores due to local costs, logistics, or stock conditions, while maintaining the subsidy target where applicable.",
        "Promotional pricing, coupons, or limited-time offers may apply in addition to the subsidy and are subject to terms and availability.",
      ],
    },
    {
      heading: "5. Orders, Acceptance & Substitutions",
      type: "ol",
      list: [
        "Your order constitutes an offer to purchase. FreshNear accepts when we confirm payment and begin processing.",
        "All orders are subject to availability. We may offer suggested substitutions if an item is out of stock; you can accept or decline in-app.",
        "Product images are illustrative. Actual size, weight, packaging, or appearance may vary slightly.",
        "We may cancel or limit quantities for reasons including suspected fraud, pricing errors, or operational constraints.",
      ],
    },
    {
      heading: "6. Delivery Services",
      type: "ol",
      list: [
        "<strong>Coverage:</strong> Deliveries are available only within FreshNear service areas in Indonesia.",
        "<strong>Instant Delivery:</strong> Available when the selected store is within ≤2 km of the delivery address; typical ETA 60–90 minutes, subject to traffic/weather.",
        "<strong>Same-Day Delivery:</strong> Available when the selected store is within ≤5 km and orders meet cut-off times published in-app.",
        "<strong>Scheduled Delivery:</strong> Choose a time slot; we aim to deliver within the window but exact times are not guaranteed.",
        "<strong>Free Delivery:</strong> Eligible after your first completed transaction, with a minimum purchase of Rp100.000 (pre-discount). Terms may vary by campaign.",
        "You must ensure accurate address details and recipient availability. Failed deliveries due to incorrect addresses or absence may incur re-delivery fees.",
      ],
    },
    {
      heading: "7. Payment",
      type: "ol",
      list: [
        "Accepted methods: e-wallets via payment gateway and bank transfer (virtual account). COD and credit cards are not supported at this time.",
        "Orders are processed after successful payment authorization/settlement.",
        "We do not store full payment credentials. Third-party payment providers’ terms apply.",
        "Chargebacks or payment disputes may result in account review and temporary restrictions.",
      ],
    },
    {
      heading: "8. Returns, Replacements & Refunds",
      type: "ol",
      list: [
        "If items arrive damaged, expired, incorrect, or of unacceptable quality, notify us within 24 hours via in-app support.",
        "Provide order number, photos, and a brief description. Upon verification, we may offer replacement, partial refund, or full refund.",
        "Refunds are issued to the original payment method within an estimated 7–14 business days (provider-dependent).",
        "Perishables may be ineligible for return if reported beyond reasonable freshness windows or mishandled post-delivery.",
      ],
    },
    {
      heading: "9. Promotions, Coupons & Fair Use",
      type: "ol",
      list: [
        "Promotions are time-limited, subject to availability, and may include product/category/location restrictions.",
        "FreshNear may revoke benefits in cases of suspected abuse (e.g., duplicate accounts, referral fraud, automated redemption).",
        "Unless stated, promotions cannot be combined and are non-transferable, non-exchangeable, and not redeemable for cash.",
      ],
    },
    {
      heading: "10. Product Quality & Freshness",
      type: "ol",
      list: [
        "Fresh produce is sourced daily and targeted for delivery within 24 hours of harvest where operationally feasible.",
        "Weight-based items may have minor variances; pricing adjustments (if any) follow the measured weight at fulfillment.",
        "Storage and handling after delivery are the customer’s responsibility.",
      ],
    },
    {
      heading: "11. User Conduct",
      type: "ol",
      list: [
        "Do not engage in unlawful, fraudulent, harassing, or disruptive activities on the App.",
        "Do not attempt to interfere with or gain unauthorized access to systems, data, or accounts.",
        "Do not upload harmful code, spam, or content that infringes third-party rights.",
      ],
    },
    {
      heading: "12. Intellectual Property",
      type: "ol",
      list: [
        "All trademarks, logos, service marks, text, graphics, and software in the App are owned by FreshNear or its licensors.",
        "Reproduction, modification, or distribution without written permission is prohibited.",
      ],
    },
    {
      heading: "13. Privacy & Data Protection",
      type: "ol",
      list: [
        "FreshNear collects and processes personal data to operate, fulfill orders, provide support, and improve services.",
        "We follow applicable Indonesian data protection requirements. See our Privacy Policy for details on data categories, purposes, retention, and rights.",
        "We do not sell personal data to unaffiliated third parties.",
      ],
    },
    {
      heading: "14. Service Availability & Limitation of Liability",
      type: "ol",
      list: [
        "The App may be subject to maintenance, updates, or outages.",
        "To the maximum extent permitted by law, FreshNear is not liable for indirect, incidental, special, punitive, or consequential damages.",
        "FreshNear’s aggregate liability related to any order is limited to the amount paid for that order.",
      ],
    },
    {
      heading: "15. Force Majeure",
      text: "FreshNear is not responsible for delays or failures caused by events beyond our reasonable control, including natural disasters, epidemics, government actions, strikes, war, civil unrest, or disruptions in transportation or telecommunications.",
    },
    {
      heading: "16. Governing Law & Dispute Resolution",
      type: "ol",
      list: [
        "These Terms are governed by the laws of the Republic of Indonesia.",
        "Disputes should first be resolved amicably through customer support.",
        "If unresolved, disputes may be referred to arbitration in Indonesia in accordance with prevailing rules (e.g., BANI).",
      ],
    },
    {
      heading: "17. Contact Information",
      type: "ul",
      list: [
        "Email: <span class='font-medium'>support@freshnear.id</span>",
        "Phone: <span class='font-medium'>0800-123-4567</span>",
        "In-App Chat: Available 24/7",
      ],
    },
  ],
  effective: "Effective Date: 3 September 2025",
};

/* ---------- Indonesian copy ---------- */
const id = {
  title: "Syarat & Ketentuan",
  intro:
    "Syarat & Ketentuan ini mengatur akses dan penggunaan aplikasi FreshNear serta layanan terkait yang disediakan oleh PT Segar Dekat Indonesia (“FreshNear”, “kami”). Dengan mengakses, mendaftar, atau menggunakan aplikasi, Anda menyetujui Syarat ini dan Kebijakan Privasi kami. Jika tidak setuju, harap berhenti menggunakan layanan.",
  sections: [
    {
      heading: "1. Ketentuan Umum",
      type: "ol",
      list: [
        "FreshNear menyelenggarakan layanan grocery online yang didukung oleh toko milik sendiri di seluruh Indonesia.",
        "FreshNear dapat mengubah Syarat ini sewaktu-waktu. Perubahan berlaku sejak dipublikasikan di aplikasi atau kanal resmi.",
        "Ketentuan tambahan dapat berlaku untuk fitur tertentu (mis. promosi, program musiman). Jika bertentangan, ketentuan tambahan yang berlaku.",
        "Judul bagian hanya untuk kemudahan membaca dan tidak mempengaruhi interpretasi.",
      ],
    },
    {
      heading: "2. Eligibilitas & Pendaftaran Akun",
      type: "ol",
      list: [
        "Layanan tersedia bagi warga negara Indonesia. Anda harus berusia 18+ atau memiliki izin orang tua/wali.",
        "Anda wajib memberikan informasi yang akurat, terkini, dan lengkap saat pendaftaran serta memperbaruinya.",
        "Anda bertanggung jawab atas kerahasiaan kredensial login dan seluruh aktivitas di akun Anda.",
        "FreshNear dapat menangguhkan atau menutup akun bila terindikasi penipuan, penyalahgunaan, pelanggaran hukum, atau pelanggaran Syarat ini.",
      ],
    },
    {
      heading: "3. Ruang Lingkup Layanan",
      type: "ol",
      list: [
        "FreshNear memungkinkan pemesanan bahan makanan dan produk terkait dari toko milik sendiri (tanpa marketplace pihak ketiga).",
        "Kami menyediakan pengiriman instan, hari yang sama, dan terjadwal sesuai cakupan toko serta kapasitas operasional.",
        "Ketersediaan layanan bervariasi berdasarkan lokasi, persediaan, jam operasional, dan regulasi yang berlaku.",
        "FreshNear dapat menambah, menghapus, atau mengubah fitur tanpa pemberitahuan sebelumnya, selama tidak menyesatkan.",
      ],
    },
    {
      heading: "4. Harga, Pajak & Subsidi Pemerintah",
      type: "ol",
      list: [
        "FreshNear berpartisipasi dalam inisiatif Good Governance dengan target harga dasar 10% di bawah harga pasar rata-rata.",
        "Harga yang ditampilkan dapat sudah termasuk subsidi dan pajak. Harga final di halaman checkout yang berlaku.",
        "Harga dapat berbeda antar wilayah/toko karena biaya lokal, logistik, atau ketersediaan stok, tetap mempertahankan target subsidi.",
        "Harga promosi, kupon, atau penawaran terbatas dapat berlaku tambahan dan tunduk pada syarat serta ketersediaan.",
      ],
    },
    {
      heading: "5. Pemesanan, Penerimaan & Penggantian",
      type: "ol",
      list: [
        "Pemesanan Anda merupakan penawaran pembelian. FreshNear menerima setelah pembayaran dikonfirmasi dan diproses.",
        "Semua pesanan tergantung ketersediaan. Kami dapat menawarkan pengganti jika barang habis; Anda dapat menerima atau menolak di aplikasi.",
        "Gambar produk ilustratif. Ukuran, berat, kemasan, atau penampakan aktual dapat sedikit berbeda.",
        "Kami dapat membatalkan atau membatasi jumlah karena dugaan penipuan, kesalahan harga, atau kendala operasional.",
      ],
    },
    {
      heading: "6. Layanan Pengiriman",
      type: "ol",
      list: [
        "<strong>Cakupan:</strong> pengiriman hanya tersedia di area layanan FreshNear di Indonesia.",
        "<strong>Pengiriman Instan:</strong> tersedia bila toko terpilih ≤2 km dari alamat; ETA 60–90 menit, tergantung lalu lintas/cuaca.",
        "<strong>Pengiriman Hari yang Sama:</strong> tersedia bila toko ≤5 km dan pesanan memenuhi batas waktu yang tertera di aplikasi.",
        "<strong>Pengiriman Terjadwal:</strong> pilih jangka waktu; kami berupaya tepat waktu namun tidak dijamin.",
        "<strong>Gratis Ongkir:</strong> berlaku setelah transaksi pertama, dengan pembelian minimal Rp100.000 (pre-diskon). Syarat dapat berubah.",
        "Pastikan alamat akurat dan penerima tersedia. Kegagalan karena alamat salah atau tidak ada penerima dapat dikenai biaya kirim ulang.",
      ],
    },
    {
      heading: "7. Pembayaran",
      type: "ol",
      list: [
        "Metode yang diterima: e-wallet melalui gateway pembayaran dan transfer bank (virtual account). COD dan kartu kredit belum tersedia.",
        "Pesanan diproses setelah pembayaran berhasil.",
        "Kami tidak menyimpan kredensial pembayaran penuh. Syarat penyedia pembayaran berlaku.",
        "Chargeback atau sengketa pembayaran dapat menimbulkan peninjauan akun dan pembatasan sementara.",
      ],
    },
    {
      heading: "8. Pengembalian, Penggantian & Refund",
      type: "ol",
      list: [
        "Jika barang rusak, kedaluwarsa, salah, atau kualitas tidak dapat diterima, laporkan dalam 24 jam melalui dukungan di aplikasi.",
        "Sertakan nomor pesanan, foto, dan keterangan singkat. Setelah terverifikasi, kami dapat mengganti, mengembalikan sebagian, atau sepenuhnya.",
        "Refund dikirim ke metode pembayaran semula dalam perkiraan 7–14 hari kerja (tergantung penyedia).",
        "Produk mudah rusak dapat tidak dapat dikembalikan jika dilaporkan melewati jendela kesegaran yang wajar atau kelalaian penanganan setelah pengiriman.",
      ],
    },
    {
      heading: "9. Promosi, Kupon & Penggunaan Wajar",
      type: "ol",
      list: [
        "Promosi terbatas waktu, tergantung ketersediaan, dan dapat mencakup pembatasan produk/kategori/lokasi.",
        "FreshNear dapat mencabut manfaat bila terindikasi penyalahgunaan (mis. akun ganda, penipuan referral, redeem otomatis).",
        "Kecuali disebutkan, promosi tidak dapat digabung, tidak dapat dialihkan, tidak dapat ditukar uang.",
      ],
    },
    {
      heading: "10. Kualitas & Kesegaran Produk",
      type: "ol",
      list: [
        "Produce segar diperoleh harian dan ditargetkan dikirim dalam 24 jam pasca panen bila operasional memungkinkan.",
        "Barang berbasis berat dapat memiliki variansi kecil; penyesuaian harga (jika ada) mengikuti berat aktual saat pemenuhan.",
        "Penyimpanan dan penanganan pasca pengiriman menjadi tanggung jawab pelanggan.",
      ],
    },
    {
      heading: "11. Perilaku Pengguna",
      type: "ol",
      list: [
        "Dilarang melakukan aktivitas ilegal, penipuan, pelecehan, atau mengganggu di aplikasi.",
        "Dilarang mengganggu atau mengakses sistem, data, atau akun tanpa izin.",
        "Dilarang mengunggah kode berbahaya, spam, atau konten yang melanggar hak pihak ketiga.",
      ],
    },
    {
      heading: "12. Kekayaan Intelektual",
      type: "ol",
      list: [
        "Seluruh merek dagang, logo, tanda layanan, teks, grafik, dan perangkat lunak di aplikasi dimiliki FreshNear atau pemberi lisensinya.",
        "Reproduksi, modifikasi, atau distribusi tanpa izin tertulis dilarang.",
      ],
    },
    {
      heading: "13. Privasi & Perlindungan Data",
      type: "ol",
      list: [
        "FreshNear mengumpulkan dan memproses data pribadi untuk menjalankan, memenuhi pesanan, memberikan dukungan, dan meningkatkan layanan.",
        "Kami mematuhi regulasi perlindungan data Indonesia yang berlaku. Lihat Kebijakan Privasi untuk detail kategori, tujuan, retensi, dan hak.",
        "Kami tidak menjual data pribadi kepada pihak ketiga yang tidak terafiliasi.",
      ],
    },
    {
      heading: "14. Ketersediaan Layanan & Batasan Tanggung Jawab",
      type: "ol",
      list: [
        "Aplikasi dapat mengalami pemeliharaan, pembaruan, atau gangguan.",
        "Sejauh diizinkan hukum, FreshNear tidak bertanggung jawab atas kerusakan tidak langsung, insidental, khusus, atau konsekuensial.",
        "Tanggung jawab agregat FreshNear terkait pesanan apa pun terbatas pada jumlah yang Anda bayar untuk pesanan tersebut.",
      ],
    },
    {
      heading: "15. Force Majeure",
      text: "FreshNear tidak bertanggung jawab atas keterlambatan atau kegagalan karena peristiwa di luar kendali kami, termasuk bencana alam, epidemi, tindakan pemerintah, pemogokan, perang, kerusuhan, atau gangguan transportasi/telekomunikasi.",
    },
    {
      heading: "16. Hukum yang Berlaku & Penyelesaian Sengketa",
      type: "ol",
      list: [
        "Syarat ini tunduk pada hukum Republik Indonesia.",
        "Sengketa harus diselesaikan secara musyawarah melalui layanan pelanggan.",
        "Jika tidak terselesaikan, sengketa dapat dirujuk ke arbitrase di Indonesia sesuai aturan yang berlaku (mis. BANI).",
      ],
    },
    {
      heading: "17. Informasi Kontak",
      type: "ul",
      list: [
        "Email: <span class='font-medium'>support@freshnear.id</span>",
        "Telepon: <span class='font-medium'>0800-123-4567</span>",
        "Chat di Aplikasi: tersedia 24 jam",
      ],
    },
  ],
  effective: "Tanggal Efektif: 3 September 2025",
};

/* ---------- Re-usable renderer ---------- */
type Section = (typeof en.sections)[number];

const SectionBlock = ({ s }: { s: Section }) => (
  <section className="mb-6">
    <h2 className="mb-2 text-lg font-semibold text-gray-900">{s.heading}</h2>
    {s.text && (
      <p
        className="text-sm leading-relaxed text-gray-700"
        dangerouslySetInnerHTML={{ __html: s.text }}
      />
    )}
    {s.type === "ul" && (
      <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-700">
        {s.list.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    )}
    {s.type === "ol" && (
      <ol className="list-decimal space-y-1 pl-5 text-sm leading-relaxed text-gray-700">
        {s.list.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ol>
    )}
  </section>
);

/* ---------- Main component ---------- */
const TermsScrollArea = () => (
  <ScrollArea className="h-[calc(100vh-165px)] rounded-b-md border bg-white">
    <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6">
      {/* English */}
      <article className="mb-10">
        <header className="mb-5 border-b pb-3">
          <h1 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            {en.title}
          </h1>
          <p
            className="mt-2 text-xs leading-normal text-gray-600 sm:text-sm"
            dangerouslySetInnerHTML={{ __html: en.intro }}
          />
        </header>
        {en.sections.map((s, i) => (
          <SectionBlock s={s} key={`en-${i}`} />
        ))}
        <footer className="mt-4 border-t pt-3 text-xs text-gray-500">
          {en.effective}
        </footer>
      </article>

      {/* Divider */}
      <div className="mb-8 h-px bg-gray-200" />

      {/* Indonesian */}
      <article>
        <header className="mb-5 border-b pb-3">
          <h1 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            {id.title}
          </h1>
          <p
            className="mt-2 text-xs leading-normal text-gray-600 sm:text-sm"
            dangerouslySetInnerHTML={{ __html: id.intro }}
          />
        </header>
        {id.sections.map((s, i) => (
          <SectionBlock s={s} key={`id-${i}`} />
        ))}
        <footer className="mt-4 border-t pt-3 text-xs text-gray-500">
          {id.effective}
        </footer>
      </article>
    </div>
  </ScrollArea>
);

export default TermsScrollArea;
