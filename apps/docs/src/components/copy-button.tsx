'use client';

import { useEffect, useRef, useState } from 'react';

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard access denied */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-xs text-flame-text-secondary hover:text-flame-text transition-colors"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export { CopyButton };
