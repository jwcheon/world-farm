"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type IPointsContext = {
  points: number | string;
};

const PointsContext = createContext<IPointsContext | undefined>(undefined);

export const usePoints = (): IPointsContext => {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error("usePoints must be used within it's provider");
  }
  return context;
};

export const PointsProvider = ({
  children,
}: PropsWithChildren<{}>): JSX.Element => {
  const [points, setPoints] = useState<number | string>("-");

  const value: IPointsContext = useMemo(
    () => ({
      points,
    }),
    [points]
  );

  useEffect(() => {
    if (points === "-") {
      const callApi = async () => {
        const response = await fetch("/api/points", {
          method: "GET",
        });

        const result = await response.json();
        console.log("points result:", result);

        setPoints(result?.points || 0);
      };
      callApi();
    }
  }, [points]);

  return (
    <PointsContext.Provider value={value}>{children}</PointsContext.Provider>
  );
};
