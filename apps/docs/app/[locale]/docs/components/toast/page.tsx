import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CodeBlock } from '@/src/components/code-block';
import { ComponentDemo } from '@/src/components/component-demo';
import { type PropDef, PropsTable } from '@/src/components/props-table';
import { ToastDemo } from './toast-demo';

const demoCode = `'use client';

import { Toast, Toaster, toast } from '@flame/ui';

// Toaster uses useSyncExternalStore — render it in a client component.
function App() {
  return (
    <>
      <Toaster placement="bottom-right" />
      <button
        onClick={() =>
          toast(
            <Toast>
              <Toast.Title>Saved</Toast.Title>
              <Toast.Description>Your changes have been saved.</Toast.Description>
            </Toast>,
          )
        }
      >
        Show Toast
      </button>
    </>
  );
}`;

export default async function ToastPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'components.toast' });
  const tc = await getTranslations({ locale, namespace: 'components' });

  const toasterProps: PropDef[] = [
    {
      name: 'placement',
      type: '"top-left" | "top-right" | "bottom-left" | "bottom-right"',
      defaultValue: '"bottom-left"',
      description: t('props.placement'),
    },
    {
      name: '...props',
      type: 'ComponentPropsWithRef<"section">',
      description: t('props.toasterProps'),
    },
  ];

  const toastProps: PropDef[] = [
    {
      name: '...props',
      type: 'ComponentPropsWithRef<"div">',
      description: t('props.toastProps'),
    },
  ];

  const titleProps: PropDef[] = [
    {
      name: '...props',
      type: 'ComponentPropsWithRef<"div">',
      description: t('props.titleProps'),
    },
  ];

  const descriptionProps: PropDef[] = [
    {
      name: '...props',
      type: 'ComponentPropsWithRef<"div">',
      description: t('props.descriptionProps'),
    },
  ];

  const toastFnProps: PropDef[] = [
    {
      name: 'content',
      type: 'ReactNode',
      description: t('props.fnContent'),
    },
    {
      name: 'options.timeout',
      type: 'number',
      defaultValue: '3000',
      description: t('props.fnTimeout'),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-3">{t('title')}</h1>
      <p className="text-flame-text-secondary mb-8 text-lg leading-relaxed">{t('description')}</p>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">{tc('demo')}</h2>
        <ComponentDemo codeBlock={<CodeBlock code={demoCode} />}>
          <ToastDemo />
        </ComponentDemo>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6">{tc('apiReference')}</h2>
        <PropsTable title="Toaster" props={toasterProps} />
        <PropsTable title="Toast" props={toastProps} />
        <PropsTable title="Toast.Title" props={titleProps} />
        <PropsTable title="Toast.Description" props={descriptionProps} />
        <PropsTable title="toast(content, options?)" props={toastFnProps} />
      </section>
    </div>
  );
}
