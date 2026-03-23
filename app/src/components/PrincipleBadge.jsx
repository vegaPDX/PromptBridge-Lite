import React from "react";
import { PRINCIPLE_MAP } from "../data/principles";

export default function PrincipleBadge({ principleId, size = "sm" }) {
  const p = PRINCIPLE_MAP[principleId];
  if (!p) return null;
  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";
  return (
    <span
      className={`inline-flex items-center gap-1 ${sizeClasses} bg-indigo-50 text-indigo-700 rounded-full font-medium`}
    >
      {p.name}
    </span>
  );
}
