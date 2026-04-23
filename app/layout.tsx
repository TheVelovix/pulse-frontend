import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import SessionProvider from "@/context/SessionContext";
import PaddleProvider from "@/context/PaddleProvider";
import Script from "next/script";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Pulse",
  description: "Analytics for your platforms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <head>
        <Script
          src="https://api.pulse.velovix.com/viewsTracker.js"
          data-project-id="db5790a0-847c-40fa-b503-d343ba28f3c6"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <PaddleProvider />
          <Navbar />
          <main className="flex flex-col flex-1">{children}</main>
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: "#111111",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#f9fafb",
              },
            }}
          />
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
