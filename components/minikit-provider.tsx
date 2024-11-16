"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect } from "react";
import { useNonceQuery } from "@/app/api";

const WalletContext = createContext<{ walletAddress: string | null }>({
  walletAddress: null,
});

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  const { data: nonce, error } = useNonceQuery();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  console.log("nonce", nonce);

  const signInWithWallet = useCallback(async () => {
    console.log("signInWithWallet...");
    if (!MiniKit.isInstalled()) {
      console.log("Kit not installed");
      return;
    }
    if (!nonce) {
      console.log("No nonce");
      return;
    }

    // const res = await fetch("/api/wallet/nonce");
    // const { nonce } = await res.json();

    console.log({ nonce });

    const { commandPayload: generateMessageResult, finalPayload } =
      await MiniKit.commandsAsync.walletAuth({
        nonce: nonce.nonce,
        requestId: "0", // Optional
        expirationTime: new Date(
          new Date().getTime() + 7 * 24 * 60 * 60 * 1000
        ),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        statement:
          "This is my statement and here is a link https://worldcoin.com/apps",
      });

    console.log({ generateMessageResult, finalPayload });

    if (finalPayload.status === "error") {
      return;
    } else {
      const response = await fetch("/api/wallet/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: finalPayload,
          nonce: nonce.nonce,
        }),
      });
      console.log(await response.json());

      // last check
      setWalletAddress(MiniKit.walletAddress);
    }
  }, [nonce]);

  useEffect(() => {
    MiniKit.install(process.env.NEXT_PUBLIC_APP_ID);

    const initiateSignIn = async () => {
      console.log("initiateSignIn...");
      if (MiniKit.isInstalled() && !MiniKit.walletAddress) {
        await signInWithWallet();
      }
    };

    initiateSignIn();
  }, [signInWithWallet]);

  return (
    <WalletContext.Provider value={{ walletAddress }}>
      <div className="flex flex-col">
        <div>{walletAddress}</div>
        <div onClick={signInWithWallet}>sign wallet</div>
        {children}
      </div>
    </WalletContext.Provider>
  );
}
