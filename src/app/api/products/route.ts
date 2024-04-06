import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");

  try {
    // const prodducts = await prisma.product.findMany({
    //   where: { ...(cat ? { catSlug: cat } : { isFeatured: true }) },
    // });

    const products = await prisma.product.findMany();

    console.log({products})
    return new NextResponse(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
};
