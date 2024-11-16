"use client";

import { useUsername } from "@/app/api";
import { Tractor } from "lucide-react";
import { useContext } from "react";
import Marquee from "react-fast-marquee";
import { WalletContext } from "../minikit-provider";

export const HomeMarquee = () => {
  const { walletAddress } = useContext(WalletContext);
  const { data } = useUsername(walletAddress);

  console.log("data", data);

  return (
    <>
      <Marquee direction="right" className="bg-blue-300 text-black h-10">
        <Tractor className="mx-1" />
        <Tractor className="mx-1" />
        <p className="mx-1">
          Welcome to World Farm! {data?.length ? `@${data[0].username}` : ""}
        </p>
        <Tractor className="mx-1" />
        <Tractor className="mx-1" />
        <p className="mx-1">
          Welcome to World Farm! {data?.length ? `@${data[0].username}` : ""}
        </p>
      </Marquee>
    </>
  );
};
