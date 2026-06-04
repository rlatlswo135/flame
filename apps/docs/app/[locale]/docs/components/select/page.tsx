import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CodeBlock } from '@/src/components/code-block';
import { ComponentDemo } from '@/src/components/component-demo';
import { type PropDef, PropsTable } from '@/src/components/props-table';
import { SelectDemo } from './select-demo';

const demoCode = `import { Select } from '@flame/ui';
import { useState } from 'react';

function SelectExample() {
  const [value, setValue] = useState('');

  return (
    <Select value={value} onChange={setValue} transition>
      <Select.Trigger>
        <button>{value || 'Choose a fruit'}</button>
      </Select.Trigger>
      <Select.Options>
        <Select.Option value="apple">Apple</Select.Option>
        <Select.Option value="banana">Banana</Select.Option>
        <Select.Option value="cherry">Cherry</Select.Option>
        <Select.Option value="grape">Grape</Select.Option>
      </Select.Options>
    </Select>
  );
}`;

export default async function SelectPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'components.select' });
  const tc = await getTranslations({ locale, namespace: 'components' });

  const selectProps: PropDef[] = [
    { name: 'value', type: 'string', description: t('props.value') },
    { name: 'onChange', type: '(value: string) => void', description: t('props.onChange') },
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
    { name: 'children', type: 'ReactNode', description: t('props.children') },
  ];

  const triggerProps: PropDef[] = [
    { name: 'children', type: 'ReactElement', description: t('props.triggerChildren') },
  ];

  const optionsProps: PropDef[] = [
    {
      name: 'children',
      type: 'ReactNode | ((props: { floating, interactions }) => ReactNode)',
      description: t('props.optionsChildren'),
    },
    {
      name: '...props',
      type: 'ComponentPropsWithoutRef<"div">',
      description: t('props.optionsProps'),
    },
  ];

  const optionProps: PropDef[] = [
    { name: 'value', type: 'string', description: t('props.optionValue') },
    {
      name: '...props',
      type: 'ComponentPropsWithoutRef<"div">',
      description: t('props.optionProps'),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-3">{t('title')}</h1>
      <p className="text-flame-text-secondary mb-8 text-lg leading-relaxed">{t('description')}</p>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">{tc('demo')}</h2>
        <ComponentDemo codeBlock={<CodeBlock code={demoCode} />}>
          <SelectDemo />
        </ComponentDemo>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6">{tc('apiReference')}</h2>
        <PropsTable title="Select" props={selectProps} />
        <PropsTable title="Select.Trigger" props={triggerProps} />
        <PropsTable title="Select.Options" props={optionsProps} />
        <PropsTable title="Select.Option" props={optionProps} />
      </section>
    </div>
  );
}
