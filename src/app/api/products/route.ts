import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");

  try {
    const prodducts = await prisma.product.findMany({
      where: { ...(cat ? { catSlug: cat } : { isFeatured: true }) },
    });
    return new NextResponse(JSON.stringify(prodducts), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    await prisma.product.create({
      data: { ...body },
    });

    return new NextResponse(JSON.stringify("Product is successfully created"), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
};
