import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CodeBlock } from '@/src/components/code-block';
import { ComponentDemo } from '@/src/components/component-demo';
import { type PropDef, PropsTable } from '@/src/components/props-table';
import { PopoverDemo } from './popover-demo';

const demoCode = `import { Popover } from '@flame/ui';

function PopoverExample() {
  return (
    <Popover transition>
      <Popover.Trigger>
        <button>Open Popover</button>
      </Popover.Trigger>
      <Popover.Content>
        <h3>Popover Title</h3>
        <p>This is a popover with Floating UI positioning.</p>
      </Popover.Content>
    </Popover>
  );
}`;

export default async function PopoverPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'components.popover' });
  const tc = await getTranslations({ locale, namespace: 'components' });

  const popoverProps: PropDef[] = [
    { name: 'children', type: 'ReactNode', description: t('props.children') },
    {
      name: 'portal',
      type: 'boolean | FloatingPortalProps',
      defaultValue: 'false',
      description: t('props.portal'),
    },
    {
      name: 'focusTrap',
      type: 'boolean',
      defaultValue: 'true',
      description: t('props.focusTrap'),
    },
    {
      name: 'transition',
      type: 'boolean | UseTransitionStylesProps',
      defaultValue: 'false',
      description: t('props.transition'),
    },
    { name: 'dismiss', type: 'UseDismissProps', description: t('props.dismiss') },
    { name: 'onOpen', type: '() => void', description: t('props.onOpen') },
    { name: 'onClose', type: '() => void', description: t('props.onClose') },
  ];

  const triggerProps: PropDef[] = [
    { name: 'children', type: 'ReactElement', description: t('props.triggerChildren') },
  ];

  const contentProps: PropDef[] = [
    {
      name: 'children',
      type: 'ReactNode | ((props: { floating, interactions }) => ReactNode)',
      description: t('props.contentChildren'),
    },
    {
      name: '...props',
      type: 'ComponentPropsWithoutRef<"section">',
      description: t('props.contentProps'),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-3">{t('title')}</h1>
      <p className="text-flame-text-secondary mb-8 text-lg leading-relaxed">{t('description')}</p>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">{tc('demo')}</h2>
        <ComponentDemo codeBlock={<CodeBlock code={demoCode} />}>
          <PopoverDemo />
        </ComponentDemo>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6">{tc('apiReference')}</h2>
        <PropsTable title="Popover" props={popoverProps} />
        <PropsTable title="Popover.Trigger" props={triggerProps} />
        <PropsTable title="Popover.Content" props={contentProps} />
      </section>
    </div>
  );
}
