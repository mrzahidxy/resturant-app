import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { intentId: string } }
) => {
  const { intentId } = params;

  try {
    const order = await prisma.order.update({
      where: {
        intent_id:intentId,
      },
      data: { status: "Paymenyt Done" },
    });

    return new NextResponse("Order updated", { status: 200 });
  } catch (error) {
    return new NextResponse("Order not found", { status: 404 });
  }
};
