import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], 
  variable: "--font-fira-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clear Sky IQ",
  description: "NASA Space Apps Challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${firaSans.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-grow bg-[var(--blue-yonder)] text-white flex items-center justify-center">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
