import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Military Benefits Assistant - VA Form Generator",
  description: "Save your profile and auto-generate filled VA education benefit forms with the click of a button.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-gray-50`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Analytics />
          <footer className="bg-slate-900 text-gray-400 text-center py-6 text-sm">
            <p>Military Benefits Assistant is not affiliated with or endorsed by the U.S. Department of Veterans Affairs.</p>
            <p className="mt-1">This tool helps you fill out forms. Always verify information with your Education Services Officer (ESO).</p>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
              <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
              <span>·</span>
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
              <span>·</span>
              <a href="mailto:info@militarybenefitsassistant.com" className="hover:text-gray-300 transition-colors">Contact</a>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
