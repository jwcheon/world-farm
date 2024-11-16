"use client";

import { Handshake, Tractor, Egg } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export const Navigator = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (key: string) => {
    if (pathname === `/${key}`) return;
    router.push(`/${key}`);
  };

  return (
    <>
      <div className="h-16"></div>
      <div className="fixed bottom-0 w-full h-[4.5rem] bg-blue-300 flex justify-center items-center">
        <div
          onClick={() => handleClick("")}
          className="flex flex-1 justify-center items-center px-6 pb-2 h-full hover:cursor-pointer"
        >
          <Tractor className="w-6 h-6" color="black" strokeWidth={2.5} />
        </div>
        <div
          onClick={() => handleClick("frens")}
          className="flex flex-1 justify-center items-center px-6 pb-2 h-full hover:cursor-pointer"
        >
          <Handshake className="w-6 h-6" color="black" strokeWidth={2.5} />
        </div>
        <div
          onClick={() => handleClick("gacha")}
          className="flex flex-1 justify-center items-center px-6 pb-2 h-full hover:cursor-pointer"
        >
          <Egg className="w-6 h-6" color="black" strokeWidth={2.5} />
        </div>
      </div>
    </>
  );
};
