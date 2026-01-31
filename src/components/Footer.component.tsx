import React from "react";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className="mx-auto flex w-full max-w-6xl justify-between px-6 py-4 font-bold text-red-500 md:text-xl">
      <span>MASSIMO</span>
      <span>© ALL RIGHT RESERVED</span>
    </div>
  );
};

export default Footer;
