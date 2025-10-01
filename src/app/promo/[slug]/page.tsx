import Image from "next/image";
import { notFound } from "next/navigation";
import { carouselItems } from "@/components/homePage/mapData";
import Link from "next/link";
import { slugify } from "@/functions/slugToTitle";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return carouselItems.map((p) => ({ slug: slugify(p.title) }));
}

function getPromo(slug: string) {
  return carouselItems.find((p) => slugify(p.title) === slug);
}

export default async function PromoDetailPage({ params }: Props) {
  const { slug } = await params;
  const promo = getPromo(slug);
  if (!promo) notFound();

  return (
    <main className="scaledown80 mx-auto max-w-4xl px-4 py-8">
      {/* hero */}
      <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl md:h-80">
        <Image
          src={promo.image}
          alt={promo.alt}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* meta */}
      <h1 className="text-3xl font-bold text-gray-900">{promo.title}</h1>
      <p className="mt-3 text-gray-600">{promo.description}</p>
      <p className="mt-1 text-sm text-gray-500">Period: {promo.period}</p>

      {/* bullets */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800">Terms & Details</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700">
          {promo.details.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </div>

      {/* back button */}
      <Link
        href="/promo"
        className="mt-8 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        ← Back to all promos
      </Link>
    </main>
  );
}
