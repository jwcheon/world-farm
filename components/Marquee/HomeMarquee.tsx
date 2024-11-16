"use client";

import { Tractor } from "lucide-react";
import Marquee from "react-fast-marquee";

export const HomeMarquee = () => {
  return (
    <>
      <Marquee direction="left" className="bg-blue-300 text-black h-10">
        <Tractor className="mx-1" />
        <Tractor className="mx-1" />
        <p className="mx-1">
          Welcome to World Farm! Claim daily random gift, grow your stock, and
          farm rewards!
        </p>
        <Tractor className="mx-1" />
        <Tractor className="mx-1" />
        <p className="mx-1">
          Welcome to World Farm! Claim daily random gift, grow your stock, and
          farm rewards!
        </p>
      </Marquee>
    </>
  );
};
