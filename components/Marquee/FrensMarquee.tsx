"use client";

import {
  Activity,
  Coins,
  Ham,
  HandHeart,
  Handshake,
  Rabbit,
} from "lucide-react";
import { toast } from "sonner";
import Marquee from "react-fast-marquee";
import { useState } from "react";

export const FrensMarquee = ({ invites }: { invites: string | number }) => {
  const [clicked, setClicked] = useState(false);

  return (
    <>
      <Marquee direction="right" className="bg-blue-300 text-black h-10">
        <Coins className="mx-1" />
        <Rabbit className="mx-1" />
        <Ham className="mx-1" />
        <p className="mx-1">Keep inviting frens to unlock more rewards</p>

        <Coins className="mx-1" />
        <Rabbit className="mx-1" />
        <Ham className="mx-1" />
        <p className="mx-1">Keep inviting frens to unlock more rewards</p>
      </Marquee>
      <div
        onClick={() => {
          if (clicked) return;
          setClicked(true);
          toast("Where you frens at");
        }}
        className="py-8 text-4xl text-center font-semibold text-blue-300"
      >
        Frens
      </div>
      <div className="bg-black h-1" />
      <Marquee className="bg-blue-300 text-black h-10">
        <p className="mx-1">{`You have invited ${invites} frens`}</p>

        <Handshake className="mx-1" />
        <Activity className="mx-1" />
        <HandHeart className="mx-1" />
        <p className="mx-1">{`You have invited ${invites} frens`}</p>
        <Handshake className="mx-1" />
        <Activity className="mx-1" />
        <HandHeart className="mx-1" />
      </Marquee>
    </>
  );
};
