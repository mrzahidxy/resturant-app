import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    const produtc = await prisma.product.findUnique({
      where: { id: id },
    });

    return new NextResponse(JSON.stringify(produtc), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    await prisma.product.delete({
      where: { id: id },
    });

    return new NextResponse("Product deleted", { status: 200 });
  } catch (error) {
    return new NextResponse("Product not found", { status: 404 });
  }
};
