import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HeritageProvider } from "@/context/HeritageContext";
import BottomNav from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Heritage: Daily Rhythms",
  description: "Daily spiritual rituals for Christian fathers and children",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Heritage",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} pb-[calc(80px+env(safe-area-inset-bottom))]`}>
        <HeritageProvider>
          {children}
        </HeritageProvider>
        <BottomNav />
      </body>
    </html>
  );
}
