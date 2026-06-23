import { Combobox } from '@flame/ui';
import { useState } from 'react';
import { ComponentDemo } from '../component-demo';

const FRUIT_KEYS = ['apple', 'banana', 'cherry', 'grape', 'mango'] as const;

function ComboboxDemo({ t }: { t: Record<string, string> }) {
  const [value, setValue] = useState('');
  const [search, setSearch] = useState('');

  const filtered = FRUIT_KEYS.filter((key) => t[key].toLowerCase().includes(search.toLowerCase()));
  const selectedLabel = value ? t[value] : undefined;

  return (
    <Combobox value={value} onChange={setValue} search={search} onSearchChange={setSearch} transition>
      <Combobox.Trigger>
        <button
          type="button"
          className="inline-flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-flame-border bg-flame-bg text-flame-text hover:bg-flame-bg-secondary transition-colors min-w-[200px]"
        >
          <span className={selectedLabel ? '' : 'text-flame-text-secondary'}>
            {selectedLabel || t.placeholder}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="text-flame-text-secondary"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </Combobox.Trigger>
      <Combobox.Options className="rounded-lg border border-flame-border shadow-lg bg-flame-bg min-w-[200px] overflow-hidden">
        <div className="p-1.5 border-b border-flame-border">
          <Combobox.Search
            placeholder={t.searchPlaceholder}
            className="w-full px-3 py-1.5 text-sm bg-flame-bg-secondary rounded-md outline-none placeholder:text-flame-text-tertiary text-flame-text"
          />
        </div>
        <div className="py-1">
          {filtered.length > 0 ? (
            filtered.map((key) => (
              <Combobox.Option
                key={key}
                value={key}
                className={`px-4 py-2 text-sm cursor-pointer transition-colors hover:bg-flame-bg-secondary ${
                  value === key ? 'text-flame-accent font-medium' : 'text-flame-text'
                }`}
              >
                {t[key]}
              </Combobox.Option>
            ))
          ) : (
            <p className="px-4 py-2 text-sm text-flame-text-tertiary">{t.noResults}</p>
          )}
        </div>
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
