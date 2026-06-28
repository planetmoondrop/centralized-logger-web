import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import "./globals.css";
import { Footer } from "@/components/common/footer";

export const metadata: Metadata = {
  title: "Moondrop - Centralized Logger | Observability",
  description: "",
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
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// const banner = <Banner storageKey="some-key">Nextra 4.0 is released 🎉</Banner>;
const navbar = (
  <Navbar
    logo={<b className="font-heading">MOONDROP</b>}
    chatLink="https://discord.gg/FPz2P2FM"
    className="z-9999"
  />
);

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <Head
      // ... Your additional head options
      ></Head>
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
            link: "https://discord.gg/FPz2P2FM",
            labels: "Discord",
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
