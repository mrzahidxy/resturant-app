import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

//FETCH AL ORDERS
export const GET = async (req: NextRequest) => {
  const session = await getAuthSession();

  if (session) {
    try {
      if (session?.user?.isAdmin) {
        const orders = await prisma.order.findMany();

        return new NextResponse(JSON.stringify(orders), { status: 200 });
      }

      const orders = await prisma.order.findMany({
        where: {
          userEmail: session?.user?.email!,
        },
      });

      return new NextResponse(JSON.stringify(orders), { status: 200 });
    } catch (error) {
      return new NextResponse(JSON.stringify(error), { status: 500 });
    }
  } else {
    return new NextResponse(JSON.stringify("Unauthorized"), { status: 401 });
  }
};

