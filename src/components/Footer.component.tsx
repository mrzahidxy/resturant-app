import React from "react";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className="ui-shell flex w-full flex-col gap-2 py-5 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--lb-rose)] md:flex-row md:items-center md:justify-between md:text-base">
      <span className="text-white">MASSIMO</span>
      <span>© All Rights Reserved</span>
    </div>
  );
};

export default Footer;
