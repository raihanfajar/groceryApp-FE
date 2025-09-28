import Image from "next/image";
import { benefitBannerBenefits } from "../mapData";

export default function BenefitBanner() {
  return (
    <div className="scaledown mx-auto flex flex-col items-center justify-center gap-10 bg-[#020c45] py-10 text-white">
      <h1 className="text-center text-2xl">
        Why should you handle your grocery shopping with us?
      </h1>
      <div className="flex flex-wrap justify-center gap-5 py-5">
        {benefitBannerBenefits.map((benefit) => (
          <div key={benefit.id} className="mx-5 flex flex-col items-center">
            <Image
              src={benefit.image}
              alt="image here"
              width={100}
              height={100}
            />
            <p className="mt-4 text-lg text-orange-300">{benefit.title}</p>
            <p className="mt-2 max-w-sm text-center">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
