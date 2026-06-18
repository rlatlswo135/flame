import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CodeBlock } from '@/src/components/code-block';
import { ComponentDemo } from '@/src/components/component-demo';
import { type PropDef, PropsTable } from '@/src/components/props-table';
import { TooltipDemo } from './tooltip-demo';

const demoCode = `import { Tooltip } from '@flame/ui';

function TooltipExample() {
  return (
    <div className="flex items-center gap-3">
      <Tooltip>
        <Tooltip.Trigger>
          <button type="button">Hover me</button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <div>This is a tooltip</div>
        </Tooltip.Content>
      </Tooltip>

      <Tooltip enabled={false}>
        <Tooltip.Trigger>
          <button type="button">Disabled</button>
        </Tooltip.Trigger>
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
    {
      name: 'enabled',
      type: 'boolean',
      defaultValue: 'true',
      description: t('props.enabled'),
    },
    {
      name: 'placement',
      type: 'Placement',
      defaultValue: '"top"',
      description: t('props.placement'),
    },
    { name: 'offset', type: 'OffsetOptions', defaultValue: '8', description: t('props.offset') },
    { name: 'flip', type: 'FlipOptions', description: t('props.flip') },
    { name: 'shift', type: 'ShiftOptions', description: t('props.shift') },
    { name: 'delay', type: 'UseHoverProps["delay"]', description: t('props.delay') },
    {
      name: 'transition',
      type: 'boolean | UseTransitionStylesProps',
      defaultValue: 'false',
      description: t('props.transition'),
    },
    { name: 'dismiss', type: 'UseDismissProps', description: t('props.dismiss') },
    { name: 'children', type: 'ReactNode', description: t('props.children') },
  ];

  const triggerProps: PropDef[] = [
    { name: 'children', type: 'ReactElement', description: t('props.triggerChildren') },
  ];

  const contentProps: PropDef[] = [
    {
      name: 'children',
      type: 'ReactElement | ((props: { floating, interactions }) => ReactNode)',
      description: t('props.contentChildren'),
    },
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
        <PropsTable title="Tooltip.Trigger" props={triggerProps} />
        <PropsTable title="Tooltip.Content" props={contentProps} />
      </section>
    </div>
  );
}
