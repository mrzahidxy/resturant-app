import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import {
  createTimer,
  getRequestIdFromHeaders,
  logger,
  sanitizeSessionForLog,
  serializeError,
} from "@/utils/logger";
import { NextRequest, NextResponse } from "next/server";

const ordersLogger = logger.child({ scope: "api/orders" });

//FETCH AL ORDERS
export const GET = async (req: NextRequest) => {
  const requestId = getRequestIdFromHeaders(req.headers);
  const getDuration = createTimer();
  const sessionHeader = req.headers.get("session");
  let session = null;

  try {
    session = sessionHeader ? JSON.parse(sessionHeader) : null;
  } catch (error) {
    ordersLogger.warn("orders.get.session_header_parse_failed", {
      requestId,
      error: serializeError(error),
    });
  }

  ordersLogger.info("orders.get.request", {
    requestId,
    method: req.method,
    session: sanitizeSessionForLog(session),
  });

  if (!session) {
    ordersLogger.warn("orders.get.unauthorized", {
      requestId,
      durationMs: getDuration(),
    });
    return new NextResponse(JSON.stringify("Unauthorized"), {
      status: 401,
      headers: { "x-request-id": requestId },
    });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);
  const offset = (page - 1) * limit;

  try {
    let orders;
    let totalOrders;

    if (session?.user?.isAdmin) {
      ordersLogger.debug("orders.get.db.count.start", {
        requestId,
        scope: "all",
      });
      totalOrders = await prisma.order.count(); // Count total orders for pagination
      ordersLogger.debug("orders.get.db.findMany.start", {
        requestId,
        scope: "all",
        page,
        limit,
      });
      orders = await prisma.order.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      ordersLogger.debug("orders.get.db.count.start", {
        requestId,
        scope: "user",
        userEmail: session?.user?.email ?? null,
      });
      totalOrders = await prisma.order.count({
        where: { userEmail: session?.user?.email! },
      });
      ordersLogger.debug("orders.get.db.findMany.start", {
        requestId,
        scope: "user",
        userEmail: session?.user?.email ?? null,
        page,
        limit,
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

    ordersLogger.info("orders.get.success", {
      requestId,
      page,
      limit,
      totalOrders,
      returnedCount: orders.length,
      isAdmin: !!session?.user?.isAdmin,
      userEmail: session?.user?.email ?? null,
      durationMs: getDuration(),
    });

    return new NextResponse(
      JSON.stringify({
        data: orders,
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: page,
      }),
      { status: 200, headers: { "x-request-id": requestId } }
    );
  } catch (error) {
    ordersLogger.error("orders.get.failed", {
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

  ordersLogger.info("orders.post.request", {
    requestId,
    method: req.method,
    contentType: req.headers.get("content-type"),
  });

  try {
    const session = await getAuthSession();

    if (!session) {
      ordersLogger.warn("orders.post.unauthorized", {
        requestId,
        durationMs: getDuration(),
      });
      return new NextResponse(JSON.stringify("Unauthorized"), {
        status: 401,
        headers: { "x-request-id": requestId },
      });
    }

    const body = await req.json();
    ordersLogger.debug("orders.post.payload.parsed", {
      requestId,
      session: sanitizeSessionForLog(session),
      userEmail: body?.userEmail ?? null,
      productCount: Array.isArray(body?.products) ? body.products.length : null,
      price: body?.price ?? null,
      status: body?.status ?? null,
    });

    ordersLogger.debug("orders.post.db.create.start", {
      requestId,
      userEmail: body?.userEmail ?? null,
    });
    const createdOrder = await prisma.order.create({ data: body });

    ordersLogger.info("orders.post.success", {
      requestId,
      orderId: createdOrder.id,
      userEmail: createdOrder.userEmail,
      durationMs: getDuration(),
    });

    return new NextResponse(JSON.stringify(createdOrder), {
      status: 201,
      headers: { "x-request-id": requestId },
    });
  } catch (error) {
    ordersLogger.error("orders.post.failed", {
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
