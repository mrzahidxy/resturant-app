import Image from "next/image";
import Menu from "./Menu.component";
import Cart from "./Cart.component";
import Link from "next/link";
import Userlinks from "./UserLinks.component";


type Props = {};

const Navbar = (props: Props) => {
  
  return (
    <div className="flex items-center justify-between lg:justify-around px-4 py-2 lg:py-4 bg-slate-50 drop-shadow uppercase font-medium">
      <nav className="hidden lg:flex gap-8 text-red-500 font-bold">
        <Link href='/' className="cursor-pointer">Homepage</Link>
        <Link href='/menu' className="cursor-pointer">Menu</Link>
        <span className="cursor-pointer">Contact</span>
      </nav>
      <Link href='/' className="text-xl lg:text-5xl font-bold text-red-500 cursor-pointer">
        Masimmo
      </Link>
      <div className="lg:hidden">
        <Menu />
      </div>
      <div className="hidden space-x-8 text-red-500 lg:flex items-center">
        <div className="bg-orange-500 text-white p-1 rounded-md flex cursor-pointer">
          <Image src="/phone.png" width={20} height={20} alt="" /> 0693258
        </div>
       <Userlinks/>
     
      </div>
    </div>
  );
};

export default Navbar;
