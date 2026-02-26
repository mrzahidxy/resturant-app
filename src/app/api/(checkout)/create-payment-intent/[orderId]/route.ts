import prisma from "@/utils/connect";
import {
  createTimer,
  getRequestIdFromHeaders,
  logger,
  serializeError,
} from "@/utils/logger";
import { NextRequest, NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const paymentLogger = logger.child({ scope: "api/payment-intent" });

const toAmountCents = (value: unknown) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return null;
  const cents = Math.round(amount * 100);
  return cents > 0 ? cents : null;
};

// Define the POST handler for creating a PaymentIntent
export const POST = async (
  req: NextRequest,
  { params }: { params: { orderId: string } }
) => {
  const requestId = getRequestIdFromHeaders(req.headers);
  const getDuration = createTimer();
  const { orderId } = params;

  paymentLogger.info("payment_intent.post.request", {
    requestId,
    method: req.method,
    orderId,
  });

  try {
    paymentLogger.debug("payment_intent.db.order_lookup.start", {
      requestId,
      orderId,
    });
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      paymentLogger.warn("payment_intent.order_not_found", {
        requestId,
        orderId,
        durationMs: getDuration(),
      });
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404, headers: { "x-request-id": requestId } }
      );
    }

    if (order.intent_id) {
      try {
        paymentLogger.info("payment_intent.stripe.retrieve_existing.start", {
          requestId,
          orderId,
          intentId: order.intent_id,
        });
        const existingPaymentIntent = await stripe.paymentIntents.retrieve(
          order.intent_id
        );

        paymentLogger.info("payment_intent.stripe.retrieve_existing.success", {
          requestId,
          orderId,
          intentId: order.intent_id,
        });

        return NextResponse.json(
          { clientSecret: existingPaymentIntent.client_secret },
          { status: 200, headers: { "x-request-id": requestId } }
        );
      } catch (error) {
        paymentLogger.warn("payment_intent.stripe.retrieve_existing.failed", {
          requestId,
          orderId,
          intentId: order.intent_id,
          error: serializeError(error),
        });
      }
    }

    const amountCents = toAmountCents(order.price);
    if (!amountCents) {
      paymentLogger.error("payment_intent.invalid_amount", {
        requestId,
        orderId,
        rawPrice: String(order.price),
      });
      return NextResponse.json(
        { message: "Invalid order amount" },
        { status: 400, headers: { "x-request-id": requestId } }
      );
    }

    paymentLogger.info("payment_intent.stripe.create.start", {
      requestId,
      orderId,
      amountCents,
      currency: "usd",
    });
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountCents,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          orderId,
        },
      },
      {
        idempotencyKey: `payment_intent_order_${orderId}`,
      }
    );

    paymentLogger.debug("payment_intent.db.order_update.start", {
      requestId,
      orderId,
      intentId: paymentIntent.id,
    });
    await prisma.order.update({
      where: { id: orderId },
      data: { intent_id: paymentIntent.id },
    });

    paymentLogger.info("payment_intent.post.success", {
      requestId,
      orderId,
      durationMs: getDuration(),
    });

    return NextResponse.json(
      { clientSecret: paymentIntent.client_secret },
      { status: 200, headers: { "x-request-id": requestId } }
    );
  } catch (error) {
    paymentLogger.error("payment_intent.post.failed", {
      requestId,
      orderId,
      durationMs: getDuration(),
      error: serializeError(error),
    });
    return NextResponse.json(
      { message: "Failed to create payment intent" },
      { status: 500, headers: { "x-request-id": requestId } }
    );
  }
};
