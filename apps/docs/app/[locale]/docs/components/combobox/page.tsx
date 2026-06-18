import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CodeBlock } from '@/src/components/code-block';
import { ComponentDemo } from '@/src/components/component-demo';
import { type PropDef, PropsTable } from '@/src/components/props-table';
import { ComboboxDemo } from './combobox-demo';

const demoCode = `import { Combobox } from '@flame/ui';
import { useState } from 'react';

const FRUITS = ['apple', 'banana', 'cherry', 'grape', 'mango'];

function ComboboxExample() {
  const [value, setValue] = useState('');
  const [search, setSearch] = useState('');

  const filtered = FRUITS.filter((f) =>
    f.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Combobox value={value} onChange={setValue} search={search} onSearchChange={setSearch} transition>
      <Combobox.Trigger>
        <button>{value || 'Search for a fruit'}</button>
      </Combobox.Trigger>
      <Combobox.Options>
        <Combobox.Search placeholder="Search..." />
        {filtered.map((fruit) => (
          <Combobox.Option key={fruit} value={fruit}>
            {fruit}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
}`;

export default async function ComboboxPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'components.combobox' });
  const tc = await getTranslations({ locale, namespace: 'components' });

  const comboboxProps: PropDef[] = [
    { name: 'value', type: 'string', description: t('props.value') },
    { name: 'onChange', type: '(value: string) => void', description: t('props.onChange') },
    { name: 'search', type: 'string', description: t('props.search') },
    {
      name: 'onSearchChange',
      type: '(search: string) => void',
      description: t('props.onSearchChange'),
    },
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

  const searchProps: PropDef[] = [
    {
      name: '...props',
      type: 'ComponentPropsWithoutRef<"input">',
      description: t('props.searchProps'),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-3">{t('title')}</h1>
      <p className="text-flame-text-secondary mb-8 text-lg leading-relaxed">{t('description')}</p>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">{tc('demo')}</h2>
        <ComponentDemo codeBlock={<CodeBlock code={demoCode} />}>
          <ComboboxDemo />
        </ComponentDemo>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6">{tc('apiReference')}</h2>
        <PropsTable title="Combobox" props={comboboxProps} />
        <PropsTable title="Combobox.Trigger" props={triggerProps} />
        <PropsTable title="Combobox.Options" props={optionsProps} />
        <PropsTable title="Combobox.Option" props={optionProps} />
        <PropsTable title="Combobox.Search" props={searchProps} />
      </section>
    </div>
  );
}
