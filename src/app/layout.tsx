import type { Metadata, Viewport } from "next";
import { Cinzel, Inter, Sahitya, Hind_Vadodara } from "next/font/google";
import "./globals.css";

const display = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const sahitya = Sahitya({
  variable: "--font-sahitya",
  subsets: ["latin", "devanagari"],
  weight: ["400", "700"],
});

const hindVadodara = Hind_Vadodara({
  variable: "--font-hind-vadodara",
  subsets: ["latin", "gujarati"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Karma-Logi | Jain Philosophy Through Play",
  description:
    "Explore the ancient Jain philosophy of karma through immersive games. Cause, effect, and the path to liberation.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#090b1e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${inter.variable} ${sahitya.variable} ${hindVadodara.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}

