import { HomeMarquee } from "@/components/Marquee/HomeMarquee";
// import { PayBlock } from "@/components/Pay";
// import { SignIn } from "@/components/SignIn";
// import { VerifyBlock } from "@/components/Verify";

export default function Home() {
  return (
    <main className="w-full select-none">
      <HomeMarquee />
      {/* <SignIn />
      <VerifyBlock />
      <PayBlock /> */}
    </main>
  );
}
