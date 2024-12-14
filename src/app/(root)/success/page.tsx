"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import ConfettiExplosion from "react-confetti-explosion";

const SuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intentId = searchParams.get("payment_intent");

  useEffect(() => {
    
    if (!intentId ) return;
    const makeRequest = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/confirm/${intentId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          }
        );
        setTimeout(() => {
          router.push("/orders");
        }, 2000);
      } catch (err) {
        console.log(err);
      }
    };

    makeRequest();
  }, [intentId, router]);

  return (
    <div>
      <div className="min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-15rem)] flex items-center justify-center text-center text-2xl text-green-700">
        <p className="max-w-[600px]">
          Payment successful. You are being redirected to the orders page.
          Please do not close the page.
        </p>
      <ConfettiExplosion className="absolute m-auto"/>
      </div>
    </div>
  );
};

export default SuccessPage;