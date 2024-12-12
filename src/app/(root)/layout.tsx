import Footer from "@/components/Footer.component";
import Navbar from "@/components/Navbar.component";
import Notification from "@/components/Notification.component";
import React, { FC } from "react";

type Props = {
  children: React.ReactNode;
};

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gray-50 shadow">
        <Notification />
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
