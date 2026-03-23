import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <p className="text-red-700 text-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      )}
    </div>
  );
}
