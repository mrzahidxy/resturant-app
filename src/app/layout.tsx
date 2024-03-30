import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar.component";
import Notification from "@/components/Notification.component";
import Footer from "@/components/Footer.component";
import AuthProvider from "@/components/AuthProvider";
import QueryProvider from "@/components/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Msimmo",
  description: "Order ur food",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            <header>
              <Notification />
              <Navbar />
            </header>
            <main>{children}</main>
            <footer>
              <Footer />
            </footer>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
