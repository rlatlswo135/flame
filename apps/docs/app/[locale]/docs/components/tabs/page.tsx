import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CodeBlock } from '@/src/components/code-block';
import { ComponentDemo } from '@/src/components/component-demo';
import { type PropDef, PropsTable } from '@/src/components/props-table';
import { TabsDemo } from './tabs-demo';

const demoCode = `import { Tabs } from '@flame/ui';

function TabsExample() {
  return (
    <Tabs initialTab="overview">
      <Tabs.Item value="overview">Overview</Tabs.Item>
      <Tabs.Item value="usage">Usage</Tabs.Item>
      <Tabs.Item value="api">API</Tabs.Item>
    </Tabs>
  );
}`;

export default async function TabsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'components.tabs' });
  const tc = await getTranslations({ locale, namespace: 'components' });

  const rootProps: PropDef[] = [
    { name: 'initialTab', type: 'string', defaultValue: '""', description: t('props.initialTab') },
    { name: 'onChange', type: '(value: string) => void', description: t('props.onChange') },
    {
      name: '...props',
      type: 'ComponentPropsWithoutRef<"div">',
      description: t('props.rootProps'),
    },
  ];

  const itemProps: PropDef[] = [
    { name: 'value', type: 'string', description: t('props.itemValue') },
    {
      name: '...props',
      type: 'ComponentPropsWithoutRef<"button">',
      description: t('props.itemProps'),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-3">{t('title')}</h1>
      <p className="text-flame-text-secondary mb-8 text-lg leading-relaxed">{t('description')}</p>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">{tc('demo')}</h2>
        <ComponentDemo codeBlock={<CodeBlock code={demoCode} />}>
          <TabsDemo />
        </ComponentDemo>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6">{tc('apiReference')}</h2>
        <PropsTable title="Tabs" props={rootProps} />
        <PropsTable title="Tabs.Item" props={itemProps} />
      </section>
    </div>
  );
}
