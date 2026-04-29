import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CodeBlock } from '@/src/components/code-block';
import { ComponentDemo } from '@/src/components/component-demo';
import { type PropDef, PropsTable } from '@/src/components/props-table';
import { DrawerDemo } from './drawer-demo';

const demoCode = `import { Drawer } from '@flame/ui';

function DrawerExample() {
  return (
    <Drawer placement="right">
      <Drawer.Trigger>
        <button>Open Drawer</button>
      </Drawer.Trigger>
      <Drawer.Content className="fixed top-0 right-0 h-full w-80">
        <h2>Drawer Title</h2>
        <p>Slide-in panel content goes here.</p>
        <Drawer.Closer>
          <button>Close</button>
        </Drawer.Closer>
      </Drawer.Content>
    </Drawer>
  );
}`;

export default async function DrawerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'components.drawer' });
  const tc = await getTranslations({ locale, namespace: 'components' });

  const drawerProps: PropDef[] = [
    {
      name: 'placement',
      type: '"top" | "right" | "bottom" | "left"',
      defaultValue: '"right"',
      description: t('props.placement'),
    },
    {
      name: 'contentId',
      type: 'string',
      description: t('props.contentId'),
    },
    { name: 'onOpen', type: '() => void', description: t('props.onOpen') },
    { name: 'onClose', type: '() => void', description: t('props.onClose') },
    { name: 'children', type: 'ReactNode', description: t('props.children') },
  ];

  const triggerProps: PropDef[] = [
    {
      name: 'children',
      type: 'ReactElement | ((props: { open: () => void }) => ReactNode)',
      description: t('props.triggerChildren'),
    },
  ];

  const contentProps: PropDef[] = [
    {
      name: 'ref',
      type: 'RefObject<HTMLDivElement | null>',
      description: t('props.contentRef'),
    },
    {
      name: '...props',
      type: 'ComponentPropsWithoutRef<"div">',
      description: t('props.contentProps'),
    },
  ];

  const closerProps: PropDef[] = [
    {
      name: 'children',
      type: 'ReactElement | ((props: { close: () => void }) => ReactNode)',
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
          <DrawerDemo />
        </ComponentDemo>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6">{tc('apiReference')}</h2>
        <PropsTable title="Drawer" props={drawerProps} />
        <PropsTable title="Drawer.Trigger" props={triggerProps} />
        <PropsTable title="Drawer.Content" props={contentProps} />
        <PropsTable title="Drawer.Closer" props={closerProps} />
      </section>
    </div>
  );
}
