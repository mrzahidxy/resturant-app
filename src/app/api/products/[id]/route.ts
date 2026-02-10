import { uploadToCloudinary } from "@/utils/cloudinary";
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

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("img") as File | null;
    const title = (formData.get("title") as string) ?? existingProduct.title;
    const desc = (formData.get("desc") as string) ?? existingProduct.desc;
    const price = (formData.get("price") as string) ?? String(existingProduct.price);
    const catSlug = (formData.get("catSlug") as string) ?? existingProduct.catSlug;
    const options = formData.get("options")
      ? JSON.parse(formData.get("options") as string)
      : existingProduct.options;
    const isFeatured = formData.get("isFeatured");

    const category = await prisma.category.findUnique({
      where: { slug: catSlug },
    });

    if (!category) {
      return NextResponse.json(
        { error: `Category with slug '${catSlug}' does not exist.` },
        { status: 400 }
      );
    }

    let img = existingProduct.img;

    if (file && file.size > 0) {
      const fileBuffer = await file.arrayBuffer();
      const base64Data = Buffer.from(fileBuffer).toString("base64");
      const fileUri = `data:${file.type};base64,${base64Data}`;

      const uploadRes = await uploadToCloudinary(fileUri, file.name);
      if (!uploadRes.success) {
        return NextResponse.json(
          { message: "Image upload failed" },
          { status: 500 }
        );
      }

      img = (uploadRes as any).result.secure_url;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title,
        desc,
        price,
        catSlug,
        options,
        img,
        isFeatured:
          isFeatured === null ? existingProduct.isFeatured : isFeatured === "1",
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
  }
};

export const PUT = PATCH;
