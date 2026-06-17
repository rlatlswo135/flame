import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CodeBlock } from '@/src/components/code-block';
import { ComponentDemo } from '@/src/components/component-demo';
import { type PropDef, PropsTable } from '@/src/components/props-table';
import { TooltipDemo } from './tooltip-demo';

const demoCode = `import { Tooltip } from '@flame/ui';

function TooltipExample() {
  return (
    <div className="flex items-center gap-3">
      <Tooltip content="This is a tooltip">
        <button type="button">Hover me</button>
      </Tooltip>

      <Tooltip enabled={false} content="This is a tooltip">
        <button type="button">Disabled</button>
      </Tooltip>
    </div>
  );
}`;

export default async function TooltipPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'components.tooltip' });
  const tc = await getTranslations({ locale, namespace: 'components' });

  const tooltipProps: PropDef[] = [
    { name: 'content', type: 'ReactNode', description: t('props.content') },
    {
      name: 'enabled',
      type: 'boolean',
      defaultValue: 'true',
      description: t('props.enabled'),
    },
    { name: 'children', type: 'ReactNode', description: t('props.children') },
    {
      name: 'transition',
      type: 'boolean | UseTransitionStylesProps',
      defaultValue: 'false',
      description: t('props.transition'),
    },
    { name: 'dismiss', type: 'UseDismissProps', description: t('props.dismiss') },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-3">{t('title')}</h1>
      <p className="text-flame-text-secondary mb-8 text-lg leading-relaxed">{t('description')}</p>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">{tc('demo')}</h2>
        <ComponentDemo codeBlock={<CodeBlock code={demoCode} />}>
          <TooltipDemo />
        </ComponentDemo>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6">{tc('apiReference')}</h2>
        <PropsTable title="Tooltip" props={tooltipProps} />
      </section>
    </div>
  );
}
