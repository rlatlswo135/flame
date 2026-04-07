'use client';

import { type ReactNode, useState } from 'react';

function ComponentDemo({
  children,
  codeBlock,
  title,
}: {
  children: ReactNode;
  codeBlock: ReactNode;
  title?: string;
}) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="rounded-xl border border-flame-border overflow-hidden">
      {title && (
        <div className="px-5 py-3 border-b border-flame-border">
          <h3 className="text-sm font-medium text-flame-text-secondary">{title}</h3>
        </div>
      )}
      <div className="p-8 bg-flame-bg-secondary flex items-center justify-center min-h-[160px]">
        {children}
      </div>
      <div className="border-t border-flame-border">
        <button
          type="button"
          onClick={() => setShowCode((prev) => !prev)}
          className="w-full px-5 py-2.5 text-sm text-flame-text-secondary hover:text-flame-text hover:bg-flame-bg-tertiary transition-colors text-left flex items-center gap-2"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`transition-transform ${showCode ? 'rotate-90' : ''}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          {showCode ? 'Hide Code' : 'Show Code'}
        </button>
        {showCode && codeBlock}
      </div>
    </div>
  );
}

export { ComponentDemo };
