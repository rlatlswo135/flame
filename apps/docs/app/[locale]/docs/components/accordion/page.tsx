import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CodeBlock } from '@/src/components/code-block';
import { ComponentDemo } from '@/src/components/component-demo';
import { type PropDef, PropsTable } from '@/src/components/props-table';
import { AccordionDemo } from './accordion-demo';

const demoCode = `import { Accordion } from '@flame/ui';

function AccordionExample() {
  return (
    <Accordion single>
      <Accordion.Item>
        <Accordion.Trigger>
          <button>What is Flame?</button>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>Flame is a headless React component library.</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Trigger>
          <button>Getting Started</button>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>Install via pnpm add @flame/ui and import components.</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Trigger>
          <button>Components</button>
        </Accordion.Trigger>
        <Accordion.Content>
          <p>Accordion, Dialog, Funnel, Popover, Select, and more.</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}`;

export default async function AccordionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'components.accordion' });
  const tc = await getTranslations({ locale, namespace: 'components' });

  const accordionProps: PropDef[] = [
    { name: 'single', type: 'boolean', defaultValue: 'false', description: t('props.single') },
    { name: 'children', type: 'ReactNode', description: 'Accordion.Item elements' },
  ];

  const itemProps: PropDef[] = [
    {
      name: 'initialOpen',
      type: 'boolean',
      defaultValue: 'false',
      description: t('props.itemInitialOpen'),
    },
    { name: 'children', type: 'ReactNode', description: t('props.itemChildren') },
  ];

  const triggerProps: PropDef[] = [
    {
      name: 'children',
      type: 'ReactElement | ((props: { toggle }) => ReactNode)',
      description: t('props.triggerChildren'),
    },
  ];

  const contentProps: PropDef[] = [
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
          <AccordionDemo />
        </ComponentDemo>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6">{tc('apiReference')}</h2>
        <PropsTable title="Accordion" props={accordionProps} />
        <PropsTable title="Accordion.Item" props={itemProps} />
        <PropsTable title="Accordion.Trigger" props={triggerProps} />
        <PropsTable title="Accordion.Content" props={contentProps} />
      </section>
    </div>
  );
}
