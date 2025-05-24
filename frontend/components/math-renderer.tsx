"use client";

import { useEffect, useState } from "react";

interface MathRendererProps {
  children: string;
  display?: boolean;
}

export function MathRenderer({ children, display = false }: MathRendererProps) {
  const [rendered, setRendered] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderMath = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const katex = await import("katex");

        const html = katex.default.renderToString(children, {
          displayMode: display,
          throwOnError: false,
          errorColor: "#ef4444",
          strict: false,
          trust: false,
          macros: {
            "\\f": "#1f(#2)",
          },
        });

        setRendered(html);
        setError(null);
      } catch (err) {
        console.error("KaTeX rendering error:", err);
        setError(children); // Fallback to raw text
      }
    };

    renderMath();
  }, [children, display]);

  if (error) {
    return (
      <span
        className={`font-mono text-red-500 ${
          display ? "block text-center my-2" : "inline"
        }`}
      >
        {error}
      </span>
    );
  }

  if (display) {
    return (
      <div className="my-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
        <div
          className="text-center katex-display"
          dangerouslySetInnerHTML={{ __html: rendered }}
        />
      </div>
    );
  }

  return (
    <span
      className="katex-inline mx-1"
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}
