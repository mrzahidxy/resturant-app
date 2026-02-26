import Image from "next/image";
import Menu from "./Menu.component";
import Link from "next/link";
import Userlinks from "./UserLinks.component";


type Props = {};

const Navbar = (props: Props) => {
  return (
    <div className="ui-shell flex w-full items-center justify-between py-3 font-medium lg:py-4">
      <nav className="hidden gap-2 lg:flex">
        <Link href="/" className="ui-nav-link">
          Homepage
        </Link>
        <Link href="/menu" className="ui-nav-link">
          Menu
        </Link>
        <Link href="/contact" className="ui-nav-link">
          Contact
        </Link>
      </nav>
      <Link
        href="/"
        className="rounded-full px-2 py-1 text-xl font-bold tracking-tight text-[var(--lb-red)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 lg:text-5xl"
      >
        Masimmo
      </Link>
      <div className="lg:hidden">
        <Menu />
      </div>
      <div className="hidden items-center gap-5 text-[var(--lb-red)] lg:flex">
        <div className="ui-phone-pill">
          <Image src="/phone.png" width={20} height={20} alt="" loading="lazy" />
          <span>0693258</span>
        </div>
        <Userlinks />
      </div>
    </div>
  );
};

export default Navbar;
