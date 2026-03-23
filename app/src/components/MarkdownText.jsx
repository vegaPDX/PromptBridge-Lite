import React from "react";

export default function MarkdownText({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        const formatted = line
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.+?)\*/g, "<em>$1</em>");
        const isListItem =
          /^\d+\.\s/.test(line.trim()) || /^[-•]\s/.test(line.trim());
        return (
          <p
            key={i}
            className={isListItem ? "pl-4" : ""}
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      })}
    </div>
  );
}
