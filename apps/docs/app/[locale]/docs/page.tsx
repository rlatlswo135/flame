import { getTranslations, setRequestLocale } from 'next-intl/server';

const FEATURE_KEYS = ['headless', 'compound', 'treeshake', 'react19', 'typescript'] as const;

export default async function DocsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'docs' });

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-lg text-flame-text-secondary">{t('subtitle')}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t('installTitle')}</h2>
        <p className="text-flame-text-secondary">{t('installDescription')}</p>
        <pre className="px-4 py-3 rounded-lg bg-flame-bg-secondary border border-flame-border text-sm font-mono">
          {t('installCommand')}
        </pre>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t('usageTitle')}</h2>
        <p className="text-flame-text-secondary">{t('usageDescription')}</p>
        <pre className="px-4 py-3 rounded-lg bg-flame-bg-secondary border border-flame-border text-sm font-mono overflow-x-auto">{`import { Accordion } from '@anthropic/flame-ui';

<Accordion>
  <Accordion.Item>
    <Accordion.Trigger>Click me</Accordion.Trigger>
    <Accordion.Content>Hello!</Accordion.Content>
  </Accordion.Item>
</Accordion>`}</pre>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t('featuresTitle')}</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURE_KEYS.map((key) => (
            <li
              key={key}
              className="flex items-start gap-2 p-3 rounded-lg border border-flame-border bg-flame-bg-secondary"
            >
              <span className="text-flame-accent font-bold">*</span>
              <span className="text-sm">{t(`features.${key}`)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
