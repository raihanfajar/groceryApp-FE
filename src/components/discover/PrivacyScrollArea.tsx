import React from "react";
import { ScrollArea } from "../ui/scroll-area";

/* ---------- English copy ---------- */
const en = {
  title: "Privacy Policy",
  intro:
    "This Privacy Policy (“Policy”) explains how PT Segar Dekat Indonesia (“FreshNear”, “we”, “us”, or “our”) collects, uses, discloses, and protects your information when you use the FreshNear mobile application and related services. By accessing or using FreshNear, you consent to the practices described in this Policy.",
  sections: [
    {
      heading: "1. Information We Collect",
      type: "ul",
      list: [
        "<strong>Account Information:</strong> Name, phone number, email address, password, and profile details.",
        "<strong>Order & Transaction Data:</strong> Purchase history, delivery address, payment method (via payment gateway).",
        "<strong>Location Data:</strong> GPS or approximate location for delivery, store matching, and service availability.",
        "<strong>Device & Usage Data:</strong> IP address, device type, OS, app version, in-app activity.",
        "<strong>Customer Support:</strong> Records of communications, inquiries, or complaints.",
      ],
    },
    {
      heading: "2. How We Use Your Information",
      type: "ul",
      list: [
        "Process and deliver your orders.",
        "Provide instant, same-day, or scheduled delivery.",
        "Verify payments and prevent fraud.",
        "Personalise promotions and recommendations.",
        "Communicate updates, support, service notifications.",
        "Comply with laws, regulations, subsidy programs.",
      ],
    },
    {
      heading: "3. Sharing of Information",
      type: "ol",
      list: [
        "<strong>Service Providers:</strong> logistics, payment gateways, IT partners.",
        "<strong>Legal Compliance:</strong> court orders, regulations, government requests.",
        "<strong>Corporate Transactions:</strong> mergers, acquisitions (under confidentiality).",
        "We never sell or rent your data for marketing.",
      ],
    },
    {
      heading: "4. Data Retention",
      text: "We keep data only as long as necessary to provide services, meet legal obligations, resolve disputes, and enforce agreements. After that it is securely deleted or anonymised.",
    },
    {
      heading: "5. Data Security",
      text: "FreshNear uses encryption, secure servers, and access controls to protect your information. No internet transmission is 100 % secure, but we strive to safeguard your data.",
    },
    {
      heading: "6. Your Rights",
      type: "ul",
      list: [
        "<strong>Access & Correction:</strong> update data in-app.",
        "<strong>Deletion:</strong> request account erasure (subject to legal retention).",
        "<strong>Consent Withdrawal:</strong> you may withdraw consent, limiting some services.",
        "<strong>Marketing Opt-out:</strong> disable promos anytime.",
      ],
    },
    {
      heading: "7. Children’s Privacy",
      text: "FreshNear does not knowingly collect data from under-18s without parental consent. If we discover such data we will delete it promptly.",
    },
    {
      heading: "8. Cookies & Tracking Technologies",
      text: "We may use cookies or similar tech to improve performance, remember preferences, and analyse usage. You can disable them in device settings, but some features may not work properly.",
    },
    {
      heading: "9. International Data Transfers",
      text: "Although we operate primarily in Indonesia, some providers may process data abroad. We ensure adequate safeguards are in place.",
    },
    {
      heading: "10. Changes to This Policy",
      text: "We may update this Policy anytime. Changes appear in-app with a new “Effective Date”. Continued use after updates means you accept the revised Policy.",
    },
    {
      heading: "11. Contact Us",
      type: "ul",
      list: [
        "Email: <span class='font-medium'>privacy@freshnear.id</span>",
        "Phone: <span class='font-medium'>0800-123-4567</span>",
        "In-App Chat: available 24/7",
      ],
    },
  ],
  effective: "Effective Date: 3 September 2025",
};

