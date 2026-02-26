import Footer from "@/components/Footer.component";
import Navbar from "@/components/Navbar.component";
import Notification from "@/components/Notification.component";
import React, { FC } from "react";

type Props = {
  children: React.ReactNode;
};

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="ui-header-surface border-b shadow-sm">
        <Notification />
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="ui-main-surface flex-1">{children}</main>

      {/* Footer */}
      <footer className="ui-footer-surface border-t border-white/10">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
