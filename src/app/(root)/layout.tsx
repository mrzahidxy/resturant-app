import Footer from "@/components/Footer.component";
import Navbar from "@/components/Navbar.component";
import Notification from "@/components/Notification.component";
import React from "react";

type Props = { children: React.ReactNode };

const layout = ({ children }: Props) => {
  return (
    <div className="min-h-screen">
      <header>
        <Notification />
        <Navbar />
      </header>
      <main >{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default layout;
