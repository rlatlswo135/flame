import { codeToHtml } from 'shiki';
import { CopyButton } from './copy-button';

type CodeBlockProps = {
  code: string;
  language?: string;
};

async function CodeBlock({ code, language = 'tsx' }: CodeBlockProps) {
  let html: string;

  try {
    html = await codeToHtml(code, {
      lang: language,
      themes: {
        light: 'rose-pine-dawn',
        dark: 'kanagawa-dragon',
      },
      defaultColor: false,
    });
  } catch {
    const escaped = String(code).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html = `<pre><code>${escaped}</code></pre>`;
  }

  return (
    <div className="relative rounded-lg border border-flame-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-flame-border bg-(--shiki-light-bg) dark:bg-(--shiki-dark-bg">
        <span className="text-xs text-neutral-400 font-mono">{language}</span>
        <CopyButton code={code} />
      </div>
      <div
        className="[&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:leading-relaxed [&_pre]:m-0 [&_code]:font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export { CodeBlock };
