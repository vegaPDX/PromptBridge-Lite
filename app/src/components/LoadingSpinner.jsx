import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ message = "Thinking..." }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center py-12 gap-3">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      <p className="text-stone-500 text-sm">{message}</p>
    </div>
  );
}
