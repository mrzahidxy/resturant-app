import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const POST = async (
  req: NextRequest,
  { params }: { params: { orderId: string } }
) => {
  const { orderId } = params;

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (order) {
    // Check if payment intent already exists
    if (!order.intent_id) {
      const paymentIntent = await stripe.paymentIntents.create({
        // TODO: amount should be dynamic.
        //amount: order?.price * 100,
        amount: 100,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      console.log("paymentIntent", paymentIntent);

      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          intent_id: paymentIntent?.id,
        },
      });

      return new NextResponse(
        JSON.stringify({ clientSecret: paymentIntent?.client_secret }),
        { status: 200 }
      );
    }
  }

  return new NextResponse("Order not found", { status: 404 });
};
