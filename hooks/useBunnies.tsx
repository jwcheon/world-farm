"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type IBunniesContext = {
  bunnies: number;
  increaseBunnyCount: (amount: number) => void;
};

const BunniesContext = createContext<IBunniesContext | undefined>(undefined);

export const useBunnies = (): IBunniesContext => {
  const context = useContext(BunniesContext);
  if (context === undefined) {
    throw new Error("useBunnies must be used within its provider");
  }
  return context;
};

export const BunniesProvider = ({
  children,
}: PropsWithChildren<{}>): JSX.Element => {
  const [bunnies, setBunnies] = useState<number>(1);

  const increaseBunnyCount = (amount: number) => {
    setBunnies((prevBunnies) => {
      const currentCount = typeof prevBunnies === "number" ? prevBunnies : 1;
      return currentCount + amount;
    });
  };

  const value: IBunniesContext = useMemo(
    () => ({
      bunnies,
      increaseBunnyCount,
    }),
    [bunnies]
  );

  // useEffect(() => {
  //   if (bunnies === "-") {
  //     const callApi = async () => {
  //       const response = await fetch("/api/bunnies", {
  //         method: "GET",
  //       });

  //       const result = await response.json();
  //       console.log("bunnies result:", result);

  //       setBunnies(result?.totalBunnies || 0);
  //     };
  //     callApi();
  //   }
  // }, [bunnies]);

  return (
    <BunniesContext.Provider value={value}>{children}</BunniesContext.Provider>
  );
};
