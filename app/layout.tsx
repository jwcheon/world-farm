import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MiniKitProvider from "@/components/minikit-provider";
import dynamic from "next/dynamic";
//import NextAuthProvider from "@/components/next-auth-provider";
import Script from "next/script";
import { Toaster } from "@/components/ui/toast";
import ReactQueryProvider from "@/components/react-query-provider";
import { Navigator } from "@/components/Navigator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "World Farm",
  description: "Farm everyday in your own land in the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ErudaProvider = dynamic(
    () => import("../components/Eruda").then((c) => c.ErudaProvider),
    {
      ssr: false,
    }
  );
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <NextAuthProvider> */}
        <ErudaProvider>
          <MiniKitProvider>
            <ReactQueryProvider>
              <main>{children}</main>
              <Navigator />
              <Toaster />
            </ReactQueryProvider>
          </MiniKitProvider>
        </ErudaProvider>
        {/* </NextAuthProvider> */}

        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-9TFRKYECGK"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag('js', new Date());
            gtag('config', 'G-9TFRKYECGK');
          `}
        </Script>
      </body>
    </html>
  );
}
