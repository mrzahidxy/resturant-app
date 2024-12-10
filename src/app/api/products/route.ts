import { uploadToCloudinary } from "@/utils/cloudinary";
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
    const formData = await req.formData();
    const file = formData.get("img") as File;
    const title = formData.get("title") as string;
    const desc = formData.get("desc") as string;
    const price = formData.get("price") as string;
    const catSlug = formData.get("catSlug") as string;
    const options = JSON.parse(formData.get("options") as string);

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
