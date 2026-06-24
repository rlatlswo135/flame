import { Combobox } from '@flame/ui';
import { useState } from 'react';
import { ComponentDemo } from '../component-demo';

const FRUIT_KEYS = ['apple', 'banana', 'cherry', 'grape', 'mango'] as const;

function ComboboxDemo({ t }: { t: Record<string, string> }) {
  const [value, setValue] = useState('');

  return (
    <Combobox value={value} onChange={setValue} transition>
      <Combobox.Search
        placeholder={t.searchPlaceholder}
        className="w-full min-w-[220px] px-4 py-2.5 text-sm rounded-lg border border-flame-border bg-flame-bg text-flame-text outline-none placeholder:text-flame-text-tertiary focus:border-flame-accent transition-colors"
      />
      <Combobox.Options className="rounded-lg border border-flame-border shadow-lg bg-flame-bg py-1 min-w-[220px] overflow-hidden">
        {FRUIT_KEYS.map((key) => (
          <Combobox.Option
            key={key}
            value={key}
            className={`px-4 py-2 text-sm cursor-pointer transition-colors hover:bg-flame-bg-secondary data-[active=true]:bg-flame-bg-secondary ${
              value === key ? 'text-flame-accent font-medium' : 'text-flame-text'
            }`}
          >
            {t[key]}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
}

function ComboboxSection({
  t,
  code,
  codeHtml,
}: {
  t: Record<string, string>;
  code: string;
  codeHtml: string;
}) {
  return (
    <ComponentDemo code={code} codeHtml={codeHtml}>
      <ComboboxDemo t={t} />
    </ComponentDemo>
  );
}

export { ComboboxSection };
