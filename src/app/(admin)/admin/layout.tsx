import { getAuthSession } from "@/utils/auth";
import AdminNavbar from "./navbar.component";
import Sidebar from "./sidebar.component";
import { redirect } from "next/navigation";

type Props = { children: React.ReactNode };

const layout = async ({ children }: Props) => {
  const session = await getAuthSession();

  if(!session?.user?.isAdmin) return redirect("/")

  return (
    <div className="flex min-h-screen bg-[#f6f6f6]">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminNavbar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};
export default layout;
