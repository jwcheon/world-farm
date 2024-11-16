"use client"; // Required for Next.js

import {
  ISuccessResult,
  MiniKit,
  VerificationLevel,
  VerifyCommandInput,
} from "@worldcoin/minikit-js";
import { ReactNode, useEffect } from "react";

const verifyPayload: VerifyCommandInput = {
  action: "voting-action", // This is your action ID from the Developer Portal
  signal: "0x12312", // Optional additional data
  verification_level: VerificationLevel.Orb, // Orb | Device
};

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install(process.env.NEXT_PUBLIC_APP_ID);
    console.log(MiniKit.isInstalled());
  }, []);

  const signInWithWallet = async () => {
    if (!MiniKit.isInstalled()) {
      return;
    }

    //const res = await fetch(`/api/nonce`)
    //const { nonce } = await res.json()

    const { commandPayload: generateMessageResult, finalPayload } =
      await MiniKit.commandsAsync.walletAuth({
        nonce: "1234512345",
        requestId: "0", // Optional
        expirationTime: new Date(
          new Date().getTime() + 7 * 24 * 60 * 60 * 1000
        ),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        statement:
          "This is my statement and here is a link https://worldcoin.com/apps",
      });

    console.log({ generateMessageResult, finalPayload });

    // if (finalPayload.status === 'error') {
    //   return
    // } else {
    //   const response = await fetch('/api/complete-siwe', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       payload: finalPayload,
    //       nonce,
    //     }),
    //   })
    // }
  };

  return (
    <div className="flex flex-col">
      <div className="text-red-400">{MiniKit.appId || "undef"}</div>
      <div className="text-red-400">
        {MiniKit.isInstalled().toString() || "undef"}
      </div>
      <div className="text-red-400">{MiniKit.walletAddress || "undef"}</div>
      <div className="text-red-400">
        {MiniKit.user?.walletAddress || "undef"}
      </div>
      <div onClick={() => signInWithWallet()}>wallet thing</div>
      <div className="text-red-400">{MiniKit.user?.username || "undef"}</div>
      {children}
    </div>
  );
}
