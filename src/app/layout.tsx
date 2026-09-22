import { Outfit } from "next/font/google";
import { Metadata, Viewport } from "next";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/providers";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: (() => {
    const raw = process.env.NEXT_PUBLIC_APP_URL || "https://pickle.me";
    try {
      return new URL(raw);
    } catch {
      return new URL("https://pickle.me");
    }
  })(),
  title: {
    default: "Pickle.me - AI Advice & Memory Games",
    template: "%s | Pickle.me",
  },
  description:
    "Get unstuck with AI-powered advice and train your brain with fun pickle-themed memory games!",
  keywords: [
    "AI advice",
    "memory games",
    "problem solving",
    "brain training",
    "pickle",
    "dilemma solver",
  ],
  authors: [{ name: "Pickle.me Team" }],
  creator: "Pickle.me",
  publisher: "Pickle.me",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Pickle.me - AI Advice & Memory Games",
    description:
      "Get unstuck with AI-powered advice and train your brain with fun pickle-themed memory games!",
    siteName: "Pickle.me",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pickle.me - Your AI-powered problem solver",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pickle.me - AI Advice & Memory Games",
    description: "Get unstuck with AI-powered advice and train your brain!",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10b981" },
    { media: "(prefers-color-scheme: dark)", color: "#065f46" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <Script id="theme-init" strategy="beforeInteractive">{`try{var t=localStorage.getItem("pickle-theme");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;if(t==="dark"||(t==="system"&&d)||(!t&&d))document.documentElement.classList.add("dark")}catch(e){}`}</Script>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-emerald-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              Skip to main content
            </a>
            <Header />
            <main id="main-content" className="grow" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
