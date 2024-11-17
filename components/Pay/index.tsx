"use client";

import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
} from "@worldcoin/minikit-js";
import { useEffect, useRef, useState } from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import { toast } from "sonner";
import { ScratchCardFlip } from "../Scratch/ScratchCardFlip";

export const PayBlock = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [nonce, setNonce] = useState("");

  const sendPayment = async () => {
    try {
      const res = await fetch(`/api/initiate-payment`, {
        method: "POST",
      });

      const { id } = await res.json();

      console.log(id);
      setNonce(id);

      const payload: PayCommandInput = {
        reference: id,
        to: "0x68a4591fdf41652716b08056cdcd869dfdbd7c80", // receiver address
        tokens: [
          {
            symbol: Tokens.WLD,
            token_amount: tokenToDecimals(0.1, Tokens.WLD).toString(),
          },
        ],
        description: "Grow your farm, watch it prosper!",
      };
      if (MiniKit.isInstalled()) {
        return await MiniKit.commandsAsync.pay(payload);
      }
      return null;
    } catch (error: unknown) {
      console.log("Error sending payment", error);
      toast("Something went wrong :(");
      setNonce("");
      return null;
    }
  };

  const handlePay = async () => {
    if (loading) return;

    if (!MiniKit.isInstalled()) {
      console.error("MiniKit is not installed");
      return;
    }

    setNonce("");
    setLoading(true);

    const sendPaymentResponse = await sendPayment();
    const response = sendPaymentResponse?.finalPayload;
    if (!response) {
      setLoading(false);
      return;
    }

    if (response.status == "success") {
      const res = await fetch(`/api/confirm-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: response }),
      });
      const payment = await res.json();
      if (payment.success) {
        // Congrats your payment was successful!
        console.log("SUCCESS!");
        setSuccess(true);
        toast("Payment success!");
      } else {
        // Payment failed
        console.log("FAILED!");
        toast("Payment failed... try again.");
      }
    }

    setLoading(false);
  };

  const handleCard = async () => {
    toast("Claiming...");

    const res = await fetch(`/api/confirm-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: nonce }),
    });
    const card = await res.json();
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      {!success ? (
        <button
          className="bg-blue-500 max-w-[200px] min-h-[40px] font-medium p-4 rounded-2xl flex justify-center items-center"
          onClick={handlePay}
        >
          {!loading ? "Add more stock!" : <LoadingSpinner />}
        </button>
      ) : (
        <>
          <button
            className="bg-blue-500 max-w-[200px] min-h-[40px] font-medium p-4 rounded-2xl flex justify-center items-center"
            onClick={handleCard}
          >
            {!loading ? "Claim" : <LoadingSpinner />}
          </button>

          <div className="mt-10" />
          <ScratchCardFlip />
        </>
      )}
      <div className="mt-10" />
      <ScratchCardFlip />
    </div>
  );
};
