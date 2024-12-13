import { uploadToCloudinary } from "@/utils/cloudinary";
import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");
  const isFeatured = searchParams.get("isFeatured");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);

  const offset = (page - 1) * limit;
  const featuredFilter = isFeatured ? { isFeatured: true } : {};
  const categoryFilter = cat ? { catSlug: cat } : {};

  try {
    let products;
    let totalProducts;

    totalProducts = await prisma.product.count({
      where: {
        ...categoryFilter,
        ...featuredFilter,
      },
    });
    products = await prisma.product.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        ...categoryFilter,
        ...featuredFilter,
      },
    });
    return new NextResponse(
      JSON.stringify({
        data: products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
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
    const formData = await req.formData();
    const file = formData.get("img") as File;
    const title = formData.get("title") as string;
    const desc = formData.get("desc") as string;
    const price = formData.get("price") as string;
    const catSlug = formData.get("catSlug") as string;
    const options = JSON.parse(formData.get("options") as string);
    const isFeatured = formData.get("isFeatured") as string;

    // Validate category exists
    const category = await prisma.category.findUnique({
      where: { slug: catSlug },
    });

    if (!category) {
      return NextResponse.json(
        { error: `Category with slug '${catSlug}' does not exist.` },
        { status: 400 }
      );
    }

    let img: string | undefined = undefined;

    if (file) {
      const fileBuffer = await file.arrayBuffer();
      const base64Data = Buffer.from(fileBuffer).toString("base64");
      const fileUri = `data:${file.type};base64,${base64Data}`;

      // Upload to Cloudinary
      const uploadRes = await uploadToCloudinary(fileUri, file.name);
      if (!uploadRes.success) {
        return NextResponse.json(
          { message: "Image upload failed" },
          { status: 500 }
        );
      }

      img = (uploadRes as any).result.secure_url; // Get the new Cloudinary image URL
    }
    await prisma.product.create({
      data: {
        title,
        desc,
        price,
        category: {
          connect: { slug: catSlug }, // Connect to existing category
        },
        img,
        options,
        isFeatured: isFeatured === "1" ? true : false,
      },
    });

    return new NextResponse(JSON.stringify("Product is successfully created"), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
};
