'use client';

import { Suspense } from "react";
import Verified from "./Verified";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20 text-xl">Loading...</div>}>
      <Verified />
    </Suspense>
  );
}
