import { Suspense } from "react";
import BillingContent from "./BillingContent";

export default function BillingPageWrapper() {
  return (
    <Suspense fallback={<div className="p-8">Loading billing info...</div>}>
      <BillingContent />
    </Suspense>
  );
}
