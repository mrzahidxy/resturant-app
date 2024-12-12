import { getAuthSession } from "@/utils/auth";
import Sidebar from "./sidebar.component";
import { redirect } from "next/navigation";

type Props = { children: React.ReactNode };

const layout = async ({ children }: Props) => {
  const session = await getAuthSession();

  if(!session?.user?.isAdmin) return redirect("/")

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};
export default layout;
