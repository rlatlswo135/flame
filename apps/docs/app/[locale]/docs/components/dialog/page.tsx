import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CodeBlock } from '@/src/components/code-block';
import { ComponentDemo } from '@/src/components/component-demo';
import { type PropDef, PropsTable } from '@/src/components/props-table';
import { DialogDemo } from './dialog-demo';

const demoCode = `import { Dialog } from '@flame/ui';

function DialogExample() {
  return (
    <Dialog closeOutside>
      <Dialog.Trigger>
        <button>Open Dialog</button>
      </Dialog.Trigger>
      <Dialog.Content>
        <h2>Welcome to Flame</h2>
        <p>This is a headless dialog built on the native dialog element.</p>
        <Dialog.Closer>
          <button>Close</button>
        </Dialog.Closer>
      </Dialog.Content>
    </Dialog>
  );
}`;

export default async function DialogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'components.dialog' });
  const tc = await getTranslations({ locale, namespace: 'components' });

  const dialogProps: PropDef[] = [
    { name: 'children', type: 'ReactNode', description: t('props.children') },
    {
      name: 'closeOutside',
      type: 'boolean',
      defaultValue: 'false',
      description: t('props.closeOutside'),
    },
    {
      name: 'keepMounted',
      type: 'boolean',
      defaultValue: 'false',
      description: t('props.keepMounted'),
    },
  ];

  const triggerProps: PropDef[] = [
    {
      name: 'children',
      type: 'ReactElement | ((props: { open }) => ReactNode)',
      description: t('props.triggerChildren'),
    },
  ];

  const contentProps: PropDef[] = [
    {
      name: '...props',
      type: 'ComponentPropsWithoutRef<"dialog">',
      description: t('props.contentProps'),
    },
  ];

  const closerProps: PropDef[] = [
    {
      name: 'children',
      type: 'ReactElement | ((props: { close }) => ReactNode)',
      description: t('props.closerChildren'),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-3">{t('title')}</h1>
      <p className="text-flame-text-secondary mb-8 text-lg leading-relaxed">{t('description')}</p>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">{tc('demo')}</h2>
        <ComponentDemo codeBlock={<CodeBlock code={demoCode} />}>
          <DialogDemo />
        </ComponentDemo>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6">{tc('apiReference')}</h2>
        <PropsTable title="Dialog" props={dialogProps} />
        <PropsTable title="Dialog.Trigger" props={triggerProps} />
        <PropsTable title="Dialog.Content" props={contentProps} />
        <PropsTable title="Dialog.Closer" props={closerProps} />
      </section>
    </div>
  );
}
