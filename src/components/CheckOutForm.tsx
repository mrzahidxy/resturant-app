import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";

const getStripeErrorMessage = (error: any) => {
  if (!error) return "An unexpected error occurred.";

  if (error.code === "card_declined" && error.decline_code === "test_mode_live_card") {
    return "Test mode is enabled. Use a Stripe test card (e.g. 4242 4242 4242 4242), not a real card.";
  }

  if (error.type === "card_error" || error.type === "validation_error") {
    return error.message || "Payment failed. Please check your card details.";
  }

  return error.message || "An unexpected error occurred.";
};

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/success`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    setMessage(getStripeErrorMessage(error));

    setIsLoading(false);
  };

  return (
    <div className="flex justify-center p-4">
      <form
        id="payment-form"
        className="ui-card w-full space-y-4 p-8 lg:w-1/2 lg:p-12"
        onSubmit={handleSubmit}
      >
        <LinkAuthenticationElement id="link-authentication-element" />
        <PaymentElement
          id="payment-element"
          options={{
            layout: "tabs",
          }}
        />

        <button
          className="ui-btn ui-btn-primary w-full justify-center rounded-xl py-3"
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          <span id="button-text">
            {isLoading ? "Processing..." : "Pay now"}
          </span>
        </button>

        {/* Show any error or success messages */}
        {message && <div id="payment-message" className="ui-muted text-sm">{message}</div>}
      </form>
    </div>
  );
}
