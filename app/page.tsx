"use client";

import { HomeMarquee } from "@/components/Marquee/HomeMarquee";
import { HomeMarqueeBottom } from "@/components/Marquee/HomeMarqueeBottom";
import { PayBlock } from "@/components/Pay";
import PixelPetSpace from "@/components/PixelPetSpace";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
// import { PayBlock } from "@/components/Pay";
// import { SignIn } from "@/components/SignIn";
// import { VerifyBlock } from "@/components/Verify";

export default function Home() {
  // const containerRef = useRef<HTMLDivElement>(null);
  // const [containerWidth, setContainerWidth] = useState<number>(0);

  // useEffect(() => {
  //   if (containerRef.current) {
  //     setContainerWidth(containerRef.current.offsetWidth);
  //   }
  // }, []);

  // console.log("containerWidth", containerWidth);

  return (
    <main className="w-full min-h-screen select-none bg-black">
      <HomeMarquee />

      {/* Pet Space Container */}
      <div className="w-full h-[200px] bg-blue-200 flex justify-center items-start">
        <AdditionalSpace />
        <div className="h-[200px] w-[200px] flex justify-center items-center">
          <PixelPetSpace
            petConfigs={[
              { type: "piggy-move", count: 1 },
              { type: "rabbit-normal", count: 1 },
            ]}
            spaceSize={200}
          />
        </div>
        <AdditionalSpace />
      </div>

      <HomeMarqueeBottom />

      {/* <SignIn />
      <VerifyBlock /> */}

      <div className="mt-10 w-full flex flex-col justify-center items-center space-y-2">
        <p className="text-white text-xs">Want to add more to your farm?</p>
        <PayBlock />
      </div>
    </main>
  );
}

const AdditionalSpace = () => {
  return (
    <div
      onClick={() => toast("Land purchase coming soon!")}
      className="w-full h-full flex flex-col justify-center items-center text-green-400 font-extrabold text-4xl"
    >
      <div className="text-xs text-black font-normal">Expand land?</div>+
    </div>
  );
};
