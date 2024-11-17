import { useEffect, useRef, useState } from "react";
import ScratchCard from "./ScratchCard";
import ReactCardFlip from "react-card-flip";
import { Rabbit, Sprout } from "lucide-react";
import { toast } from "sonner";

const losingItems = ["rabbit", "piggy", "boar"];

export const ScratchCardFlip = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const innerDivRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);

  const [items, setItems] = useState<string[]>([]);
  const [prize, setPrize] = useState<number>();

  useEffect(() => {
    if (innerDivRef.current) {
      const { width, height } = innerDivRef.current.getBoundingClientRect();
      setWidth(width);
      setHeight(height);
    }
  }, [isFlipped]);

  useEffect(() => {
    const tier = Math.ceil(Math.random() * 6);

    const winItems = Array(tier).fill("win");
    const losingItemsArray = Array(6 - tier)
      .fill(null)
      .map(() => losingItems[Math.floor(Math.random() * losingItems.length)]);

    const itemsArray = [...winItems, ...losingItemsArray];

    for (let i = itemsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [itemsArray[i], itemsArray[j]] = [itemsArray[j], itemsArray[i]];
    }

    setItems(itemsArray);
    setPrize(tier);
  }, []);

  console.log("itemsArray", items, prize);

  return (
    <ReactCardFlip
      isFlipped={isFlipped}
      flipDirection="horizontal"
      flipSpeedFrontToBack={1.2}
    >
      <div className={`w-[300px] flex flex-col justify-center items-center`}>
        <div
          ref={innerDivRef}
          className="w-11/12 h-[160px] bg-slate-400 flex justify-center items-center select-none"
          onClick={() => setIsFlipped(true)}
        >
          Click to scratch.
        </div>
      </div>

      <div className="w-[300px] flex flex-col justify-center items-center">
        {width && height && (
          <ScratchCard
            data={
              <div className="rounded-xl bg-blue-300 py-2 text-white px-10 w-full h-full grid grid-cols-3 gap-4 text-center">
                {items.map((each, index) => {
                  if (each === "win") {
                    return (
                      <div
                        key={index}
                        className="flex flex-col justify-center items-center space-y-2 text-purple-600"
                      >
                        <Rabbit fill="#9333ea" />
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={index}
                        className="flex flex-col justify-center items-center space-y-2 text-gray-800"
                      >
                        <Sprout />
                      </div>
                    );
                  }
                })}
              </div>
            }
            width={width}
            height={height}
            handleCoverScratched={() => {
              toast(`You got ${prize} bunnies`);
            }}
          />
        )}
      </div>
    </ReactCardFlip>
  );
};
