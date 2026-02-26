"use client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const LoginPage = () => {
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "authenticated") {
    router.push("/")
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] items-center justify-center p-4 md:h-[calc(100vh-9rem)]">
      {/* BOX */}
      <div className="ui-card h-full flex-col overflow-hidden shadow-2xl md:flex md:h-[70%] md:w-full md:flex-row lg:w-[60%] 2xl:w-1/2">
        {/* IMAGE CONTAINER */}
        <div className="relative h-1/3 w-full md:h-full md:w-1/2">
          <Image src="/loginBg.png" alt="" fill className="object-cover" loading="lazy"/>
        </div>
        {/* FORM CONTAINER */}
        <div className="flex flex-col gap-8 p-10 md:w-1/2">
          <h1 className="ui-heading text-xl xl:text-3xl">Welcome</h1>
          <p className="ui-muted">Log into your account or create a new one using social buttons</p>
          <button
            className="ui-btn ui-btn-secondary w-full justify-start rounded-xl px-4 py-4 normal-case tracking-normal"
            onClick={() => signIn("google")}
          >
            <Image
              src="/google.png"
              alt=""
              width={20}
              height={20}
              className="object-contain"
              loading="lazy"
            />
            <span>Sign in with Google</span>
          </button>
          {/* <button className="flex gap-4 p-4 ring-1 ring-blue-100 rounded-md">
            <Image
              src="/facebook.png"
              alt=""
              width={20}
              height={20}
              className="object-contain"
            />
            <span>Sign in with Facebook</span>
          </button> */}
          <p className="ui-muted text-sm">
            Have a problem?
            <Link className="ml-1 font-semibold text-[var(--lb-red)] underline" href="/">
              {" "}
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
