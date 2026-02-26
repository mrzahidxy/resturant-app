import { uploadToCloudinary } from "@/utils/cloudinary";
import prisma from "@/utils/connect";
import {
  createTimer,
  getRequestIdFromHeaders,
  logger,
  serializeError,
} from "@/utils/logger";
import { NextRequest, NextResponse } from "next/server";

const productsLogger = logger.child({ scope: "api/products" });

export const GET = async (req: NextRequest) => {
  const requestId = getRequestIdFromHeaders(req.headers);
  const getDuration = createTimer();
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");
  const isFeatured = searchParams.get("isFeatured");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);

  const offset = (page - 1) * limit;
  const featuredFilter = isFeatured ? { isFeatured: true } : {};
  const categoryFilter = cat ? { catSlug: cat } : {};

  productsLogger.info("products.get.request", {
    requestId,
    method: req.method,
    cat,
    isFeatured,
    page,
    limit,
    offset,
  });

  try {
    let products;
    let totalProducts;

    productsLogger.debug("products.get.db.count.start", {
      requestId,
      where: { ...categoryFilter, ...featuredFilter },
    });
    totalProducts = await prisma.product.count({
      where: {
        ...categoryFilter,
        ...featuredFilter,
      },
    });
    productsLogger.debug("products.get.db.count.success", {
      requestId,
      totalProducts,
    });
    productsLogger.debug("products.get.db.findMany.start", {
      requestId,
      page,
      limit,
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

    productsLogger.info("products.get.success", {
      requestId,
      totalProducts,
      returnedCount: products.length,
      page,
      limit,
      durationMs: getDuration(),
    });

    return new NextResponse(
      JSON.stringify({
        data: products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
      }),
      { status: 200, headers: { "x-request-id": requestId } }
    );
  } catch (error) {
    productsLogger.error("products.get.failed", {
      requestId,
      durationMs: getDuration(),
      error: serializeError(error),
    });
    return new NextResponse(JSON.stringify(error), {
      status: 500,
      headers: { "x-request-id": requestId },
    });
  }
};

export const POST = async (req: NextRequest) => {
  const requestId = getRequestIdFromHeaders(req.headers);
  const getDuration = createTimer();

  productsLogger.info("products.post.request", {
    requestId,
    method: req.method,
    contentType: req.headers.get("content-type"),
  });

  try {
    const formData = await req.formData();
    const file = formData.get("img") as File;
    const title = formData.get("title") as string;
    const desc = formData.get("desc") as string;
    const price = formData.get("price") as string;
    const catSlug = formData.get("catSlug") as string;
    const options = JSON.parse(formData.get("options") as string);
    const isFeatured = formData.get("isFeatured") as string;

    productsLogger.debug("products.post.payload.parsed", {
      requestId,
      title,
      catSlug,
      hasFile: !!file,
      optionsCount: Array.isArray(options) ? options.length : null,
      isFeatured: isFeatured === "1",
    });

    // Validate category exists
    productsLogger.debug("products.post.db.category_lookup.start", {
      requestId,
      catSlug,
    });
    const category = await prisma.category.findUnique({
      where: { slug: catSlug },
    });

    if (!category) {
      productsLogger.warn("products.post.category_not_found", {
        requestId,
        catSlug,
        durationMs: getDuration(),
      });
      return NextResponse.json(
        { error: `Category with slug '${catSlug}' does not exist.` },
        { status: 400, headers: { "x-request-id": requestId } }
      );
    }

    let img: string | undefined = undefined;

    if (file) {
      productsLogger.info("products.post.cloudinary.upload.start", {
        requestId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });
      const fileBuffer = await file.arrayBuffer();
      const base64Data = Buffer.from(fileBuffer).toString("base64");
      const fileUri = `data:${file.type};base64,${base64Data}`;

      // Upload to Cloudinary
      const uploadRes = await uploadToCloudinary(fileUri, file.name);
      if (!uploadRes.success) {
        productsLogger.error("products.post.cloudinary.upload_failed", {
          requestId,
          fileName: file.name,
          durationMs: getDuration(),
        });
        return NextResponse.json(
          { message: "Image upload failed" },
          { status: 500, headers: { "x-request-id": requestId } }
        );
      }

      productsLogger.info("products.post.cloudinary.upload_success", {
        requestId,
        fileName: file.name,
      });
      img = (uploadRes as any).result.secure_url; // Get the new Cloudinary image URL
    }

    productsLogger.debug("products.post.db.create.start", {
      requestId,
      title,
      catSlug,
    });
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

    productsLogger.info("products.post.success", {
      requestId,
      title,
      catSlug,
      durationMs: getDuration(),
    });

    return new NextResponse(JSON.stringify("Product is successfully created"), {
      status: 200,
      headers: { "x-request-id": requestId },
    });
  } catch (error) {
    productsLogger.error("products.post.failed", {
      requestId,
      durationMs: getDuration(),
      error: serializeError(error),
    });
    return new NextResponse(JSON.stringify(error), {
      status: 500,
      headers: { "x-request-id": requestId },
    });
  }
};
