"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TypingMessageProps {
  content: string;
  onComplete: () => void;
  speed?: number;
}

// Simple math renderer component
const MathRenderer = ({
  children,
  display = false,
}: {
  children: string;
  display?: boolean;
}) => {
  const [rendered, setRendered] = useState<string>("");

  useEffect(() => {
    const mathContent = String(children || "");
    const processedContent = mathContent
      .replace(/\^(\w+|\{[^}]+\})/g, (match, exp) => {
        const cleanExp = exp.replace(/[{}]/g, "");
        return `<sup>${cleanExp}</sup>`;
      })
      .replace(/_(\w+|\{[^}]+\})/g, (match, sub) => {
        const cleanSub = sub.replace(/[{}]/g, "");
        return `<sub>${cleanSub}</sub>`;
      })
      .replace(
        /\\frac\{([^}]+)\}\{([^}]+)\}/g,
        '<span class="fraction"><span class="numerator">$1</span><span class="denominator">$2</span></span>'
      )
      .replace(/\\sqrt\{([^}]+)\}/g, "√($1)")
      .replace(/\\int/g, "∫")
      .replace(/\\sum/g, "∑")
      .replace(/\\prod/g, "∏")
      .replace(/\\lim/g, "lim")
      .replace(/\\infty/g, "∞")
      .replace(/\\alpha/g, "α")
      .replace(/\\beta/g, "β")
      .replace(/\\gamma/g, "γ")
      .replace(/\\delta/g, "δ")
      .replace(/\\epsilon/g, "ε")
      .replace(/\\theta/g, "θ")
      .replace(/\\lambda/g, "λ")
      .replace(/\\mu/g, "μ")
      .replace(/\\pi/g, "π")
      .replace(/\\sigma/g, "σ")
      .replace(/\\phi/g, "φ")
      .replace(/\\omega/g, "ω")
      .replace(/\\leq/g, "≤")
      .replace(/\\geq/g, "≥")
      .replace(/\\neq/g, "≠")
      .replace(/\\approx/g, "≈")
      .replace(/\\pm/g, "±")
      .replace(/\\times/g, "×")
      .replace(/\\div/g, "÷")
      .replace(/\\cdot/g, "·");

    setRendered(processedContent);
  }, [children]);

  if (display) {
    return (
      <div className="my-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
        <div
          className="text-center text-lg font-mono"
          dangerouslySetInnerHTML={{ __html: rendered }}
        />
      </div>
    );
  }

  return (
    <span
      className="font-mono mx-1 text-violet-600 dark:text-violet-400"
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
};

export function TypingMessage({
  content,
  onComplete,
  speed = 30,
}: TypingMessageProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Custom markdown components for better styling
  const markdownComponents = {
    h1: ({ children }: any) => (
      <h1 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-base font-bold mb-2 text-slate-900 dark:text-slate-100">
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc mb-3 space-y-1 pl-6 [&>li]:leading-relaxed">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal mb-3 space-y-1 pl-6 [&>li]:leading-relaxed">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="leading-relaxed [&>p]:mb-1 [&>p]:inline">{children}</li>
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold text-slate-900 dark:text-slate-100">
        {children}
      </strong>
    ),
    em: ({ children }: any) => <em className="italic">{children}</em>,
    code: ({ children, className }: any) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-violet-600 dark:text-violet-400">
            {children}
          </code>
        );
      }
      return (
        <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg overflow-x-auto mb-3">
          <code className="text-sm font-mono text-slate-800 dark:text-slate-200">
            {children}
          </code>
        </pre>
      );
    },
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-violet-300 dark:border-violet-600 pl-4 py-2 mb-3 bg-violet-50 dark:bg-violet-950/20 rounded-r">
        {children}
      </blockquote>
    ),
    a: ({ children, href }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 underline"
      >
        {children}
      </a>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto mb-3">
        <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-600">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-slate-50 dark:bg-slate-800">{children}</thead>
    ),
    tbody: ({ children }: any) => <tbody>{children}</tbody>,
    tr: ({ children }: any) => (
      <tr className="border-b border-slate-200 dark:border-slate-700">
        {children}
      </tr>
    ),
    th: ({ children }: any) => (
      <th className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-left font-semibold">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">
        {children}
      </td>
    ),
  };

  // Process message content to handle math
  const processMessageContent = (content: string) => {
    const textContent = String(content || "");
    const parts = textContent.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g);

    return parts.map((part, index) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        return (
          <MathRenderer key={index} display>
            {part.slice(2, -2)}
          </MathRenderer>
        );
      } else if (part.startsWith("$") && part.endsWith("$")) {
        return <MathRenderer key={index}>{part.slice(1, -1)}</MathRenderer>;
      } else {
        return (
          <ReactMarkdown
            key={index}
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {part}
          </ReactMarkdown>
        );
      }
    });
  };

  useEffect(() => {
    if (currentIndex < content.length && !isComplete) {
      intervalRef.current = setTimeout(() => {
        setDisplayedContent(content.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);
    } else if (currentIndex >= content.length && !isComplete) {
      setIsComplete(true);
      onComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [currentIndex, content, speed, isComplete, onComplete]);

  // Reset when content changes
  useEffect(() => {
    setDisplayedContent("");
    setCurrentIndex(0);
    setIsComplete(false);
  }, [content]);

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert prose-violet [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      {processMessageContent(displayedContent)}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="inline-block w-2 h-4 bg-violet-500 ml-1"
        />
      )}
    </div>
  );
}
