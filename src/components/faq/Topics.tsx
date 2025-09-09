import { Card, CardContent } from "@/components/ui/card";
import * as FaIcons from "react-icons/fa"; // Import all FA icons
import { topics } from "./mapData";
import Link from "next/link";

export default function Topics() {
  return (
    <section className="mx-auto my-5 w-full max-w-5xl text-center">
      <h1 className="mb-6 text-2xl font-bold">Choose a topic to get started</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {topics.map((topic, index) => {
          const IconComponent = FaIcons[topic.icon];
          return (
            <Link key={index} href={`/faq/${topic.slug}`}>
              <Card className="cursor-pointer p-4 transition-shadow hover:shadow-lg">
                <CardContent className="flex flex-col items-center justify-center">
                  <IconComponent size={32} className="mb-2 text-green-700" />
                  <p className="text-sm font-medium">{topic.title}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
