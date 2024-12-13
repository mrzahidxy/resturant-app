import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

//FETCH AL ORDERS
export const GET = async (req: NextRequest) => {
  const sessionHeader = req.headers.get("session");
  const session = sessionHeader ? JSON.parse(sessionHeader) : null;

  if (!session) {
    return new NextResponse(JSON.stringify("Unauthorized"), { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);
  const offset = (page - 1) * limit;

  try {
    let orders;
    let totalOrders;

    if (session?.user?.isAdmin) {
      totalOrders = await prisma.order.count(); // Count total orders for pagination
      orders = await prisma.order.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      totalOrders = await prisma.order.count({
        where: { userEmail: session?.user?.email! },
      });
      orders = await prisma.order.findMany({
        where: {
          userEmail: session?.user?.email!,
        },
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return new NextResponse(
      JSON.stringify({
        data: orders,
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: page,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
};


export const POST = async (req: NextRequest) => {
  try {
    const session = await getAuthSession();

    if (!session) {
      return new NextResponse(JSON.stringify("Unauthorized"), { status: 401 });
    }

    const body = await req.json();
    const createdOrder = await prisma.order.create({ data: body });

    return new NextResponse(JSON.stringify(createdOrder), { status: 201 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
};
