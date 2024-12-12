import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Define the POST handler for creating a PaymentIntent
export const POST = async (
  req: NextRequest,
  { params }: { params: { orderId: string } }
) => {
  const { orderId } = params;

  // Start a Prisma transaction to ensure atomicity
  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Fetch the order within the transaction
      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
      });

      // If the order doesn't exist, throw an error to abort the transaction
      if (!order) {
        throw new Error("Order not found");
      }

      // If a PaymentIntent already exists for this order, retrieve it
      if (order.intent_id) {
        try {
          const existingPaymentIntent = await stripe.paymentIntents.retrieve(
            order.intent_id
          );

          // Return the existing clientSecret
          return {
            clientSecret: existingPaymentIntent.client_secret,
          };
        } catch (error) {
          console.error(
            `Error retrieving existing PaymentIntent for order ${orderId}:`,
            error
          );
        }
      }

      // Create a new PaymentIntent with an idempotency key based on orderId
      const paymentIntent = await stripe.paymentIntents.create(
        {
          amount: (order.price as any) * 100, 
          currency: "usd",
          automatic_payment_methods: {
            enabled: true,
          },
          // Optionally, add metadata or description
          metadata: {
            orderId: orderId,
          },
        },
        {
          // Use orderId as part of the idempotency key to ensure uniqueness
          idempotencyKey: `payment_intent_order_${orderId}`,
        }
      );

      // Update the order with the new PaymentIntent ID
      const updatedOrder = await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          intent_id: paymentIntent.id,
        },
      });

      // Return the clientSecret for the newly created PaymentIntent
      return {
        clientSecret: paymentIntent.client_secret,
      };
    });

    // Respond with the clientSecret in JSON format
    return NextResponse.json({ clientSecret: result.clientSecret }, { status: 200 });
  } catch (error) {
    console.error("Error creating or retrieving PaymentIntent:", error);
    // For other errors, respond with a generic server error
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