/* ---------- Indonesian copy ---------- */
const id = {
  title: "Kebijakan Privasi",
  intro:
    "Kebijakan Privasi ini menjelaskan bagaimana PT Segar Dekat Indonesia (“FreshNear”, “kami”) mengumpulkan, menggunakan, mengungkapkan, dan melindungi informasi Anda saat menggunakan aplikasi mobile FreshNear dan layanan terkait. Dengan mengakses atau menggunakan FreshNear, Anda menyetujui praktik yang dijelaskan di sini.",
  sections: [
    {
      heading: "1. Informasi yang Kami Kumpulkan",
      type: "ul",
      list: [
        "<strong>Informasi Akun:</strong> nama, nomor telepon, email, kata sandi, dan detail profil.",
        "<strong>Data Pesanan & Transaksi:</strong> riwayat pembelian, alamat pengiriman, metode pembayaran.",
        "<strong>Data Lokasi:</strong> lokasi GPS atau perkiraan untuk pengiriman dan ketersediaan layanan.",
        "<strong>Data Perangkat & Penggunaan:</strong> IP address, tipe perangkat, OS, versi aplikasi, aktivitas di aplikasi.",
        "<strong>Layanan Pelanggan:</strong> catatan komunikasi, pertanyaan, atau keluhan.",
      ],
    },
    {
      heading: "2. Cara Kami Menggunakan Informasi",
      type: "ul",
      list: [
        "Memproses dan mengantarkan pesanan Anda.",
        "Menyediakan pengiriman instan, hari yang sama, atau terjadwal.",
        "Memverifikasi pembayaran dan mencegah penipuan.",
        "Memberikan rekomendasi dan promosi personal.",
        "Memberi tahu pembaruan akun, dukungan, dan notifikasi layanan.",
        "Mematuhi hukum, regulasi, dan program subsidi.",
      ],
    },
    {
      heading: "3. Pembagian Informasi",
      type: "ol",
      list: [
        "<strong>Penyedia Layanan:</strong> mitra logistik, gateway pembayaran, penyedia IT.",
        "<strong>Kepatuhan Hukum:</strong> perintah pengadilan, regulasi, permintaan pemerintah.",
        "<strong>Transaksi Korporasi:</strong> penggabungan, akuisisi (dengan kerahasiaan).",
        "Kami tidak pernah menjual atau menyewakan data Anda untuk pemasaran.",
      ],
    },
    {
      heading: "4. Retensi Data",
      text: "Kami menyimpan data hanya selama diperlukan untuk layanan, memenuhi kewajiban hukum, menyelesaikan sengketa, dan menegakkan perjanjian. Setelahnya data dihapus atau dianonimkan secara aman.",
    },
    {
      heading: "5. Keamanan Data",
      text: "FreshNear menggunakan enkripsi, server aman, dan kontrol akses untuk melindungi informasi Anda. Tidak ada transmisi internet yang 100 % aman, namun kami berupaya semaksimal mungkin.",
    },
    {
      heading: "6. Hak Anda",
      type: "ul",
      list: [
        "<strong>Akses & Koreksi:</strong> perbarui data di aplikasi.",
        "<strong>Penghapusan:</strong> minta penghapusan akun (terikat retensi hukum).",
        "<strong>Pencabutan Persetujuan:</strong> Anda dapat mencabut persetujuan, namun dapat membatasi layanan.",
        "<strong>Opt-out Pemasaran:</strong> berhenti dari promosi kapan saja.",
      ],
    },
    {
      heading: "7. Privasi Anak-anak",
      text: "FreshNear tidak sengaja mengumpulkan data dari anak di bawah 18 tahun tanpa izin orang tua. Jika ditemukan, data akan segera dihapus.",
    },
    {
      heading: "8. Cookie & Teknologi Pelacakan",
      text: "Kami dapat menggunakan cookie atau teknologi serupa untuk meningkatkan performa, mengingat preferensi, dan menganalisis penggunaan. Anda dapat menonaktifkannya di pengaturan perangkat, namun beberapa fitur mungkin tidak berfungsi optimal.",
    },
    {
      heading: "9. Transfer Data Internasional",
      text: "Meskipun kami beroperasi utama di Indonesia, beberapa penyedia teknis dapat memproses data di luar negeri. Kami memastikan perlindungan yang memadai.",
    },
    {
      heading: "10. Perubahan Kebijakan",
      text: "Kami dapat memperbarui Kebijakan ini sewaktu-waktu. Perubahan akan tampil di aplikasi dengan “Tanggal Efektif” baru. Penggunaan berkelanjutan setelah pembaruan berarti Anda menerima Kebijakan yang direvisi.",
    },
    {
      heading: "11. Hubungi Kami",
      type: "ul",
      list: [
        "Email: <span class='font-medium'>privacy@freshnear.id</span>",
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
const PrivacyScrollArea = () => (
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

export default PrivacyScrollArea;
