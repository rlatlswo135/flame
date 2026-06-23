import { codeToHtml } from 'shiki';

export async function highlight(code: string, lang = 'tsx'): Promise<string> {
  try {
    return await codeToHtml(code, {
      lang,
      themes: { light: 'rose-pine-dawn', dark: 'kanagawa-dragon' },
      defaultColor: false,
    });
  } catch {
    const escaped = String(code)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre><code>${escaped}</code></pre>`;
  }
}
