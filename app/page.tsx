"use client";

import { HomeMarquee } from "@/components/Marquee/HomeMarquee";
import { HomeMarqueeBottom } from "@/components/Marquee/HomeMarqueeBottom";
import { PayBlock } from "@/components/Pay";
import PixelPetSpace from "@/components/PixelPetSpace";
import { usePoints } from "@/hooks/usePoints";
import { toast } from "sonner";
import { useUsername } from "./api";
import { useContext } from "react";
import { WalletContext } from "@/components/minikit-provider";
import { useBunnies } from "@/hooks/useBunnies";

export default function Home() {
  const { points } = usePoints();
  const { walletAddress } = useContext(WalletContext);
  const { data: username } = useUsername(walletAddress);
  const { bunnies } = useBunnies();

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
              { type: "rabbit-normal", count: bunnies },
            ]}
            spaceSize={200}
          />
        </div>
        <AdditionalSpace />
      </div>

      <HomeMarqueeBottom />

      <div className="w-full text-white flex justify-center mt-10">
        {username && username.length ? `@${username[0].username}` : ""} Points:{" "}
        {points}
      </div>

      {/* <SignIn />
      <VerifyBlock /> */}

      <div className="mt-6 w-full flex flex-col justify-center items-center space-y-2">
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
