import { Suspense } from "react";
import SuccessClient from "./success-client";

const SuccessPage = () => {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <SuccessClient />
    </Suspense>
  );
};

export default SuccessPage;
