import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Layout, Navbar } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import "./globals.css";
import { Footer } from "@/components/common/footer";
import Logo from "@/public/assets/logo.svg";
import Image from "next/image";
import { MobileNavbarFix } from "@/components/common/mobile-navbar-fix";
import { BuyMeCoffeeWidget } from "@/components/common/buy-me-coffee-widget";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase:
    typeof window !== "undefined"
      ? new URL(`${window.location.origin}`)
      : "https://logger.planetmoondrop.com",
  title: {
    default: "Moondrop Centralized Logger",
    template: "%s | Moondrop",
  },
  description: "Centralized Logger | Observability",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Moondrop",
    title: "Moondrop Centralized Logger",
    description: "…",
    images: ["/assets/logo.svg"],
  },
  keywords: [
    "centralized logger",
    "moondrop",
    "logging",
    "log management",
    "log aggregation",
    "log analysis",
    "log monitoring",
    "grafana",
    "loki",
    "tempo",
    "moondrop centralized logger",
    "observability",
    "stack",
    "node js",
    "nest js logger",
    "nest js centralized logger",
  ],

  icons: {
    icon: [
      {
        url: "/assets/moondrop-favicon-assets/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        url: "/assets/moondrop-favicon-assets/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/assets/moondrop-favicon-assets/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/assets/moondrop-favicon-assets/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      { url: "/assets/logo.svg" },
    ],
    apple: "/assets/moondrop-favicon-assets/apple-touch-icon.png",
  },
  manifest: "/assets/moondrop-favicon-assets/site.webmanifest",
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// const banner = <Banner storageKey="some-key">Moondrop - Centralized logger 1.0.0 is released 🎉</Banner>;
const navbar = (
  <Navbar
    logo={
      <>
        <Image
          src={Logo}
          alt="Moondrop"
          className="h-10 w-auto"
          width={10}
          height={10}
        />
        <b className="font-heading">MOONDROP</b>
      </>
    }
    projectLink="https://github.com/planetmoondrop/centralized-logger"
    chatLink="https://discord.gg/M4pg2PqQry"
  />
);

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <Layout
          darkMode={false}
          copyPageButton={false}
          // banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          footer={<Footer />}
          editLink={true}
          feedback={{
            content: <span className="text-[#faa56c]">Question? Give us feedback</span>,
            link: "https://discord.gg/M4pg2PqQry",
            labels: "Discord",
          }}
        >
          {children}
        </Layout>
        <Analytics />
        <MobileNavbarFix />
        <BuyMeCoffeeWidget />
      </body>
    </html>
  );
}
