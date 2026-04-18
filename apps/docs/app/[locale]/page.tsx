import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Header } from './_navigation/header';

const COMPONENT_NAMES = [
  'Accordion',
  'Dialog',
  'Drawer',
  'Funnel',
  'Popover',
  'Select',
  'Toast',
] as const;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-flame-accent">{t('title')}</span> {t('titleSuffix')}
          </h1>
          <p className="text-xl text-flame-text-secondary max-w-lg mx-auto">{t('description')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl w-full">
          {COMPONENT_NAMES.map((name) => (
            <Link
              key={name}
              href={`/${locale}/docs/components/${name.toLowerCase()}`}
              className="group p-5 rounded-xl border border-flame-border hover:border-flame-accent/40 bg-flame-bg-secondary hover:bg-flame-accent-soft transition-all"
            >
              <h3 className="font-semibold mb-1 group-hover:text-flame-accent transition-colors">
                {name}
              </h3>
              <p className="text-sm text-flame-text-secondary">
                {t(`components.${name.toLowerCase()}`)}
              </p>
            </Link>
          ))}
        </div>

        <Link
          href={`/${locale}/docs`}
          className="mt-10 px-6 py-3 rounded-lg text-white font-medium transition-colors bg-flame-accent hover:bg-flame-accent-hover"
        >
          {t('getStarted')}
        </Link>
      </main>
    </div>
  );
}
