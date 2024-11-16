"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Handshake } from "lucide-react";
import { toast } from "sonner";

import { MinidenticonImg } from "@/components/MinidenticonImg";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";

import { useContext, useState } from "react";
import { WalletContext } from "@/components/minikit-provider";
import { FrensMarquee } from "@/components/Marquee/FrensMarquee";

interface Fren {
  username: string;
}

interface WorldUser {
  username: string;
  points: number;
}

interface FrensResponse {
  frens: Fren[];
  frensCount: number;
}
interface WorldUsersResponse {
  users: WorldUser[];
}

export default function Frens() {
  const { walletAddress } = useContext(WalletContext);

  const { data: world, isLoading: isLoadingWorld } =
    useQuery<WorldUsersResponse>({
      queryKey: ["world-users"],
      queryFn: async () => {
        const res = await fetch("/api/world-users", {
          method: "GET",
        });
        const data = await res.json();
        console.log({ data });
        return data;
      },
      staleTime: 5 * 60 * 1000,
    });

  console.log("world", world);

  const { data, isLoading } = useQuery<FrensResponse>({
    queryKey: ["frens"],
    queryFn: async () => {
      const res = await fetch("/api/frens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      console.log({ data });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="w-full min-h-screen bg-black">
      <FrensMarquee invites={data?.frensCount || "-"} />

      <div className="mt-7 w-full px-4">
        <InviteDrawer />
      </div>

      <div className="mt-8"></div>

      <Tabs defaultValue="world" className="w-full px-4 text-white">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="world">World</TabsTrigger>
          <TabsTrigger value="frens">My Frens</TabsTrigger>
        </TabsList>
        <TabsContent value="world">
          {isLoadingWorld && <LoadingSpinner />}
          {!isLoadingWorld && <WorldList frens={world?.users || []} />}
        </TabsContent>
        <TabsContent value="frens">
          {isLoading && <LoadingSpinner />}
          {!isLoading && <FrenList frens={data?.frens || []} />}
        </TabsContent>
      </Tabs>

      <div className="mt-24"></div>
    </div>
  );
}

const InviteDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          className="text-black bg-blue-300 border-blue-300 w-full h-12 animate-pulse"
          variant="outline"
        >
          Invite a fren
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-blue-300">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="mt-3 text-2xl text-black flex justify-center items-center space-x-2">
              Bring your frens{" "}
              <div className="flex justify-center items-center">
                <Handshake
                  className="ml-2 w-6 h-6"
                  color="black"
                  strokeWidth={2.5}
                />
              </div>
            </DrawerTitle>
            <DrawerDescription className="text-center">
              Get rewarded more for every fren you invite now
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Button
                variant="outline"
                size="lg"
                className="text-black w-full h-12 shrink-0 rounded-2xl font-semibold"
                onClick={() => toast("Invite feature coming soon!")}
              >
                Copy invite link
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-black w-full h-12 shrink-0 rounded-2xl font-semibold"
                onClick={() => toast("Invite feature coming soon!")}
              >
                Share invite now
              </Button>
            </div>
            <div className="mt-3 h-[60px]"></div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const FrenList = ({ frens }: { frens: Fren[] }) => {
  return (
    <>
      {frens.map((fren, index) => (
        <div
          key={index}
          className={`mt-2 w-full flex justify-center items-center space-x-1 px-4 animate-fadeIn`}
        >
          <div className="w-2/12 flex justify-start items-center">
            <MinidenticonImg
              username={fren.username}
              saturation="30"
              width="50"
              height="50"
            />
          </div>
          <div className="w-8/12 flex flex-col space-y-1">
            <div>{fren.username}</div>
          </div>
          <div className="w-2/12 text-end">#{index + 1}</div>
        </div>
      ))}
      {frens.length === 0 && <EmptyPlaceholder className="mt-24" />}
    </>
  );
};

const WorldList = ({ frens }: { frens: Fren[] }) => {
  console.log("Worldlist frens", frens);
  return (
    <>
      {frens.map((fren, index) => (
        <div
          key={index}
          className={`mt-2 w-full flex justify-center items-center space-x-1 px-4 animate-fadeIn`}
        >
          <div className="w-2/12 flex justify-start items-center">
            <MinidenticonImg
              username={fren.username}
              saturation="30"
              width="50"
              height="50"
            />
          </div>
          <div className="w-8/12 flex flex-col space-y-1">
            <div>{fren.username}</div>
          </div>
          <div className="w-2/12 text-end">#{index + 1}</div>
        </div>
      ))}
    </>
  );
};
